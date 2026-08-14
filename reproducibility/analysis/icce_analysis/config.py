from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

GROUPS = ("Group 1", "Group 2", "Group 3")
GROUP_LABELS = {
    "Group 1": "No-LLM",
    "Group 2": "Unrestricted-LLM",
    "Group 3": "Guided-LLM",
}
LABEL_TO_GROUP = {v: k for k, v in GROUP_LABELS.items()}

INTERVENTION_TOPICS = (2, 3, 4)
RANDOM_SEED = 20260806
N_BOOTSTRAP = 2000

# Published participant-flow counts.
# These are design-level counts, not participant-level data.
ASSIGNED_COUNTS = {
    "Group 1": 17,
    "Group 2": 17,
    "Group 3": 16,
}
FINAL_ANALYTIC_COUNTS = {
    "Group 1": 13,
    "Group 2": 12,
    "Group 3": 12,
}


# Privacy-safe aggregate Week-1 statistics used in the camera-ready Table 1.
# The original Section 4.1 analysis used these post-filtering aggregates.
WEEK1_FINAL_ANALYTIC_AGGREGATES = {
    "Group 1": {
        "n": 13,
        "practice_mean": 58.11,
        "practice_sd": 18.78,
        "quiz_mean": 66.92,
        "quiz_sd": 23.58,
    },
    "Group 2": {
        "n": 12,
        "practice_mean": 59.50,
        "practice_sd": 23.47,
        "quiz_mean": 56.66,
        "quiz_sd": 19.46,
    },
    "Group 3": {
        "n": 12,
        "practice_mean": 54.54,
        "practice_sd": 21.14,
        "quiz_mean": 60.00,
        "quiz_sd": 23.54,
    },
}

# Canonical private filenames used by the public scripts.
TOPIC_FILENAMES = {
    1: "topic1.csv",
    2: "topic2.csv",
    3: "topic3.csv",
    4: "topic4.csv",
}
FINAL_FILENAME = "final.csv"

FEEDBACK_FILENAMES = [
    "feedback_group2_practice2.docx",
    "feedback_group2_practice3.docx",
    "feedback_group2_practice4.docx",
    "feedback_group3_practice2.docx",
    "feedback_group3_practice3.docx",
    "feedback_group3_practice4.docx",
]

IRR_FILENAMES = [
    "annotator_1.xlsx",
    "annotator_2.xlsx",
    "annotator_3.xlsx",
]

RULE_COLUMNS = {
    "R1": "R1_Process_Over_Answers",
    "R2": "R2_Concept_Tutoring",
    "R3": "R3_Stepwise_Hints",
    "R4": "R4_Active_Learning",
    "R5": "R5_Critical_Evaluation",
    "R6": "R6_Ethical_NoHelp",
}

RULE_LABELS = {
    "R1": "Process over answers",
    "R2": "Concept tutoring",
    "R3": "Stepwise hints",
    "R4": "Active learning",
    "R5": "Critical evaluation",
    "R6": "Ethical / no-help use",
}


@dataclass(frozen=True)
class Paths:
    data_dir: Path
    output_dir: Path

    @property
    def feedback_dir(self) -> Path:
        return self.data_dir / "feedback"

    @property
    def irr_dir(self) -> Path:
        return self.data_dir / "irr"

    @property
    def chats_dir(self) -> Path:
        return self.data_dir / "chats"

    @property
    def reclassification_file(self) -> Path:
        return self.data_dir / "reclassification.csv"
