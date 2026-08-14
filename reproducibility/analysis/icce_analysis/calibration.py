from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd
from scipy import stats

from .config import GROUPS, GROUP_LABELS
from .course_data import build_time_calibration_long
from .io_utils import load_reclassification


def _category(gap: float) -> str:
    if gap > 10:
        return "Overconfident"
    if gap < -10:
        return "Underconfident"
    return "Well-calibrated"


def analyze_calibration(data_dir: Path, output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    reclass = load_reclassification(data_dir / "reclassification.csv")
    long = build_time_calibration_long(data_dir, reclassification=reclass)
    cal = long.dropna(subset=["calibration_gap"]).copy()

    summary_rows = []
    for occasion in ["Topic 2", "Topic 3", "Topic 4", "Final exam"]:
        d = cal[cal["occasion"] == occasion]
        groups = [
            d.loc[d["group"] == g, "calibration_gap"].dropna().to_numpy(float)
            for g in GROUPS
        ]
        f_stat, anova_p = stats.f_oneway(*groups)
        h_stat, kw_p = stats.kruskal(*groups)
        for group, x in zip(GROUPS, groups):
            summary_rows.append({
                "occasion": occasion,
                "group": GROUP_LABELS[group],
                "n": len(x),
                "mean_gap": float(np.mean(x)),
                "sd_gap": float(np.std(x, ddof=1)) if len(x) > 1 else np.nan,
                "anova_p": float(anova_p),
                "kruskal_p": float(kw_p),
            })
    pd.DataFrame(summary_rows).to_csv(output_dir / "calibration_gap_summary.csv", index=False)

    topics = cal[cal["occasion"].str.startswith("Topic")].copy()
    topics["category"] = topics["calibration_gap"].map(_category)
    category = (
        topics.groupby(["group_label", "category"])
        .size()
        .rename("n")
        .reset_index()
    )
    category["rate"] = category.groupby("group_label")["n"].transform(lambda x: x / x.sum())
    category.to_csv(output_dir / "calibration_category_rates.csv", index=False)

    corr_rows = []
    for scope, d in [
        ("Topics 2-4 pooled", topics),
        ("Final exam", cal[cal["occasion"] == "Final exam"]),
    ]:
        for group in list(GROUPS) + [None]:
            dd = d if group is None else d[d["group"] == group]
            dd = dd.dropna(subset=["self_assessment_100", "performance"])
            if len(dd) >= 3 and dd["self_assessment_100"].nunique() > 1 and dd["performance"].nunique() > 1:
                r, p = stats.pearsonr(dd["self_assessment_100"], dd["performance"])
            else:
                r, p = np.nan, np.nan
            corr_rows.append({
                "scope": scope,
                "group": "All" if group is None else GROUP_LABELS[group],
                "n_records": len(dd),
                "n_students": dd["email"].nunique(),
                "pearson_r": float(r) if np.isfinite(r) else np.nan,
                "p": float(p) if np.isfinite(p) else np.nan,
            })
    pd.DataFrame(corr_rows).to_csv(output_dir / "calibration_correlations.csv", index=False)
    print(f"[calibration] wrote outputs to {output_dir}")
