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
