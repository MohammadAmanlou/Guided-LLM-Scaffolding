# Sample Transcripts: LLM Interaction and Rule-Coding Examples

## Purpose and scope

This document provides a small set of **de-identified, purposively selected transcript excerpts** from the study's LLM-access conditions. The examples are included to make the interaction taxonomy and human-coding procedure easier to inspect.

These excerpts are **illustrative rather than statistically representative** of the full corpus. They were selected to span different observed rule-following profiles and to make the coding decisions interpretable. They were not used as a separate sample for estimating treatment effects.

### Language and transcript presentation

- Only **English** is presented in this public artifact.
- Student or assistant messages that were originally in Persian are rendered as faithful English translations.
- Messages that were originally in English are retained in English.
- Student identifiers and other direct identifiers are omitted.
- The excerpts may be **non-contiguous**. Original turn numbers are retained so that omitted portions are transparent.
- When only part of a long assistant response is needed to document the interaction pattern, the retained portion is explicitly labeled **Assistant response excerpt**.
- Historical assistant outputs are not silently corrected. If a retained model response contains a substantive mathematical issue relevant to interpreting the interaction, a clearly labeled **Researcher note** is added after the response.

### What the rule labels measure

The six rule labels characterize **observable student interaction behavior**. They do **not** certify the mathematical correctness, pedagogical quality, or reliability of the assistant's responses. The model was treated as a potentially fallible reasoning partner, and some historical responses contain mistakes.

### Full-transcript coding versus public excerpts

The three annotators coded the **full Student × Practice transcript**. The excerpts below are shortened only for public presentation and are intended to illustrate salient evidence. They should therefore **not be used to independently recode the case** or to infer that omitted turns contained no additional evidence.

---

## Taxonomy

| Rule | Short name | Coding target |
|---|---|---|
| **R1** | Process over final answer | Prioritizes reasoning, strategy, or intermediate steps over simply obtaining the final answer. |
| **R2** | Concept tutoring | Uses the LLM to understand concepts, definitions, intuition, examples, or conceptual relationships. |
| **R3** | Stepwise hints | Requests limited, incremental help rather than a complete worked solution. |
| **R4** | Active learning | Uses the LLM for additional practice, self-quizzing, retrieval, study support, or active application. |
| **R5** | Verification and critical evaluation | Verifies, challenges, cross-checks, or critically evaluates an LLM output or the ongoing reasoning. |
| **R6** | Ethical and no-help use | Avoids direct-copy answer seeking and demonstrates compliance with the study's ethical/no-help requirements when relevant. |

The rules are **non-mutually-exclusive**.

---

## Coding convention

Each case corresponds to one **Student × Practice transcript** from Practices 2–4 in an LLM-access condition.

Three human annotators independently coded each of the six rules as **YES** or **NO**. For a rule, the final label is **YES** when at least two of the three annotators assigned YES; otherwise it is **NO**. The six majority-vote labels are summed to produce a rule-following score from **0 to 6**.

For the behavior-defined enacted-use grouping used here:

- **Score > 3 → Group 3 (guided-like enacted use)**
- **Score ≤ 3 → Group 2 (unguided-like enacted use)**

These labels describe the **observed interaction pattern represented by the coding score**. They should not be interpreted as the student's original experimental assignment.

### Example overview

| Example | Practice | Rule-following score | Behavior-defined group |
|---|---:|---:|---|
| **A** | 2 | **6/6** | **Group 3 — guided-like enacted use** |
| **B** | 4 | **3/6** | **Group 2 — unguided-like enacted use** |
| **C** | 3 | **4/6** | **Group 3 — guided-like enacted use** |
| **D** | 4 | **2/6** | **Group 2 — unguided-like enacted use** |
| **E** | 4 | **0/6** | **Group 2 — unguided-like enacted use** |

---

# Example A — High observed compliance

**Practice:** 2  
**Rule-following score:** 6/6  
**Behavior-defined group:** Group 3 — guided-like enacted use

## Selected English-language excerpt

### Turn 1

**Student**

> I do not know much about random variables, but I understand the general idea. Based on what I know, explain the probability mass function to me with an example.

**Assistant response excerpt**

