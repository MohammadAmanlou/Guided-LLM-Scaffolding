from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd

from .config import GROUPS, GROUP_LABELS, INTERVENTION_TOPICS, TOPIC_FILENAMES, FINAL_FILENAME
from .io_utils import (
    apply_reclassification,
    find_assessment_sum_column,
    find_assessment_time_column,
    find_practice_sum_column,
    find_practice_time_columns,
    find_self_assessment_column,
    numeric,
    parse_minutes,
    read_csv,
    student_rows,
)


def load_topic(data_dir: Path, topic: int, reclassification=None) -> tuple[pd.DataFrame, pd.DataFrame]:
    raw = read_csv(data_dir / TOPIC_FILENAMES[topic])
    data = student_rows(raw)
    if reclassification:
        data = apply_reclassification(data, reclassification)

    p_col = find_practice_sum_column(raw)
    q_col = find_assessment_sum_column(raw)

    out = pd.DataFrame({
        "email": data["email"].values,
        "name": data["Name"].values if "Name" in data.columns else "",
        "group": data["group"].values,
        f"practice{topic}": numeric(data.iloc[:, p_col]).values,
        f"quiz{topic}": numeric(data.iloc[:, q_col]).values,
    })
    return raw, out


def load_final(data_dir: Path, reclassification=None) -> tuple[pd.DataFrame, pd.DataFrame]:
    raw = read_csv(data_dir / FINAL_FILENAME)
    data = student_rows(raw)
    if reclassification:
        data = apply_reclassification(data, reclassification)
    score_col = find_assessment_sum_column(raw)
    out = pd.DataFrame({
        "email": data["email"].values,
        "name": data["Name"].values if "Name" in data.columns else "",
        "group": data["group"].values,
        "final": numeric(data.iloc[:, score_col]).values,
    })
    return raw, out


def build_final_analytic_wide(data_dir: Path, reclassification=None) -> pd.DataFrame:
    """Merge Topics 2-4 and Final onto the Final-file roster."""
    _, final = load_final(data_dir, reclassification=reclassification)
    wide = final[["email", "name", "group", "final"]].copy()

    for topic in INTERVENTION_TOPICS:
        _, td = load_topic(data_dir, topic, reclassification=reclassification)
        td = td.drop(columns=["name"])
        wide = wide.merge(td, on=["email", "group"], how="left")

    return wide


def build_time_calibration_long(data_dir: Path, reclassification=None) -> pd.DataFrame:
    """Build participant-topic records for time and calibration analyses."""
    _, final = load_final(data_dir, reclassification=reclassification)
    final_roster = set(final["email"])
    rows = []

    for topic in INTERVENTION_TOPICS:
        raw = read_csv(data_dir / TOPIC_FILENAMES[topic])
        data = student_rows(raw)
        if reclassification:
            data = apply_reclassification(data, reclassification)
        data = data[data["email"].isin(final_roster)].copy()

        practice_time_cols = find_practice_time_columns(raw)
        quiz_time_col = find_assessment_time_column(raw)
        self_col = find_self_assessment_column(raw)
        quiz_col = find_assessment_sum_column(raw)

        for _, row in data.iterrows():
            practice_times = [parse_minutes(row.iloc[c]) for c in practice_time_cols]
            practice_times = [x for x in practice_times if np.isfinite(x)]
            practice_time = float(np.sum(practice_times)) if practice_times else np.nan
            quiz_time = parse_minutes(row.iloc[quiz_time_col])
            self100 = pd.to_numeric(pd.Series([row.iloc[self_col]]), errors="coerce").iloc[0]
            self100 = self100 * 10 if pd.notna(self100) else np.nan
            quiz = pd.to_numeric(pd.Series([row.iloc[quiz_col]]), errors="coerce").iloc[0]

            rows.append({
                "email": row["email"],
                "group": row["group"],
                "occasion": f"Topic {topic}",
                "topic": topic,
                "practice_time": practice_time,
                "assessment_time": quiz_time,
                "self_assessment_100": self100,
                "performance": quiz,
                "calibration_gap": self100 - quiz if pd.notna(self100) and pd.notna(quiz) else np.nan,
            })

    raw = read_csv(data_dir / FINAL_FILENAME)
    data = student_rows(raw)
    if reclassification:
        data = apply_reclassification(data, reclassification)
    data = data[data["email"].isin(final_roster)].copy()

    time_col = find_assessment_time_column(raw)
    self_col = find_self_assessment_column(raw)
    score_col = find_assessment_sum_column(raw)

    for _, row in data.iterrows():
        assessment_time = parse_minutes(row.iloc[time_col])
        self100 = pd.to_numeric(pd.Series([row.iloc[self_col]]), errors="coerce").iloc[0]
        self100 = self100 * 10 if pd.notna(self100) else np.nan
        score = pd.to_numeric(pd.Series([row.iloc[score_col]]), errors="coerce").iloc[0]
        rows.append({
            "email": row["email"],
            "group": row["group"],
            "occasion": "Final exam",
            "topic": np.nan,
            "practice_time": np.nan,
            "assessment_time": assessment_time,
            "self_assessment_100": self100,
            "performance": score,
            "calibration_gap": self100 - score if pd.notna(self100) and pd.notna(score) else np.nan,
        })

    out = pd.DataFrame(rows)
    out["group_label"] = out["group"].map(GROUP_LABELS)
    return out
