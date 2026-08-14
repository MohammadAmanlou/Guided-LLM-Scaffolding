from __future__ import annotations

import math
from pathlib import Path

import numpy as np
import pandas as pd
from scipy import stats

from .config import (
    ASSIGNED_COUNTS,
    FINAL_ANALYTIC_COUNTS,
    GROUPS,
    GROUP_LABELS,
    WEEK1_FINAL_ANALYTIC_AGGREGATES,
)
from .stats_utils import fisher_freeman_halton_3x2


def _anova_from_summary(metric: str) -> dict:
    """One-way ANOVA reconstructed from group n/mean/SD aggregates."""
    ns = np.array([WEEK1_FINAL_ANALYTIC_AGGREGATES[g]["n"] for g in GROUPS], dtype=float)
    means = np.array(
        [WEEK1_FINAL_ANALYTIC_AGGREGATES[g][f"{metric}_mean"] for g in GROUPS],
        dtype=float,
    )
    sds = np.array(
        [WEEK1_FINAL_ANALYTIC_AGGREGATES[g][f"{metric}_sd"] for g in GROUPS],
        dtype=float,
    )

    grand = float(np.sum(ns * means) / np.sum(ns))
    ss_between = float(np.sum(ns * (means - grand) ** 2))
    ss_within = float(np.sum((ns - 1) * sds**2))
    df_between = len(GROUPS) - 1
    df_within = int(np.sum(ns) - len(GROUPS))

    f_stat = (ss_between / df_between) / (ss_within / df_within)
    p_value = float(stats.f.sf(f_stat, df_between, df_within))
    eta_squared = ss_between / (ss_between + ss_within)
    return {
        "F": float(f_stat),
        "p": p_value,
        "eta_squared": float(eta_squared),
    }


def _max_pairwise_smd(metric: str) -> float:
    values = []
    for i, g1 in enumerate(GROUPS):
        for g2 in GROUPS[i + 1 :]:
            a = WEEK1_FINAL_ANALYTIC_AGGREGATES[g1]
            b = WEEK1_FINAL_ANALYTIC_AGGREGATES[g2]
            pooled = math.sqrt(
                ((a["n"] - 1) * a[f"{metric}_sd"] ** 2 + (b["n"] - 1) * b[f"{metric}_sd"] ** 2)
                / (a["n"] + b["n"] - 2)
            )
            values.append(abs(a[f"{metric}_mean"] - b[f"{metric}_mean"]) / pooled)
    return float(max(values))


def analyze_flow_and_balance(data_dir: Path, output_dir: Path) -> None:
    """Reproduce participant-flow and camera-ready Week-1 balance results.

    Week-1 inferential tests are reconstructed from the privacy-safe aggregate
    n/mean/SD values used in the camera-ready analysis. No participant
    identifiers are required for this section.
    """
    del data_dir  # Kept in the common function signature for run_all.py.
    output_dir.mkdir(parents=True, exist_ok=True)

    rows = []
    for metric, outcome_name in [("practice", "Practice 1"), ("quiz", "Quiz 1")]:
        test = _anova_from_summary(metric)
        max_smd = _max_pairwise_smd(metric)
        for group in GROUPS:
            s = WEEK1_FINAL_ANALYTIC_AGGREGATES[group]
            rows.append({
                "outcome": outcome_name,
                "group": GROUP_LABELS[group],
                "n": s["n"],
                "mean": s[f"{metric}_mean"],
                "sd": s[f"{metric}_sd"],
                "anova_F": test["F"],
                "anova_p": test["p"],
                "eta_squared": test["eta_squared"],
                "max_pairwise_smd": max_smd,
            })

    pd.DataFrame(rows).to_csv(output_dir / "week1_balance.csv", index=False)

    assigned = np.array([ASSIGNED_COUNTS[g] for g in GROUPS], dtype=int)
    retained = np.array([FINAL_ANALYTIC_COUNTS[g] for g in GROUPS], dtype=int)
    dropped = assigned - retained
    exact_p = fisher_freeman_halton_3x2(assigned, retained)

    flow = pd.DataFrame({
        "group": [GROUP_LABELS[g] for g in GROUPS],
        "assigned_n": assigned,
        "retained_n": retained,
        "dropped_n": dropped,
        "dropout_rate": dropped / assigned,
    })
    flow["fisher_freeman_halton_p"] = exact_p
    flow.to_csv(output_dir / "participant_flow_attrition.csv", index=False)

    print(f"[flow] wrote {output_dir / 'week1_balance.csv'}")
    print(f"[flow] wrote {output_dir / 'participant_flow_attrition.csv'}")