> A probability mass function (PMF) specifies the probability associated with each possible value of a discrete random variable. For example, for a fair six-sided die,
>
> \[
> P(X=x)=\frac{1}{6}, \qquad x\in\{1,2,3,4,5,6\}.
> \]
>
> The PMF is zero for values outside the possible outcomes. The same idea can be used for other discrete settings such as a coin toss.

### Turn 4

**Student**

> I want to write a probability mass function for a situation where, with some probability, the insurance company has to pay 150, while the customer pays the insurance company \(C\). Guide me a little, but do not give me the final answer. I want to solve it myself.

**Assistant response excerpt**

> Start by defining the random variable and its possible values. If \(X\) represents the amount paid by the insurer, identify the loss and no-loss outcomes and assign the corresponding probabilities. If you later want to study profit, you can define a profit/loss variable and use its expected value. Try to write the possible outcomes first and then build the PMF from them.

### Turn 8

**Student**

> So, is my profit PMF correct: \(P(X=150000)=0.0225\) and \(P(X=C-1500)=1-0.0225\), or should the PMF be written differently?

**Assistant response excerpt**

> If the random variable represents the insurer's profit, it is clearer to define \(Y=C-X\), where \(X\) is the claim amount. Then:
>
> \[
> P(Y=C)=0.9775,
> \]
>
> and
>
> \[
> P(Y=C-150000)=0.0225.
> \]
>
> The key point is to define the random variable first and then attach probabilities to its possible values.

### Turn 25

**Student**

> Analyze the approach I am taking. For the first person, the probability of receiving the correct letter is \(1/n\). For the next person, wouldn't it be \(1/(n-1)\)? If we continue this way, shouldn't the expected value become
>
> \[
> \frac{1}{n}+\frac{1}{n-1}+\cdots+\frac{1}{2}+1?
> \]

**Assistant response excerpt**

> If the letters are distributed randomly without replacement, the probabilities depend on earlier assignments. Under this approach, the overall expectation would be written as
>
> \[
> E[X]=\frac1n+\frac1{n-1}+\cdots+\frac12+1,
> \]
>
> which is the harmonic sum \(H_n\).

> **Researcher note:** This historical assistant response is mathematically incorrect. For a uniformly random permutation, each recipient has marginal probability \(1/n\) of receiving the correct letter, so the expected number of fixed points is \(1\). The response is retained because the student's later challenge provides direct evidence for R5 (critical evaluation).

### Turn 33

**Student**

> Can't we instead reason from the possible arrangements of the letters and count the arrangements in which every individual assignment is wrong? I feel that the method you gave is not correct because it has not considered all of the possible arrangements.

**Assistant response excerpt**

> Let's reconsider the problem using a counting argument. There are \(n!\) total assignments. The number of assignments in which nobody receives the correct letter is the number of derangements, \(D_n\). Therefore,
>
> \[
> P(\text{no correct letters})=\frac{D_n}{n!},
> \]
>
> where
>
> \[
> D_n=n!\sum_{k=0}^{n}\frac{(-1)^k}{k!}.
> \]

### Turn 46

**Student**

> A producer makes perishable products at a cost of 6 and sells them with a profit of 14. Consider a population of \(n\) people; for simplicity let \(n=10\). Each person independently wants the product with probability \(p\). On average, how many people will want the product, and how many products should the producer make to maximize profit? Are those two quantities equal?
>
> Do not answer at all yet. Wait for my explanation.

**Assistant**

> Understood. I will wait for your explanation. Please continue when you are ready.

### Turn 47

**Student**

> To find the mean, I think I should define \(X_i\) to be 1 if person \(i\) wants the product and 0 otherwise. Then \(E[X_i]=p\). With \(n=10\) and \(p=2/5\), I get
>
> \[
> 10\cdot\frac25=4.
> \]
>
> Is that correct?

**Assistant response excerpt**

> Yes. If \(X_i\) is the indicator that person \(i\) wants the product, then
>
> \[
> E[X_i]=p,
> \]
>
> and for \(X=X_1+\cdots+X_{10}\),
>
> \[
> E[X]=10p=10\cdot\frac25=4.
> \]

## Inter-rater coding

