# Coding Codebook: Connecting Rules to Learning Sciences

This codebook defines the six guided-use rules, their corresponding
learning-science constructs, and the criteria used to code student-practice
transcripts.

The coding taxonomy is aligned with the six rules defined in the study:
reasoning-focused help-seeking, concept tutoring, stepwise hints, active
learning, verification and critical evaluation, and ethical/no-help use.

---

## 1. Coding Procedure

### Unit of Analysis

The unit of analysis is one **Student × Practice transcript**.

Transcripts from Practices 2–4 in the LLM-access conditions were independently
evaluated by three human annotators.

### Independent Coding

Each annotator coded the six rule families independently before consensus.

For each transcript, each rule was coded using one of two allowed values:

- **YES:** The transcript provides sufficient evidence that the student engaged
  in the behavior defined by the rule's coding target.
- **NO:** The transcript does not provide sufficient evidence that the student
  engaged in the behavior defined by the rule's coding target.

The six rule families are non-mutually-exclusive. A transcript may therefore
receive a YES label for multiple rules.

Annotators used the same Student ID and Practice structure across coding files
and did not consult the other annotators during the initial coding stage.

If a transcript was genuinely uncodeable for a rule, the annotator left the
corresponding field blank and documented the reason in the Notes field.

### Consensus and Final Label

The individual annotator judgments were combined after independent coding.

For each rule, the final label was determined by **majority vote** across the
three annotators. Thus, agreement from at least two of the three annotators
was required for the final label.

The six final binary rule labels were summed to obtain a rule-following score
ranging from **0 to 6**.

### Coding Scope

Coding focuses on observable evidence in the student-practice interaction.
The rules are coded independently; satisfying one rule does not imply that
another rule is also satisfied.

The coding criteria below describe the target behavior for each rule and
should be applied to the transcript as a whole. No additional frequency or
dominance threshold is imposed beyond the evidence-based judgment specified
by the coding target.

---

## 2. Rule Definitions and Coding Criteria

### Rule 1: Prioritize the reasoning process over the final answer

* **Learning Science Construct:** Help-seeking.
* **Coding Criterion:** The student prioritizes reasoning, strategy, or
  intermediate steps over simply obtaining the final answer.

    * **YES:** The student asks for a strategy, reasoning process, intermediate
      steps, or process-oriented help that supports their own problem solving.

        * **Positive Example:**
          "What approaches exist for solving a problem where a committee must
          be selected, but two specific people cannot be together?"

    * **NO:** The student primarily seeks the final answer without evidence of
      reasoning-focused help-seeking.

        * **Negative Example:**
          "Solve this equation and give me the final number."

---

### Rule 2: Use the model as a concept tutor

* **Learning Science Construct:** Self-explanation.
* **Coding Criterion:** The student uses the LLM to understand concepts,
  definitions, intuition, analogies, examples, or conceptual relationships.

    * **YES:** The student asks the model to explain or clarify a concept,
      provide intuition or an analogy, give an example, or explain a
      conceptual relationship.

        * **Positive Example:**
          "Explain the Pythagorean theorem as if I am 10 years old."

        * **Positive Example:**
          "How do matrices relate to systems of linear equations?"

    * **NO:** The interaction does not provide evidence of concept tutoring
      and instead focuses only on obtaining a formula, answer, or task
      completion.

        * **Negative Example:**
          "Just tell me which formula I need to use for Bayes' theorem here.
          I don't need the explanation, just the equation so I can plug the
          numbers in."

> **Important:** Providing a prior attempt, prior effort, or additional
> context is not a prerequisite for satisfying Rule 2. A direct conceptual
> question can satisfy this rule when it clearly seeks conceptual
> understanding.

---

### Rule 3: Request stepwise hints rather than a full solution

* **Learning Science Construct:** Scaffolding / Productive struggle.
* **Coding Criterion:** The student requests limited, incremental help or
  hints instead of a complete worked solution.

    * **YES:** The student requests a hint, first step, next step, partial
      guidance, or feedback that allows them to continue solving the problem.

        * **Positive Example:**
          "I am finding the derivative of the function... just tell me the
          rule and the reason for using it, but do not solve the problem."

    * **NO:** The student requests a complete worked solution that replaces
      their own problem-solving effort.

        * **Negative Example:**
          "Write out the full step-by-step solution for finding the probability
          of selecting this 5-person committee so I can see how it is done."

