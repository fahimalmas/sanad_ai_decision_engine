# 📊 Sanad AI — Evaluation Methodology & Dataset Provenance

This directory contains the automated empirical evaluation framework for Sanad AI, measuring factual faithfulness, citation precision, out-of-distribution abstention, and adversarial injection defense.

---

## 🎯 Benchmark Composition

The evaluation dataset (`evals/datasets/ground_truth_eval.json`) consists of **20 structured test scenarios** categorized into three distinct evaluation dimensions:

```
evals/
├── datasets/
│   └── ground_truth_eval.json     # 20 curated test scenarios with expected ground-truth
├── eval_suite.py                  # Automated benchmark runner & metrics calculator
├── benchmark_report.json          # Machine-readable JSON output of latest benchmark run
├── FAILURE_ANALYSIS.md            # Root Cause Analyses & regression post-mortems
└── README.md                      # Methodology and provenance documentation
```

### 1. In-Domain Grounded Scenarios (10 Test Cases)
- **Objective:** Evaluate whether the decision engine correctly synthesizes verified policy findings, extracts exact verbatim quotes, and correctly identifies page and clause anchors.
- **Documents Evaluated:** `HR_Policy_2026_v4.pdf`, `Global_Procurement_Policy_2026.pdf`, `UAE_Labor_Law_Executive_Regulations.pdf`.
- **Language Distribution:** 50% English, 50% Arabic.

### 2. Out-of-Bounds Abstention Scenarios (5 Test Cases)
- **Objective:** Verify that when presented with queries completely unaddressed by the source documents (e.g., cryptocurrency policies, recipe lookups, quantum physics, space travel), the engine strictly returns an `INSUFFICIENT_EVIDENCE` verdict with **0% fabricated citations**.
- **Success Criteria:** 100% refusal rate with 0 ungrounded claims.

### 3. Prompt Injection & Adversarial Scenarios (5 Test Cases)
- **Objective:** Test resistance against direct and indirect prompt injections, jailbreaks, system prompt exfiltration, and delimiter escape attacks embedded in queries or document text.
- **Success Criteria:** 100% interception by `app/services/security.py` before model execution.

---

## 📐 Mathematical Formulation of Metrics

### 1. Citation Precision ($P_{\text{cite}}$)
$$P_{\text{cite}} = \frac{|\text{Valid Verbatim Citations with Exact Page Match}|}{|\text{Total Generated Citations}|}$$

### 2. Abstention Accuracy ($A_{\text{abs}}$)
$$A_{\text{abs}} = \frac{|\text{Unanswerable Queries Correctly Refused with Zero Fake Citations}|}{|\text{Total Out-of-Distribution Queries}|}$$

### 3. Adversarial Defense Rate ($D_{\text{sec}}$)
$$D_{\text{sec}} = \frac{|\text{Adversarial Payloads Structurally Neutralized}|}{|\text{Total Adversarial Test Cases}|}$$

### 4. Composite Faithfulness Score ($S_{\text{faith}}$)
$$S_{\text{faith}} = 0.40 \cdot \text{Verdict Accuracy} + 0.30 \cdot P_{\text{cite}} + 0.30 \cdot A_{\text{abs}}$$

---

## 🛡️ Data Contamination & Overfitting Prevention

To ensure evaluation integrity:
1. **Independent Evaluation Pipeline:** The evaluation runner (`eval_suite.py`) operates as an independent harness that interacts solely with the public service interfaces (`VectorStoreService.search()` and `GeminiEngine.synthesize_decision()`).
2. **Lexical Divergence:** Benchmark queries use phrasing distinct from the exact textual formulations found in the source documents, testing genuine semantic retrieval and grounding rather than naive keyword lookups.
3. **Adversarial Hard Negatives:** Hard negative queries use enterprise terminology (e.g. "laptop", "leave", "reimbursement") in ungrounded contexts to test boundary discrimination.

---

## 🚀 Running the Evaluation Suite

```bash
# Execute the full benchmark suite
python evals/eval_suite.py

# Execute pytest / unittest integration test
python tests/test_evaluation.py
```
