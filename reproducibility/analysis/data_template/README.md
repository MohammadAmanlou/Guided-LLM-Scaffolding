# Private data layout

The public repository should contain **analysis code only**. Participant-level
records, full transcripts, assessment records, and identity mappings should stay
private.

To run the scripts locally, create a directory named `data_private/` with this
layout:

```text
data_private/
├── topic1.csv
├── topic2.csv
├── topic3.csv
├── topic4.csv
├── final.csv
├── reclassification.csv              # optional; private
├── feedback/
│   ├── feedback_group2_practice2.docx
│   ├── feedback_group2_practice3.docx
│   ├── feedback_group2_practice4.docx
│   ├── feedback_group3_practice2.docx
│   ├── feedback_group3_practice3.docx
│   └── feedback_group3_practice4.docx
└── irr/
    ├── annotator_1.xlsx
    ├── annotator_2.xlsx
    └── annotator_3.xlsx
```

`reclassification.csv` has two columns:

```text
email,enacted_group
...
```

Use this file only if the raw course exports still contain assigned rather than
behavior-defined enacted group labels. Do **not** commit the real mapping.

The IRR Excel files must contain a `Ratings` sheet with:
`Record_ID`, `Student_ID`, `Original_Group`, `Practice`, and the six rule columns
used by the provided templates.

## Course-export CSV schema

The analysis scripts expect the private `topic1.csv`–`topic4.csv` and
`final.csv` files to preserve the structure of the original course-platform
exports.

### General structure

Each CSV contains:

1. one standard CSV header row;
2. three metadata rows immediately below the header;
3. participant rows beginning after those three metadata rows.

The scripts therefore treat the first three dataframe rows as metadata and
participant records as beginning from row index 3.

At minimum, all course-export files must contain the following named columns:

- `Name` — participant display name; optional for analysis but retained when available;
- `Username` — participant identifier used by the analysis pipeline;
- `Group` — study-group label.

Accepted group representations include:

- `Group 1` / `No-LLM`
- `Group 2` / `Unrestricted-LLM`
- `Group 3` / `Guided-LLM`

The real participant identifiers used in these files remain private and must
not be committed to the public repository.

### Topic files

For `topic1.csv`–`topic4.csv`, the export contains a Practice section followed
by the corresponding Quiz section.

The analysis identifies columns using the metadata rows rather than fixed
column positions:

- the first column marked `SUM` in metadata is interpreted as the Practice total;
- the last column marked `SUM` is interpreted as the Quiz total;
- Practice time columns are columns before the Practice `SUM` whose metadata
  label is `Time`;
- the final assessment-time column is identified by a `Time` label in the
  assessment metadata;
- for Topics 2–4, the calibration analysis also expects a metadata label
  containing `Self Reported Understanding`.

Practice-time entries may be numeric minutes or time strings such as `mm:ss`
or `hh:mm:ss`.

### Final-exam file

`final.csv` follows the same metadata-row convention.

The analysis expects:

- `Username`;
- `Group`;
- a final score column identified by the final `SUM` metadata label;
- an assessment-time column identified by `Time`;
- a self-assessment column whose metadata contains
  `Self Reported Understanding`.

### Important

The metadata rows should not be removed or converted into ordinary participant
rows before running the public analysis scripts. The column-detection logic
uses those rows to identify scores, timing variables, and self-assessment
measures.
