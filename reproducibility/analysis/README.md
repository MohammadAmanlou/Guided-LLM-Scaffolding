# ICCE 2026 analysis scripts

Clean, modular analysis code for the paper:

**Beyond Access: Guided LLM Scaffolding for Independent Learning in Undergraduate Statistics**

This package consolidates and rewrites the study's original analysis scripts
into a reproducible, GitHub-ready structure. Participant-level data are **not**
included and should not be committed.

## What is covered

| Paper component | Script | Main outputs |
|---|---|---|
| §4.1 Participant flow & Week-1 balance | `scripts/01_flow_balance.py` | balance table, attrition table, Fisher–Freeman–Halton exact p |
| §4.2 Rule-following compliance | `scripts/02_rule_following.py` | assigned/enacted compliance summaries, rule-level rates, practice trends |
| §3.5 Inter-rater reliability | `scripts/03_inter_rater_reliability.py` | per-rule and pooled Fleiss' κ, observed agreement, majority vote |
| §4.3 Learning outcomes | `scripts/04_learning_outcomes.py` | descriptive stats, ANOVA, Kruskal–Wallis, Hedges' g, Welch p, 2,000-bootstrap CIs |
| §4.4 Time-on-task | `scripts/05_time_on_task.py` | practice/quiz/final time summaries and omnibus tests |
| §4.4 Calibration | `scripts/06_calibration.py` | calibration gaps, category rates, Pearson correlations |

## Design choices

- No hard-coded local Windows paths or `/mnt/data` paths.
- One deterministic random seed (`20260806`).
- `2,000` within-group bootstrap resamples, matching the camera-ready methods.
- All participant identifiers and reclassification mappings remain local/private.
- Assigned and enacted group analyses are kept conceptually separate.
- The IRR script uses the **three pre-consensus annotator files**, not majority-vote labels.
- Full transcripts and participant-level assessment data are intentionally excluded.

## Installation

Python 3.10+ is recommended.

```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
```

## Private input data

See `data_template/README.md`. Create a local `data_private/` directory and copy
your authorized private study files there. `data_private/` is gitignored.

For the course files, use these private local names:

```text
topic1.csv
topic2.csv
topic3.csv
topic4.csv
final.csv
```

## Run

Run every analysis:

```bash
python run_all.py
```

Or run a specific component:

```bash
python scripts/04_learning_outcomes.py
python scripts/03_inter_rater_reliability.py
```

Every script also accepts custom directories:

```bash
python scripts/04_learning_outcomes.py \
  --data-dir /path/to/private/data \
  --output-dir /path/to/outputs
```

## Important reproducibility note

The public code can reproduce the statistical pipeline when the authorized
private participant-level inputs are available. The repository intentionally
does not make those inputs public because they contain learner records covered
by consent/privacy constraints.

The optional `reclassification.csv` is the private mapping used to reproduce
behavior-defined enacted groups without exposing participant identities in the
public repository.

For the paper-to-script mapping and privacy boundary, see `MANUSCRIPT_MAPPING.md`.

## Statistical conventions

- Three-group outcomes: one-way ANOVA plus Kruskal–Wallis robustness check.
- Key pairwise effects: mean difference, Hedges' g, Welch's t-test p-value, and
  percentile-bootstrap 95% CI using 2,000 within-group resamples.
- Rule-level binary compliance: Fisher's exact test.
- Attrition: Fisher–Freeman–Halton exact test for the 3×2 table.
- Inter-rater reliability: Fleiss' κ for three raters and binary rule labels.
- Calibration gap: rescaled self-assessment (1–10 → 0–100) minus matched
  no-help performance; ±10 points is the well-calibrated band.

