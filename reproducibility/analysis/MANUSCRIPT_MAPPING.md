# Mapping from public analysis code to the camera-ready paper

This note documents which script supports each quantitative component of the
paper and which inputs remain private.

## Section 4.1 — participant flow and baseline balance

`01_flow_balance.py` reproduces the camera-ready Week-1 ANOVA, p-values,
eta-squared values, and attrition exact test from privacy-safe aggregate inputs.

The final analytic Week-1 aggregates are stored in `config.py` because the
original analysis script itself used these final post-filtering aggregate
statistics. They contain no participant identifiers.

## Section 4.2 — rule-following compliance

`02_rule_following.py` reads the six consensus feedback DOCX files locally. It
computes assigned-group and enacted-group student-level compliance, rule-level
rates, and practice-specific comparisons.

The identity-level behavior-defined reclassification mapping is intentionally
not public. It is supplied locally in `data_private/reclassification.csv`.

## Section 3.5 — inter-rater reliability

`03_inter_rater_reliability.py` reads the three independent, pre-consensus
annotator Excel files and reports:
- Fleiss' kappa for each R1-R6 rule,
- pooled Fleiss' kappa across all rule decisions,
- observed pair agreement,
- unanimous agreement,
- private majority-vote labels for downstream checks.

The annotator sheets are not included in the public repository.

## Section 4.3 — learning outcomes

`04_learning_outcomes.py` reconstructs the final analytic outcome table from the
private Topic 2-4 and Final course exports. It reports descriptive statistics,
ANOVA, Kruskal-Wallis, Hedges' g, Welch p-values, Mann-Whitney p-values, and
2,000-resample percentile bootstrap confidence intervals.

With the authorized study files used during package validation, this module
reproduced the camera-ready Table 3 group means and SDs.

## Section 4.4 — time-on-task and calibration

`05_time_on_task.py` and `06_calibration.py` implement the documented
calculations from the private course exports:
- practice-time sums from per-question self-reported minutes,
- automatically logged quiz/final time,
- self-assessment rescaled from 1-10 to 0-100,
- calibration gap = self-assessment minus no-help performance,
- +/-10 point calibration categories,
- Pearson correlations.

Exact reproduction of camera-ready Table 4 requires the same private
preprocessing, missing-data handling, and group mapping used for the final
analysis. Those identity-level inputs are deliberately not embedded in the
public code.

## Privacy boundary

The public repository provides the full statistical logic but not participant
records, raw chats, identity maps, assessment records, or independent annotator
files. This matches the paper's privacy/data-availability statement.