| Rule | Rater 1 | Rater 2 | Rater 3 | Majority vote | Transcript-specific evidence |
|---|---|---|---|---|---|
| **R1 — Process over final answer** | YES | YES | YES | **YES** | Turn 4 explicitly asks for guidance while preserving the student's own problem solving; Turn 46 asks the assistant to wait until the student presents an approach. |
| **R2 — Concept tutoring** | YES | YES | YES | **YES** | Turn 1 explicitly requests an explanation of the PMF concept with an example. |
| **R3 — Stepwise hints** | YES | YES | YES | **YES** | Turn 4 asks for limited guidance and explicitly asks not to receive the final answer. |
| **R4 — Active learning** | YES | YES | YES | **YES** | Turns 46–47 show the student actively working through a new problem, presenting an indicator-variable solution, and using the model for feedback rather than immediately requesting the solution. |
| **R5 — Verification and critical evaluation** | YES | YES | YES | **YES** | Turn 33 explicitly challenges the assistant's earlier method as incomplete and asks for a different counting-based analysis. |
| **R6 — Ethical and no-help use** | YES | YES | NO | **YES** | Turns 4 and 46 provide observable evidence that the student deliberately avoids direct-answer use during practice and preserves their own solution process. The majority-vote R6 label is based on the full transcript reviewed by the annotators. The selected public excerpt shows the student repeatedly preserving their own solution process, but the excerpt alone should not be treated as sufficient evidence to independently recode R6. One rater judged this evidence insufficient, producing the observed 2–1 vote. |

**Transcript-level rationale:** This case shows explanation-seeking, limited-help requests, active self-solving, and explicit challenge of a flawed assistant response. The behavior is therefore consistent with a high rule-following profile.

---

# Example B — Partial observed compliance

**Practice:** 4  
**Rule-following score:** 3/6  
**Behavior-defined group:** Group 2 — unguided-like enacted use

## Selected English-language excerpt

### Turn 1

**Student**

> We have a coin that we toss 1,000 times. How do I calculate the probability that heads occurs between 480 and 520 times? Do not give me the final answer; help me reach it myself.

**Assistant response excerpt**

> Model the number of heads as a binomial random variable,
>
> \[
> X\sim\operatorname{Binomial}(1000,0.5).
> \]
>
> Because \(n\) is large, a normal approximation can be used, with
>
> \[
> \mu=np=500,\qquad \sigma=\sqrt{np(1-p)}=\sqrt{250}.
> \]
>
> Convert the lower and upper bounds to \(Z\)-scores and then use the standard normal CDF. Try finding the two CDF values yourself and then continue from there.

### Turn 2

**Student**

> How do I calculate the PDF of a function?

**Assistant response excerpt**

> A PDF, or probability density function, is used for continuous random variables. The exact formula depends on the distribution. For a normal random variable with mean \(\mu\) and standard deviation \(\sigma\),
>
> \[
> f(x)=\frac{1}{\sqrt{2\pi\sigma^2}}
> e^{-\frac{(x-\mu)^2}{2\sigma^2}}.
> \]
>
> More generally, when a random variable is transformed through a function, the density of the transformed variable must be derived from the original density and the transformation.

## Inter-rater coding

| Rule | Rater 1 | Rater 2 | Rater 3 | Majority vote | Transcript-specific evidence |
|---|---|---|---|---|---|
| **R1 — Process over final answer** | YES | YES | YES | **YES** | Turn 1 explicitly asks for help reaching the result rather than for the final numerical answer. |
| **R2 — Concept tutoring** | YES | YES | YES | **YES** | Turn 2 is a direct conceptual question about how a probability density function is calculated. |
| **R3 — Stepwise hints** | YES | YES | YES | **YES** | Turn 1 asks the model to help incrementally while leaving the final step to the student. |
| **R4 — Active learning** | NO | NO | NO | **NO** | The full transcript does not show a clear request for additional practice, self-quizzing, retrieval practice, or another distinct active-learning activity. |
| **R5 — Verification and critical evaluation** | NO | NO | NO | **NO** | The full transcript does not contain clear student-initiated checking, challenge, or cross-validation of an assistant output. |
| **R6 — Ethical and no-help use** | NO | NO | NO | **NO** | Although Turn 1 is process-oriented, the annotators did not treat a generic “do not give me the final answer” request by itself as sufficient evidence of the distinct ethical/no-help construct. No explicit direct-copy/submission or prohibited-assessment context was established. |

