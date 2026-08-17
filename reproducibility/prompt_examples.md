# Prompt Examples from the Guided-Use Training

*Note: The study's orientation was delivered in Persian. Examples below are presented in English for accessibility.*

### Rule 1: Prioritize the reasoning process over the final answer

**Productive**

> What approaches can be used for a committee-selection problem in which two specific people cannot serve together? Name the strategies and explain which may be simpler; do not calculate the final answer.

* **Why productive:** The student asks for strategy selection and reasoning while preserving the actual problem-solving work.

**Unproductive**

> Solve this committee problem and return only the final probability.

* **Why unproductive:** The interaction is reduced to obtaining the final answer rather than understanding the reasoning process.

---

### Rule 2: Use the model as a concept tutor

**Productive**

> Why is the complement method simpler here? Explain the intuition for this particular problem.

* **Why productive:** The student asks for conceptual understanding and intuition rather than simply requesting an answer.

**Unproductive**

> Which formula should I paste into my answer?

* **Why unproductive:** The student asks for a formula to use directly rather than seeking conceptual understanding.

---

### Rule 3: Request stepwise hints rather than a full solution

**Productive**

> I decided to use the complement method. My next step is to count the invalid cases. How should I count committees that contain both specific members? Give me a hint.

* **Why productive:** The student asks for limited, incremental assistance that allows them to continue solving the problem themselves.

**Unproductive**

> Give me every step and the final solution in one response.

* **Why unproductive:** The model is asked to perform the complete solution rather than provide limited assistance that preserves the student's problem-solving role.

---

### Rule 4: Active learning

**Productive**

> Create a new problem with a similar negative constraint between two members, but change the context to arranging books on a shelf. Let me solve it first, and then give me feedback on my approach.

* **Why productive:** The student uses the LLM to generate additional practice and then actively applies the learned idea in a new context.

**Unproductive**

> Generate a similar problem about arranging books and immediately give me the complete solution so I can read it.

* **Why unproductive:** Although the prompt requests additional practice, asking for the solution immediately reduces the opportunity for active retrieval and application.

---

### Rule 5: Verification and critical evaluation

**Productive**

> I calculated C(12,5) and got a different result from yours. Can we check the calculation and review the reasoning behind the counting strategy? My textbook uses a different approach, so I want to understand which assumptions are correct.

* **Why productive:** The student questions the LLM's output, checks the calculation, and compares its reasoning with course material instead of accepting the response uncritically.

**Unproductive**

> Your answer looks reasonable, so I'll use it without checking the calculation.

* **Why unproductive:** The student accepts the model's output without verification or critical evaluation.

---

### Rule 6: Ethical and no-help use

**Productive**

> This is a practice activity, and I do not want an answer that I could directly copy into my submission. Please help me understand the method while leaving the actual solution for me to complete.

* **Why productive:** The student explicitly avoids direct-copy answer seeking and preserves responsibility for completing the work independently.

**Unproductive**

> [Copy-pasting an exact graded quiz question] What is the answer to this? I need to submit it.

* **Why unproductive:** The student seeks a direct answer for graded work, which conflicts with the study's no-help assessment rules.
