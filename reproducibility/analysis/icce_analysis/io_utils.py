from __future__ import annotations

from pathlib import Path
from typing import Iterable

import numpy as np
import pandas as pd

from .config import GROUPS, GROUP_LABELS, LABEL_TO_GROUP


def read_csv(path: Path) -> pd.DataFrame:
    if not path.exists():
        raise FileNotFoundError(f"Missing required file: {path}")
    try:
        return pd.read_csv(path, encoding="utf-8-sig")
    except UnicodeDecodeError:
        return pd.read_csv(path, encoding="latin1")


def normalize_email(value) -> str:
    if pd.isna(value):
        return ""
    return str(value).strip().lower().replace("\u200c", "")


def normalize_group(value) -> str | None:
    if pd.isna(value):
        return None
    raw = str(value).strip()
    if raw in GROUPS:
        return raw
    if raw in LABEL_TO_GROUP:
        return LABEL_TO_GROUP[raw]

    s = raw.lower()
    if s in {"1", "g1", "group1", "group 1"}:
        return "Group 1"
    if s in {"2", "g2", "group2", "group 2"}:
        return "Group 2"
    if s in {"3", "g3", "group3", "group 3"}:
        return "Group 3"
    if "no" in s and "llm" in s:
        return "Group 1"
    if "unrestricted" in s or "unguided" in s:
        return "Group 2"
    if "guided" in s:
        return "Group 3"
    return None


def student_rows(raw: pd.DataFrame) -> pd.DataFrame:
    """Return actual student rows from the course export.

    The course files have three metadata rows after the CSV header, so actual
    students begin at raw.iloc[3:].
    """
    required = {"Username", "Group"}
    missing = required - set(raw.columns)
    if missing:
        raise ValueError(f"Course file is missing columns: {sorted(missing)}")

    out = raw.iloc[3:].copy()
    out["email"] = out["Username"].map(normalize_email)
    out["group"] = out["Group"].map(normalize_group)
    out = out[(out["email"] != "") & out["group"].isin(GROUPS)].copy()
    return out


def metadata_value(raw: pd.DataFrame, row: int, col_idx: int) -> str:
    if row >= len(raw) or col_idx >= len(raw.columns):
        return ""
    value = raw.iloc[row, col_idx]
    return "" if pd.isna(value) else str(value).strip()


def find_sum_columns(raw: pd.DataFrame) -> list[int]:
    """Locate score-sum columns from metadata rows 0 and 1."""
    indices: list[int] = []
    for i in range(len(raw.columns)):
        if metadata_value(raw, 0, i).upper() == "SUM" or metadata_value(raw, 1, i).upper() == "SUM":
            indices.append(i)
    return indices


def find_practice_sum_column(raw: pd.DataFrame) -> int:
    sums = find_sum_columns(raw)
    if not sums:
        raise ValueError("Could not locate a Practice SUM column.")
    return sums[0]


def find_assessment_sum_column(raw: pd.DataFrame) -> int:
    sums = find_sum_columns(raw)
    if not sums:
        raise ValueError("Could not locate an assessment SUM column.")
    return sums[-1]


def find_practice_time_columns(raw: pd.DataFrame) -> list[int]:
    practice_sum = find_practice_sum_column(raw)
    cols = [
        i for i in range(practice_sum)
        if metadata_value(raw, 1, i).lower() == "time"
    ]
    if not cols:
        raise ValueError("Could not locate practice-time columns.")
    return cols


def find_assessment_time_column(raw: pd.DataFrame) -> int:
    candidates = [
        i for i in range(len(raw.columns))
        if metadata_value(raw, 0, i).lower() == "time"
    ]
    if not candidates:
        raise ValueError("Could not locate assessment Time column.")
    return candidates[-1]


def find_self_assessment_column(raw: pd.DataFrame) -> int:
    candidates = [
        i for i in range(len(raw.columns))
        if "self reported understanding" in metadata_value(raw, 1, i).lower()
    ]
    if not candidates:
        raise ValueError("Could not locate Self Reported Understanding column.")
    return candidates[-1]


def numeric(series: pd.Series) -> pd.Series:
    return pd.to_numeric(series, errors="coerce")


def parse_minutes(value) -> float:
    """Convert numeric or mm:ss / hh:mm:ss time values to minutes."""
    if pd.isna(value):
        return np.nan
    if isinstance(value, (int, float, np.integer, np.floating)):
        value = float(value)
        return value if value > 0 else np.nan

    s = str(value).strip()
    if not s:
        return np.nan

    persian = "۰۱۲۳۴۵۶۷۸۹"
    arabic = "٠١٢٣٤٥٦٧٨٩"
    english = "0123456789"
    for src, dst in zip(persian, english):
        s = s.replace(src, dst)
    for src, dst in zip(arabic, english):
        s = s.replace(src, dst)

    s = (
        s.replace(",", "")
        .replace("minutes", "")
        .replace("minute", "")
        .replace("mins", "")
        .replace("min", "")
        .replace("دقیقه", "")
        .strip()
    )

    if ":" in s:
        try:
            parts = [float(x.strip()) for x in s.split(":")]
        except ValueError:
            return np.nan
        if len(parts) == 2:
            minutes = parts[0] + parts[1] / 60
        elif len(parts) == 3:
            minutes = parts[0] * 60 + parts[1] + parts[2] / 60
        else:
            return np.nan
        return minutes if minutes > 0 else np.nan

    try:
        minutes = float(s)
    except ValueError:
        return np.nan
    return minutes if minutes > 0 else np.nan


def load_reclassification(path: Path) -> dict[str, str]:
    """Load a private enacted-group override file.

    Expected columns: email,enacted_group
    The file should remain local/private and is intentionally gitignored.
    """
    if not path.exists():
        return {}
    df = pd.read_csv(path, encoding="utf-8-sig")
    required = {"email", "enacted_group"}
    if not required.issubset(df.columns):
        raise ValueError(f"{path} must contain columns: email,enacted_group")
    mapping = {}
    for _, row in df.iterrows():
        email = normalize_email(row["email"])
        group = normalize_group(row["enacted_group"])
        if email and group:
            mapping[email] = group
    return mapping


def apply_reclassification(df: pd.DataFrame, mapping: dict[str, str], group_col: str = "group") -> pd.DataFrame:
    out = df.copy()
    if not mapping:
        return out
    out[group_col] = [
        mapping.get(email, group)
        for email, group in zip(out["email"], out[group_col])
    ]
    return out


def group_label(group: str) -> str:
    return GROUP_LABELS.get(group, group)


def ensure_same_ids(frames: Iterable[pd.DataFrame], id_col: str) -> None:
    frames = list(frames)
    if not frames:
        return
    reference = list(frames[0][id_col].astype(str))
    for i, frame in enumerate(frames[1:], start=2):
        current = list(frame[id_col].astype(str))
        if current != reference:
            raise ValueError(f"Annotator file {i} does not have the same {id_col} order as annotator 1.")