> **Coding correction note:** An earlier draft of this public sample file incorrectly displayed R2 for Example B as NO/NO/NO. The corrected coding record is YES/YES/YES; the corresponding rule-following score is therefore **3/6**.

**Transcript-level rationale:** The student clearly seeks process-oriented help and a conceptual explanation, but the full transcript does not provide sufficient evidence for active-learning, critical-evaluation, or ethical/no-help coding under the annotators' applied criteria.

---

# Example C — Moderate observed compliance

**Practice:** 3  
**Rule-following score:** 4/6  
**Behavior-defined group:** Group 3 — guided-like enacted use

## Selected English-language excerpt

### Turn 1

**Student**

> What does a cumulative distribution function mean?

**Assistant response excerpt**

> The cumulative distribution function (CDF) gives the probability that a random variable is less than or equal to a specified value. For a random variable \(X\),
>
> \[
> F_X(x)=P(X\le x).
> \]
>
> For a continuous distribution, the PDF is related to the derivative of the CDF; for a discrete distribution, the CDF accumulates the PMF values up to \(x\).

### Turn 3

**Student**

> I know that, to calculate the expected value of \(Y\), I can use an integral involving \(1-F_Y\), but I cannot evaluate the integral. Please help me.

**Assistant response excerpt**

> A useful substitution for the integral is
>
> \[
> u=\frac{b-y}{b-a},
> \]
>
> so
>
> \[
> du=-\frac{1}{b-a}\,dy.
> \]
>
> When \(y=a\), \(u=1\), and when \(y=b\), \(u=0\). This converts the remaining integral into a standard power integral in \(u\).

### Turn 6

**Student**

> I wrote the equation incorrectly. The correct one is
>
> \[
> \frac{x^2}{18}-\frac{3}{2}x-1.9=0.
> \]

**Assistant response excerpt**

> With the corrected equation, multiply through by 18 to obtain
>
> \[
> x^2-27x-34.2=0.
> \]
>
> Then apply the quadratic formula and check the resulting roots against the required interval.

### Turn 7

**Student**

> It should be
>
> \[
> \frac{x^2}{18}-\frac{2}{3}x-1.9.
> \]

**Assistant response excerpt**

> Then the equation becomes
>
> \[
> x^2-12x-34.2=0,
> \]
>
> after multiplying by 18.

### Turn 9

**Student**

> Make the sign of \(1.9\) positive.

**Assistant response excerpt**

> With \(+1.9\), the equation is
>
> \[
> \frac{x^2}{18}-\frac{2}{3}x+1.9=0,
> \]
>
> or equivalently
>
> \[
> x^2-12x+34.2=0.
> \]

## Inter-rater coding

| Rule | Rater 1 | Rater 2 | Rater 3 | Majority vote | Transcript-specific evidence |
|---|---|---|---|---|---|
| **R1 — Process over final answer** | YES | YES | YES | **YES** | Turn 3 begins from the student's own chosen expectation formula and asks for help with the specific integration bottleneck. |
| **R2 — Concept tutoring** | YES | YES | YES | **YES** | Turn 1 asks for the meaning of the CDF rather than a numerical answer. |
| **R3 — Stepwise hints** | YES | YES | YES | **YES** | Turn 3 requests help with a specific intermediate step rather than introducing the problem as a request for an immediate complete answer. |
| **R4 — Active learning** | NO | NO | NO | **NO** | The full transcript does not provide clear evidence of additional practice generation, self-quizzing, retrieval practice, or a distinct study activity. |
| **R5 — Verification and critical evaluation** | YES | YES | YES | **YES** | Across Turns 6–9, the student repeatedly inspects and corrects the mathematical expression used in the ongoing calculation rather than passively accepting the running solution. |
| **R6 — Ethical and no-help use** | NO | NO | NO | **NO** | The full transcript does not provide sufficient evidence of direct-copy avoidance, submission-related restraint, or compliance with a no-help assessment context. |

**Transcript-level rationale:** The student seeks conceptual clarification, starts from an independently chosen method, requests help at a specific bottleneck, and actively checks the evolving mathematical setup. No distinct active-learning or ethical/no-help evidence was coded.

---

# Example D — Low/partial observed compliance

