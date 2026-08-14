from __future__ import annotations

from itertools import combinations
from pathlib import Path

import numpy as np
import pandas as pd
from scipy import stats

from .config import GROUPS, GROUP_LABELS, RANDOM_SEED
from .course_data import build_final_analytic_wide
from .io_utils import load_reclassification
from .stats_utils import eta_squared, pairwise_summary


OUTCOMES = (
    "practice2", "quiz2",
    "practice3", "quiz3",
    "practice4", "quiz4",
    "final",
)


def analyze_learning_outcomes(data_dir: Path, output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    reclass = load_reclassification(data_dir / "reclassification.csv")
    wide = build_final_analytic_wide(data_dir, reclassification=reclass)
    wide.to_csv(output_dir / "learning_outcomes_private_wide.csv", index=False)

    desc_rows = []
    omnibus_rows = []
    pair_rows = []
    seed_offset = 0

    for outcome in OUTCOMES:
        groups = [
            wide.loc[wide["group"] == g, outcome].dropna().to_numpy(float)
            for g in GROUPS
        ]
        f_stat, anova_p = stats.f_oneway(*groups)
        h_stat, kw_p = stats.kruskal(*groups)

        omnibus_rows.append({
            "outcome": outcome,
            "anova_F": float(f_stat),
            "anova_p": float(anova_p),
            "eta_squared": eta_squared(groups),
            "kruskal_H": float(h_stat),
            "kruskal_p": float(kw_p),
        })

        for group, values in zip(GROUPS, groups):
            desc_rows.append({
                "outcome": outcome,
                "group": GROUP_LABELS[group],
                "n": len(values),
                "mean": float(np.mean(values)),
                "sd": float(np.std(values, ddof=1)) if len(values) > 1 else np.nan,
                "median": float(np.median(values)),
            })

        for ga, gb in combinations(GROUPS, 2):
            a = wide.loc[wide["group"] == ga, outcome]
            b = wide.loc[wide["group"] == gb, outcome]
            row = pairwise_summary(a, b, seed=RANDOM_SEED + seed_offset)
            seed_offset += 1
            pair_rows.append({
                "outcome": outcome,
                "group_a": GROUP_LABELS[ga],
                "group_b": GROUP_LABELS[gb],
                **row,
            })

    pd.DataFrame(desc_rows).to_csv(output_dir / "learning_outcomes_descriptives.csv", index=False)
    pd.DataFrame(omnibus_rows).to_csv(output_dir / "learning_outcomes_omnibus.csv", index=False)
    pd.DataFrame(pair_rows).to_csv(output_dir / "learning_outcomes_pairwise.csv", index=False)
    print(f"[outcomes] wrote outputs to {output_dir}")
