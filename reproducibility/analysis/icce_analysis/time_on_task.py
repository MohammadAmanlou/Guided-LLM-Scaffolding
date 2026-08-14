from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd
from scipy import stats

from .config import GROUPS, GROUP_LABELS
from .course_data import build_time_calibration_long
from .io_utils import load_reclassification


def analyze_time_on_task(data_dir: Path, output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    reclass = load_reclassification(data_dir / "reclassification.csv")
    long = build_time_calibration_long(data_dir, reclassification=reclass)
    long.to_csv(output_dir / "time_calibration_private_long.csv", index=False)

    topic = long[long["occasion"].str.startswith("Topic")].copy()

    # Paper-level time summaries use one student-level mean across Topics 2-4.
    student_time = (
        topic.groupby(["email", "group"], as_index=False)[["practice_time", "assessment_time"]]
        .mean()
    )

    rows = []
    for metric, label in [
        ("practice_time", "Practice time mean"),
        ("assessment_time", "Quiz time mean"),
    ]:
        values = [
            student_time.loc[student_time["group"] == g, metric].dropna().to_numpy(float)
            for g in GROUPS
        ]
        f_stat, anova_p = stats.f_oneway(*values)
        h_stat, kw_p = stats.kruskal(*values)
        for group, x in zip(GROUPS, values):
            rows.append({
                "metric": label,
                "group": GROUP_LABELS[group],
                "n": len(x),
                "mean": float(np.mean(x)),
                "sd": float(np.std(x, ddof=1)) if len(x) > 1 else np.nan,
                "anova_p": float(anova_p),
                "kruskal_p": float(kw_p),
            })

    final = long[long["occasion"] == "Final exam"].copy()
    values = [
        final.loc[final["group"] == g, "assessment_time"].dropna().to_numpy(float)
        for g in GROUPS
    ]
    f_stat, anova_p = stats.f_oneway(*values)
    h_stat, kw_p = stats.kruskal(*values)
    for group, x in zip(GROUPS, values):
        rows.append({
            "metric": "Final-exam time",
            "group": GROUP_LABELS[group],
            "n": len(x),
            "mean": float(np.mean(x)),
            "sd": float(np.std(x, ddof=1)) if len(x) > 1 else np.nan,
            "anova_p": float(anova_p),
            "kruskal_p": float(kw_p),
        })

    pd.DataFrame(rows).to_csv(output_dir / "time_on_task_summary.csv", index=False)
    print(f"[time] wrote {output_dir / 'time_on_task_summary.csv'}")