**Practice:** 4  
**Rule-following score:** 2/6  
**Behavior-defined group:** Group 2 — unguided-like enacted use

## Selected English-language excerpt

### Turn 1

**Student**

> Consider a random variable \(X\sim \operatorname{Exp}(\lambda)\). Find a function \(g(X)\) such that \(Y=g(X)\) has distribution \(Y\sim U(2,5)\).

**Assistant response excerpt**

> Use the probability integral transform. For \(X\sim\operatorname{Exp}(\lambda)\),
>
> \[
> F_X(x)=1-e^{-\lambda x}.
> \]
>
> A \(U(2,5)\) variable has
>
> \[
> F_Y(y)=\frac{y-2}{3},\qquad 2\le y\le5.
> \]
>
> Equating the transforms gives
>
> \[
> g(x)=5-3e^{-\lambda x}.
> \]

### Turn 2

**Student**

> Explain every step of the solution completely, step by step.

**Assistant response excerpt**

> Start from the exponential PDF and derive its CDF. Then write the CDF of \(U(2,5)\), equate the two CDF expressions, and solve the resulting equation for \(y=g(x)\). This gives
>
> \[
> g(x)=5-3e^{-\lambda x}.
> \]

### Turn 5

*Turn 5 refers to the immediately preceding normal-approximation calculation, which is omitted here for brevity.*

**Student**

> Shouldn't the \(Z\)-terms be \(0.04\sqrt{n}\)?

**Assistant response excerpt**

> You are right. Rechecking the standardization,
>
> \[
> \frac{0.52n-0.5n}{0.5\sqrt n}
> =\frac{0.02n}{0.5\sqrt n}
> =0.04\sqrt n,
> \]
>
> and similarly the lower bound is \(-0.04\sqrt n\). Using the corrected scaling leads to
>
> \[
> 0.04\sqrt n=1.96.
> \]

### Turn 11

**Student**

> Where did the formula for calculating \(f_Y(y)\) come from?

**Assistant response excerpt**

