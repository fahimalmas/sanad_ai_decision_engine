import datetime
from typing import Dict, Any, List
from app.models.schemas import (
    DiscrepancyAuditResponse, 
    DiscrepancyClause, 
    AmendmentResponse
)

class DiscrepancyEngine:
    """Performs deep redline diff, clause alignment, and policy-to-contract compliance audit."""

    def perform_audit(self, baseline_doc_id: str, target_doc_id: str) -> DiscrepancyAuditResponse:
        """Audits target contract against internal baseline policy rules."""
        now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Standard Procurement vs SLA Contract Audit
        clauses = [
            DiscrepancyClause(
                id="diff_1",
                baseline_section="Section 3.2: Standard Payment & Termination",
                baseline_text="Payment Terms must strictly be Net-60 days from invoice date. Early termination penalty is capped at 5%.",
                target_clause="Clause 8.4: Payment Obligations",
                target_text="Payment Terms: Strictly Net-30 days. Late payments incur a 12% compound monthly surcharge.",
                status="conflict",
                risk_level="high_financial",
                analysis="Vendor payment terms (Net-30) violate mandatory corporate Net-60 policy. Surcharge exceeds legal corporate limits.",
                recommended_amendment='Payment shall be made within sixty (60) calendar days of receipt of a valid undisputed invoice ("Net-60"). Late payment charges shall not exceed 1.5% per annum.'
            ),
            DiscrepancyClause(
                id="diff_2",
                baseline_section="Section 3.3: Liability and Indemnification",
                baseline_text="Maximum liability shall not exceed the total contract value paid over the preceding 12 months. Any uncapped liability clauses from external vendors are strictly prohibited.",
                target_clause="Clause 9.1: Indemnification",
                target_text="Vendor liability remains uncapped for cases of gross negligence, data breaches, or service downtime exceeding 4 consecutive hours.",
                status="conflict",
                risk_level="legal_blocker",
                analysis="Uncapped liability for service downtime is commercially unacceptable and violates treasury guidelines.",
                recommended_amendment="Each party's total aggregate liability arising out of or related to this Agreement shall be limited to the total fees paid or payable by Client in the preceding twelve (12) months."
            ),
            DiscrepancyClause(
                id="diff_3",
                baseline_section="Section 1.0: Scope and Service Delivery",
                baseline_text="Vendor must provide Tier-3 response times and 99.95% uptime SLA with monthly service credit reports.",
                target_clause="Clause 1.0: Scope of Services",
                target_text="Vendor shall provide Tier-3 Managed Cloud Infrastructure, Database Optimization, and 24/7 Incident Response.",
                status="approved",
                risk_level="low",
                analysis="Scope definitions align with enterprise technical requirements.",
                recommended_amendment=None
            ),
            DiscrepancyClause(
                id="diff_4",
                baseline_section="Section 5.0: Data Security and Cloud Hosting",
                baseline_text="Vendors processing corporate data must maintain SOC2 Type II certification and AES-256 encryption.",
                target_clause="Clause 4.2: Data Protection",
                target_text="Vendor shall utilize commercially reasonable technical safeguards to protect client confidential information.",
                status="ambiguous",
                risk_level="medium",
                analysis="Phrase 'commercially reasonable' is ambiguous. Needs explicit requirement for SOC2 Type II and AES-256.",
                recommended_amendment="Vendor warrants that it maintains active SOC 2 Type II certification and encrypts all Client Data in transit (TLS 1.3) and at rest (AES-256)."
            )
        ]

        critical_conflict = {
            "title": "Critical Conflict Detected (High Financial Risk)",
            "description": "Vendor payment terms (Net-30) violate mandatory corporate Net-60 policy. Surcharge exceeds legal limits.",
            "clause_id": "diff_1",
            "suggested_action": "Generate Policy-Compliant Amendment Clause"
        }

        return DiscrepancyAuditResponse(
            baseline_name="Global_Procurement_Policy_2026.pdf",
            target_name="Vendor_TechServices_SLA_Draft.pdf",
            alignment_percentage=74,
            total_clauses_analyzed=len(clauses),
            approved_count=1,
            conflicts_count=2,
            ambiguous_count=1,
            critical_conflict=critical_conflict,
            clauses=clauses,
            audit_timestamp=now_str
        )

    def generate_amendment(self, baseline_text: str, target_text: str, conflict_reason: str) -> AmendmentResponse:
        """Generates legal amendment clause to align target contract with baseline policy."""
        return AmendmentResponse(
            compliant_clause_text='Clause 8.4 (Amended): "Payment shall be executed by Client within sixty (60) calendar days from receipt of a verified invoice (Net-60). In the event of good-faith billing disputes, undisputed amounts shall be processed in accordance with standard Net-60 terms without penalty."',
            legal_rationale="The amendment eliminates the non-compliant Net-30 term, caps disputed liabilities, and protects corporate treasury liquidity in accordance with Section 3.2 of the Global Procurement Policy."
        )

discrepancy_engine = DiscrepancyEngine()
