from __future__ import annotations

import math
from itertools import product

import numpy as np
from scipy import stats

from .config import N_BOOTSTRAP, RANDOM_SEED


def finite(values) -> np.ndarray:
    x = np.asarray(values, dtype=float)
    return x[np.isfinite(x)]


def mean_sd(values) -> tuple[float, float]:
    x = finite(values)
    if len(x) == 0:
        return np.nan, np.nan
    return float(x.mean()), float(x.std(ddof=1)) if len(x) > 1 else np.nan


def pooled_sd(a, b) -> float:
    a, b = finite(a), finite(b)
    if len(a) < 2 or len(b) < 2:
        return np.nan
    return float(np.sqrt(
        ((len(a) - 1) * a.var(ddof=1) + (len(b) - 1) * b.var(ddof=1))
        / (len(a) + len(b) - 2)
    ))


def cohens_d(a, b) -> float:
    """Cohen's d for b - a."""
    a, b = finite(a), finite(b)
    s = pooled_sd(a, b)
    if not np.isfinite(s) or s == 0:
        return np.nan
    return float((b.mean() - a.mean()) / s)


def hedges_g(a, b) -> float:
    """Hedges' g for b - a."""
    a, b = finite(a), finite(b)
    d = cohens_d(a, b)
    if not np.isfinite(d):
        return np.nan
    df = len(a) + len(b) - 2
    correction = 1 - 3 / (4 * df - 1)
    return float(correction * d)


def bootstrap_mean_difference(
    a,
    b,
    n_boot: int = N_BOOTSTRAP,
    seed: int = RANDOM_SEED,
) -> tuple[float, float]:
    """Percentile bootstrap CI for mean(b) - mean(a)."""
    a, b = finite(a), finite(b)
    if len(a) == 0 or len(b) == 0:
        return np.nan, np.nan
    rng = np.random.default_rng(seed)
    samples = np.empty(n_boot, dtype=float)
    for i in range(n_boot):
        aa = rng.choice(a, size=len(a), replace=True)
        bb = rng.choice(b, size=len(b), replace=True)
        samples[i] = bb.mean() - aa.mean()
    low, high = np.quantile(samples, [0.025, 0.975])
    return float(low), float(high)


def pairwise_summary(a, b, seed: int = RANDOM_SEED) -> dict:
    """Exploratory two-group statistics for b - a."""
    a, b = finite(a), finite(b)
    row = {
        "n_a": len(a),
        "n_b": len(b),
        "mean_a": np.mean(a) if len(a) else np.nan,
        "mean_b": np.mean(b) if len(b) else np.nan,
        "mean_difference_b_minus_a": (np.mean(b) - np.mean(a)) if len(a) and len(b) else np.nan,
        "hedges_g_b_minus_a": hedges_g(a, b),
        "welch_p": np.nan,
        "mann_whitney_p": np.nan,
        "bootstrap_ci_low": np.nan,
        "bootstrap_ci_high": np.nan,
    }
    if len(a) >= 2 and len(b) >= 2:
        row["welch_p"] = float(stats.ttest_ind(a, b, equal_var=False).pvalue)
        row["mann_whitney_p"] = float(stats.mannwhitneyu(a, b, alternative="two-sided").pvalue)
        lo, hi = bootstrap_mean_difference(a, b, seed=seed)
        row["bootstrap_ci_low"] = lo
        row["bootstrap_ci_high"] = hi
    return row


def eta_squared(groups) -> float:
    clean = [finite(g) for g in groups]
    all_values = np.concatenate(clean)
    if len(all_values) == 0:
        return np.nan
    grand = all_values.mean()
    ss_between = sum(len(g) * (g.mean() - grand) ** 2 for g in clean if len(g))
    ss_total = ((all_values - grand) ** 2).sum()
    return float(ss_between / ss_total) if ss_total > 0 else np.nan


def holm_adjust(p_values):
    p = np.asarray(p_values, dtype=float)
    out = np.full(len(p), np.nan)
    valid = np.where(np.isfinite(p))[0]
    if len(valid) == 0:
        return out
    order = valid[np.argsort(p[valid])]
    running = 0.0
    m = len(order)
    for rank, idx in enumerate(order):
        adjusted = min(1.0, (m - rank) * p[idx])
        running = max(running, adjusted)
        out[idx] = running
    return out


def fleiss_kappa_binary(votes: np.ndarray) -> tuple[float, float]:
    """Fleiss' kappa and observed pair agreement for binary labels.

    votes: shape (n_items, n_raters), values 0/1.
    """
    votes = np.asarray(votes)
    if votes.ndim != 2:
        raise ValueError("votes must be a 2D array")
    n_items, n_raters = votes.shape
    if n_raters < 2:
        raise ValueError("At least two raters are required.")
    if not np.isin(votes, [0, 1]).all():
        raise ValueError("Votes must be binary 0/1.")

    counts = np.column_stack([
        (votes == 0).sum(axis=1),
        (votes == 1).sum(axis=1),
    ])
    p_item = ((counts ** 2).sum(axis=1) - n_raters) / (n_raters * (n_raters - 1))
    p_bar = float(p_item.mean())

    category_p = counts.sum(axis=0) / (n_items * n_raters)
    p_expected = float((category_p ** 2).sum())
    if np.isclose(1 - p_expected, 0):
        kappa = 1.0 if np.isclose(p_bar, 1.0) else np.nan
    else:
        kappa = float((p_bar - p_expected) / (1 - p_expected))
    return kappa, p_bar


def fisher_freeman_halton_3x2(row_totals, retained_counts) -> float:
    """Exact two-sided Fisher-Freeman-Halton p-value for a 3x2 table.

    The margins are fixed. The probability of a feasible retained-count vector
    follows a multivariate hypergeometric distribution.
    """
    row_totals = np.asarray(row_totals, dtype=int)
    retained_counts = np.asarray(retained_counts, dtype=int)
    if len(row_totals) != 3 or len(retained_counts) != 3:
        raise ValueError("This implementation expects exactly three groups.")
    if np.any(retained_counts < 0) or np.any(retained_counts > row_totals):
        raise ValueError("Invalid retained counts.")

    total_retained = int(retained_counts.sum())
    total_n = int(row_totals.sum())
    denom = math.comb(total_n, total_retained)

    def table_probability(x):
        numerator = math.prod(math.comb(int(n), int(k)) for n, k in zip(row_totals, x))
        return numerator / denom

    p_obs = table_probability(retained_counts)
    p_value = 0.0

    for x1 in range(row_totals[0] + 1):
        for x2 in range(row_totals[1] + 1):
            x3 = total_retained - x1 - x2
            if 0 <= x3 <= row_totals[2]:
                p = table_probability(np.array([x1, x2, x3]))
                if p <= p_obs + 1e-15:
                    p_value += p
    return float(min(1.0, p_value))