> It comes from the change-of-variables rule for probability densities. If \(Y=g(X)\) and \(g\) is differentiable and one-to-one,
>
> \[
> f_Y(y)=f_X(x)\left|\frac{dx}{dy}\right|
> =\frac{f_X(x)}{|g'(x)|}.
> \]
>
> If \(g\) is not one-to-one, the contributions from all solutions \(x_i\) satisfying \(g(x_i)=y\) must be added:
>
> \[
> f_Y(y)=\sum_{x_i:g(x_i)=y}\frac{f_X(x_i)}{|g'(x_i)|}.
> \]

## Inter-rater coding

| Rule | Rater 1 | Rater 2 | Rater 3 | Majority vote | Transcript-specific evidence |
|---|---|---|---|---|---|
| **R1 — Process over final answer** | NO | NO | NO | **NO** | Turn 1 directly asks the model to find the transformation, and Turn 2 explicitly requests the complete step-by-step solution. |
| **R2 — Concept tutoring** | YES | YES | YES | **YES** | Turn 11 asks for the origin and meaning of the density-transformation formula. |
| **R3 — Stepwise hints** | NO | NO | NO | **NO** | Turn 2 requests every step of the complete solution rather than limited incremental help. |
| **R4 — Active learning** | NO | NO | NO | **NO** | No additional-practice, self-quizzing, retrieval, or comparable active-learning behavior was identified. |
| **R5 — Verification and critical evaluation** | YES | YES | YES | **YES** | Turn 5 explicitly identifies a possible standardization error; the assistant then rechecks and corrects the calculation. |
| **R6 — Ethical and no-help use** | NO | NO | NO | **NO** | No observable evidence of direct-copy avoidance or no-help assessment compliance was identified. |

**Transcript-level rationale:** The student generally requests complete solutions, but the transcript also contains a conceptual follow-up and a concrete challenge to an erroneous calculation. This produces a low/partial rule-following profile rather than uniformly low behavior.

---

# Example E — Low observed compliance

**Practice:** 4  
**Rule-following score:** 0/6  
**Behavior-defined group:** Group 2 — unguided-like enacted use

## Selected English-language excerpt

### Turn 1

**Student**

> We have a random variable \(X\). Random variable \(Y\) is defined as \(1/X\). Find the joint PMF of \(X\) and \(Y\).

**Assistant response excerpt**

> If \(X\) is discrete with PMF \(p_X(x)\) and \(Y=1/X\), then
>
> \[
> p_{X,Y}(x,y)=
> \begin{cases}
> p_X(x), & y=1/x,\\
> 0, & \text{otherwise}.
> \end{cases}
> \]
>
> The joint PMF is nonzero only for pairs that satisfy the deterministic relationship \(y=1/x\).

### Turn 2

**Student**

> Find the PDF; the random variables are continuous. Include all answers.

**Assistant response excerpt**

> Because \(Y=1/X\) is a deterministic transformation, the response represented the joint law using
>
> \[
> f_{X,Y}(x,y)=f_X(x)\,
> \delta\!\left(y-\frac1x\right),
> \]
>
> and derived the transformed marginal density
>
> \[
> f_Y(y)=f_X\!\left(\frac1y\right)\frac1{y^2},
> \qquad y\ne0,
> \]
>
> subject to the corresponding support of \(X\).

> **Researcher note:** For continuous \(X\) and deterministic \(Y=1/X\), the pair \((X,Y)\) is supported on the one-dimensional curve \(y=1/x\) and therefore does not possess an ordinary two-dimensional density with respect to Lebesgue measure. The Dirac-delta expression above is a generalized representation. It is retained because the sample documents the historical interaction, not because assistant correctness is part of the rule score.

## Inter-rater coding

| Rule | Rater 1 | Rater 2 | Rater 3 | Majority vote | Transcript-specific evidence |
|---|---|---|---|---|---|
| **R1 — Process over final answer** | NO | NO | NO | **NO** | Turns 1–2 directly request the requested mathematical objects and complete answers rather than prioritizing the student's reasoning process. |
| **R2 — Concept tutoring** | NO | NO | NO | **NO** | The student does not ask for conceptual explanation, intuition, analogy, or conceptual relationships. |
| **R3 — Stepwise hints** | NO | NO | NO | **NO** | No request for limited hints or incremental assistance appears; Turn 2 explicitly asks to include all answers. |
| **R4 — Active learning** | NO | NO | NO | **NO** | No request for additional practice, self-quizzing, retrieval, study-guide creation, or active application is present. |
| **R5 — Verification and critical evaluation** | NO | NO | NO | **NO** | The student does not challenge, verify, or cross-check the assistant's output in the coded transcript. |
| **R6 — Ethical and no-help use** | NO | NO | NO | **NO** | No observable evidence of avoiding direct-copy answer seeking or of no-help assessment compliance is present. |

**Transcript-level rationale:** The interaction is dominated by direct requests for complete mathematical answers, with no coded evidence of the six guided-use behaviors.

---

## Interpretation notes

1. **The coding target is student behavior.** A student can receive a positive process or verification code even when the assistant's mathematical response is flawed.
2. **Assistant compliance is not the coding target.** For example, an assistant may provide more information than the student requested; this does not retroactively change what the student asked for.
3. **Rules are coded independently.** A request such as “do not give me the final answer” can support R1 or R3, but it does not automatically establish R6. R6 requires evidence that the interaction reflects the distinct ethical/direct-copy/no-help construct applied by the annotators.
4. **Majority voting is applied rule by rule.** A 2–1 vote is sufficient for a final YES.
5. **The behavior-defined Group 2/Group 3 labels are derived from the final 0–6 score in this artifact.** They are post-interaction descriptors of enacted use and are not equivalent to original experimental assignment.
6. **The excerpts are not completeness claims.** Original turn numbers are retained precisely because the public artifact intentionally omits nonessential portions of the full transcripts.

---

## Summary

| Example | R1 | R2 | R3 | R4 | R5 | R6 | Score | Behavior-defined group |
|---|---|---|---|---|---|---|---:|---|
| **A** | YES | YES | YES | YES | YES | YES | **6/6** | **Group 3** |
| **B** | YES | YES | YES | NO | NO | NO | **3/6** | **Group 2** |
| **C** | YES | YES | YES | NO | YES | NO | **4/6** | **Group 3** |
| **D** | NO | YES | NO | NO | YES | NO | **2/6** | **Group 2** |
| **E** | NO | NO | NO | NO | NO | NO | **0/6** | **Group 2** |

