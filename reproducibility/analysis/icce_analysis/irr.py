from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd

from .config import IRR_FILENAMES, RULE_COLUMNS, RULE_LABELS
from .io_utils import ensure_same_ids
from .stats_utils import fleiss_kappa_binary


def _binary(series: pd.Series) -> np.ndarray:
    mapped = series.astype(str).str.strip().str.upper().map({"YES": 1, "NO": 0})
    if mapped.isna().any():
        bad = series[mapped.isna()].unique()
        raise ValueError(f"IRR file has non YES/NO values: {bad}")
    return mapped.to_numpy(dtype=int)


def analyze_irr(data_dir: Path, output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    irr_dir = data_dir / "irr"

    frames = []
    for filename in IRR_FILENAMES:
        path = irr_dir / filename
        if not path.exists():
            raise FileNotFoundError(f"Missing annotator file: {path}")
        frames.append(pd.read_excel(path, sheet_name="Ratings"))

    ensure_same_ids(frames, "Record_ID")

    rows = []
    pooled_items = []
    for rule, column in RULE_COLUMNS.items():
        votes = np.column_stack([_binary(df[column]) for df in frames])
        kappa, pair_agreement = fleiss_kappa_binary(votes)
        unanimous = float(np.mean(np.all(votes == votes[:, [0]], axis=1)))
        rows.append({
            "rule": rule,
            "rule_label": RULE_LABELS[rule],
            "n_items": len(votes),
            "fleiss_kappa": kappa,
            "observed_pair_agreement": pair_agreement,
            "unanimous_agreement_rate": unanimous,
        })
        pooled_items.append(votes)

    pooled = np.vstack(pooled_items)
    overall_kappa, overall_pair = fleiss_kappa_binary(pooled)
    overall_unanimous = float(np.mean(np.all(pooled == pooled[:, [0]], axis=1)))

    rows.append({
        "rule": "OVERALL_POOLED",
        "rule_label": "All rule decisions pooled",
        "n_items": len(pooled),
        "fleiss_kappa": overall_kappa,
        "observed_pair_agreement": overall_pair,
        "unanimous_agreement_rate": overall_unanimous,
    })

    out = pd.DataFrame(rows)
    out.to_csv(output_dir / "irr_fleiss_kappa.csv", index=False)

    # Majority-vote consensus is useful for downstream validation, but contains
    # participant-level labels and should remain in the private output folder.
    consensus = frames[0][["Record_ID", "Student_ID", "Original_Group", "Practice"]].copy()
    for rule, column in RULE_COLUMNS.items():
        votes = np.column_stack([_binary(df[column]) for df in frames])
        consensus[rule] = (votes.sum(axis=1) >= 2).astype(int)
    consensus.to_csv(output_dir / "irr_majority_vote_private.csv", index=False)

    print(f"[irr] wrote {output_dir / 'irr_fleiss_kappa.csv'}")
