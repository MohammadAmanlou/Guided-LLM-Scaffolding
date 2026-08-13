# Coding Codebook: Connecting Rules to Learning Sciences

This codebook defines how each of the six rules maps to specific learning science constructs, and how they are operationalized and measured within the system for transcript coding.

### Rule 1: Prioritize the reasoning process over the final answer
* **Learning Science Construct:** Help-seeking.
* **System Operationalization:** Providing partial hints or process-oriented help instead of a full answer.
    * **Satisfied:** The student explicitly asks for a strategy, a hint, or the first step of a problem.
        * *Positive Example:* "What approaches exist for solving a problem where a committee must be selected, but two specific people cannot be together?"
    * **Not Satisfied:** The student copy-pastes a prompt asking for the final answer without showing effort.
        * *Negative Example:* "Solve this equation and give me the final number."

### Rule 2: Use the model as a concept tutor
* **Learning Science Construct:** Self-explanation.
* **System Operationalization:** Explaining previous attempts before receiving help, or asking the AI to connect concepts to prior knowledge and analogies.
    * **Satisfied:** The student details their thought process, asks for an analogy, or requests an explanation suited for a beginner.
        * *Positive Example:* "Explain the Pythagorean theorem as if I am 10 years old," or "How do matrices relate to systems of linear equations?"
    * **Not Satisfied:** The student asks for an explanation without providing context on their prior effort or current understanding.
        * *Negative Example:* "Just tell me which formula I need to use for Bayes' theorem here. I don't need the explanation, just the equation so I can plug the numbers in."


### Rule 3: Request stepwise hints rather than a full solution
* **Learning Science Construct:** Scaffolding / Productive struggle.
* **System Operationalization:** Requesting the smallest amount of help needed to continue when stuck, specifically asking the AI not to solve the whole problem.
    * **Satisfied:** The student explicitly restricts the AI from giving the full answer and asks it to wait for their response.
        * *Positive Example:* "I am finding the derivative of the function... just tell me the rule and the reason for using it, but do not solve the problem."
    * **Not Satisfied:** The student asks for a fully worked-out solution step-by-step, removing their own responsibility to solve it.
        * *Negative Example:* "Write out the full step-by-step solution for finding the probability of selecting this 5-person committee so I can see how it is done."

### Rule 4: Check your reasoning
* **Learning Science Construct:** Metacognitive monitoring / Self-regulation.
* **System Operationalization:** Presenting logic, steps, or partial solutions to the model and asking it to verify the thought process and identify potential errors before moving forward.
    * **Satisfied:** The student shares their step-by-step logic or proof and explicitly asks the AI to evaluate if their reasoning is sound.
        * *Positive Example:* "To solve this equation, I first distributed the 4 across the variables, then added 8 to both sides. Is my logic correct?".
    * **Not Satisfied:** The student finishes the problem and only asks the AI to check if their final numerical answer is right, without providing the steps they took to get there.
        * *Negative Example:* "I got x=7, is that the right answer?"

### Rule 5: Active learning
* **Learning Science Construct:** Retrieval practice / Mastery learning.
* **System Operationalization:** Using the model to generate new practice problems, summarize key ideas, or conduct self-quizzing to build mastery. 
    * **Satisfied:** The student requests additional practice problems, a study guide summary, or interactive quizzes to test their understanding.
        * *Positive Example:* "Give me five more questions about the chain rule, ranging from easy to hard," or "Ask me three questions to test my understanding of derivatives.".
    * **Not Satisfied:** The student asks the AI to generate practice problems and also asks the AI to solve them on their behalf, bypassing their own effort.
        * *Negative Example:* "Generate three hard polynomial factoring problems and write out the step-by-step solutions for me to read."

### Rule 6: Validation and critical thinking
* **Learning Science Construct:** AI Literacy / Calibrated trust / Critical evaluation.
* **System Operationalization:** Treating the model as fallible by verifying numerical calculations independently, comparing the model's reasoning with reliable sources, and not using the AI to bypass effort.
    * **Satisfied:** The student actively questions the AI's output, checks calculations manually, or compares the AI's suggested method against textbook or classroom examples to ensure it is sound.
        * *Positive Example:* "I calculated C(12, 5) manually and got a different number. Let's review the counting strategy; my textbook says we should treat them as a single unit.".
    * **Not Satisfied:** The student blindly accepts a generated calculation or reasoning without verifying it against standard methods, or inputs a graded question verbatim to get a direct answer.
        * *Negative Example:* "Thanks, I will copy this final calculation directly into my quiz."