---

### Rule 4: Active learning

* **Learning Science Construct:** Retrieval practice / Mastery learning.
* **Coding Criterion:** The student uses the LLM for extra practice,
  self-quizzing, retrieval, or other activities that require active learning.

    * **YES:** The student asks the model to generate additional practice,
      conduct self-quizzing, support retrieval practice, create a study guide
      or summary, or provide another activity intended to actively reinforce
      learning.

        * **Positive Example:**
          "Give me five more questions about the chain rule, ranging from easy
          to hard."

        * **Positive Example:**
          "Ask me three questions to test my understanding of derivatives."

    * **NO:** The interaction contains no evidence of additional practice,
      self-quizzing, retrieval, or another active-learning activity.

        * **Negative Example:**
          "Explain this problem and give me the final answer."

---

### Rule 5: Verification and critical evaluation

* **Learning Science Construct:** AI Literacy / Calibrated trust /
  Critical evaluation.
* **Coding Criterion:** The student verifies, challenges, cross-checks, or
  critically evaluates LLM output rather than accepting it uncritically.

    * **YES:** The student questions the model's output, checks a calculation
      or claim, identifies a possible error, cross-checks the reasoning, or
      compares the model's output with course materials or another appropriate
      source.

        * **Positive Example:**
          "I calculated C(12, 5) manually and got a different number. Let's
          review the counting strategy; my textbook says we should treat them
          as a single unit."

    * **NO:** The student accepts the model's output without evidence of
      verification, challenge, cross-checking, or critical evaluation.

        * **Negative Example:**
          "Thanks, that makes sense. I'll use this answer."

---

### Rule 6: Ethical and no-help use

* **Learning Science Construct:** Responsible AI use / Academic integrity.
* **Coding Criterion:** The student avoids direct-copy answer seeking and
  demonstrates compliance with the study's ethical and no-help requirements.

    * **YES:** The transcript provides observable evidence that the student
      avoids seeking an answer for direct copying/submission, or explicitly
      acknowledges or follows the study's no-help requirements when relevant.

        * **Positive Example:**
          "I know this is a quiz, so I won't use the AI. I'll solve it myself."

        * **Positive Example:**
          "Don't give me something I can directly copy into my submission.
          I want to work it out myself."

    * **NO:** The transcript provides no observable evidence of ethical/no-help
      behavior, or the student explicitly seeks a direct answer for copying,
      submission, or use in a prohibited assessment context.

        * **Negative Example:**
          "Give me the answer to this quiz question so I can submit it."

    A generic request for a hint or for withholding the final answer is not, by itself, sufficient evidence for Rule 6 unless the transcript also establishes direct-copy avoidance,     submission-related restraint, or compliance with a no-help assessment requirement.

---

## 3. Rule Summary

| Rule | Short Name | Coding Target |
|---|---|---|
| **R1** | Process over answers | Prioritizes reasoning, strategy, or intermediate steps over simply obtaining the final answer. |
| **R2** | Concept tutoring | Uses the LLM to understand concepts, definitions, intuition, analogies, or conceptual relationships. |
| **R3** | Stepwise hints | Requests limited, incremental help or hints instead of a complete worked solution. |
| **R4** | Active learning | Uses the LLM for extra practice, self-quizzing, retrieval, or other active-learning activities. |
| **R5** | Critical evaluation | Verifies, challenges, cross-checks, or critically evaluates LLM output. |
| **R6** | Ethical / no-help use | Avoids direct-copy answer seeking during graded work and respects the study's no-help assessment rules. |

---

## 4. Coding Output

For each Student × Practice transcript, the three annotators independently
produce six binary judgments:

- R1: YES / NO
- R2: YES / NO
- R3: YES / NO
- R4: YES / NO
- R5: YES / NO
- R6: YES / NO

The individual annotator judgments are retained as pre-consensus coding
records. The final dataset uses the majority-vote label for each rule.

The six final rule labels are summed to produce a rule-following score from
0 to 6.
