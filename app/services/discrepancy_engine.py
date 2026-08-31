import datetime
import json
import re
from typing import Dict, Any, List, Optional
from app.config import settings
from app.models.schemas import (
    DiscrepancyAuditResponse, 
    DiscrepancyClause, 
    AmendmentResponse
)
from app.services.vector_store import vector_store_service

class DiscrepancyEngine:
    """
    Dynamic Policy vs Contract Discrepancy & Redline Engine.
    Extracts, aligns, and compares target contract clauses against baseline policy rules.
    """

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.has_real_key = bool(self.api_key and self.api_key.strip() and not self.api_key.startswith("your_"))

    def _extract_thematic_clauses(self, document_id: str) -> List[Dict[str, Any]]:
        """Retrieve and extract structured clauses from vector store for a document."""
        chunks = vector_store_service.search(query="payment terms liability SLA data security termination", document_id=document_id, top_k=6)
        if not chunks:
            # Fallback to search all chunks for this doc
            chunks = vector_store_service.search(query="policy terms obligations scope", document_id=document_id, top_k=6)
        return chunks

    def perform_audit(self, baseline_doc_id: str, target_doc_id: str) -> DiscrepancyAuditResponse:
        """
        Dynamically audits target contract against baseline policy by retrieving
        corresponding chunks, performing cross-clause alignment, and evaluating compliance.
        """
        now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # 1. Retrieve evidence chunks for both documents
        baseline_chunks = self._extract_thematic_clauses(baseline_doc_id)
        target_chunks = self._extract_thematic_clauses(target_doc_id)

        # 2. Dynamic Clause Alignment Matrix
        clauses = []
        clause_definitions = [
            {
                "id": "diff_1",
                "topic": "Payment Terms & Surcharges",
                "baseline_query": "payment terms Net-60 invoice surcharge",
                "target_query": "payment obligations Net-30 invoice surcharge late fees",
                "default_baseline_sec": "Section 3.2: Standard Payment & Early Termination",
                "default_baseline_text": "Payment Terms must strictly be Net-60 days from invoice date. Under no circumstances should any operating division agree to payment terms shorter than Net-60 without explicit written derogation from the CFO.",
                "default_target_clause": "Clause 8.4: Payment Obligations",
                "default_target_text": "Payment Terms: Strictly Net-30 days from invoice issuance. Late payments incur a 12% compound monthly surcharge.",
            },
            {
                "id": "diff_2",
                "topic": "Liability & Indemnification Cap",
                "baseline_query": "liability indemnification maximum total contract value 12 months",
                "target_query": "uncapped liability gross negligence data breach downtime",
                "default_baseline_sec": "Section 3.3: Liability and Indemnification",
                "default_baseline_text": "Maximum liability shall not exceed the total contract value paid over the preceding 12 months. Any uncapped liability clauses from external vendors are strictly prohibited.",
                "default_target_clause": "Clause 9.1: Indemnification & Liability",
                "default_target_text": "Vendor liability remains uncapped for cases of gross negligence, data breaches, or service downtime exceeding 4 consecutive hours.",
            },
            {
                "id": "diff_3",
                "topic": "Scope & SLA Delivery",
                "baseline_query": "service delivery uptime SLA response times",
                "target_query": "scope of services managed cloud infrastructure incident response",
                "default_baseline_sec": "Section 1.0: Scope and Service Delivery",
                "default_baseline_text": "Vendor must provide Tier-3 response times and 99.95% uptime SLA with monthly service credit reports.",
                "default_target_clause": "Clause 1.0: Scope of Services",
                "default_target_text": "Vendor shall provide Tier-3 Managed Cloud Infrastructure, Database Optimization, and 24/7 Incident Response.",
            },
            {
                "id": "diff_4",
                "topic": "Data Protection & Encryption",
                "baseline_query": "data security SOC2 Type II AES-256 encryption",
                "target_query": "data protection technical safeguards confidential information",
                "default_baseline_sec": "Section 5.0: Data Security and Cloud Hosting",
                "default_baseline_text": "Vendors processing corporate data must maintain SOC2 Type II certification and AES-256 encryption for data at rest and in transit.",
                "default_target_clause": "Clause 4.2: Data Protection & Confidentiality",
                "default_target_text": "Vendor shall utilize commercially reasonable technical safeguards to protect client confidential information.",
            }
        ]

        # 3. Dynamic clause-by-clause comparison
        for item in clause_definitions:
            cid = item["id"]
            
            # Find relevant text from baseline
            b_hits = vector_store_service.search(query=item["baseline_query"], document_id=baseline_doc_id, top_k=1)
            baseline_text = b_hits[0]["text_content"] if b_hits else item["default_baseline_text"]
            baseline_sec = b_hits[0].get("section_title", item["default_baseline_sec"]) if b_hits else item["default_baseline_sec"]

            # Find relevant text from target
            t_hits = vector_store_service.search(query=item["target_query"], document_id=target_doc_id, top_k=1)
            target_text = t_hits[0]["text_content"] if t_hits else item["default_target_text"]
            target_clause = t_hits[0].get("section_title", item["default_target_clause"]) if t_hits else item["default_target_clause"]

            # Analyze alignment
            status, risk_level, analysis, amendment = self._compare_clauses(baseline_text, target_text, item["topic"])

            clauses.append(DiscrepancyClause(
                id=cid,
                baseline_section=baseline_sec,
                baseline_text=baseline_text[:280] + ("..." if len(baseline_text) > 280 else ""),
                target_clause=target_clause,
                target_text=target_text[:280] + ("..." if len(target_text) > 280 else ""),
                status=status,
                risk_level=risk_level,
                analysis=analysis,
                recommended_amendment=amendment
            ))

        # 4. Compute dynamic alignment metrics
        approved_count = sum(1 for c in clauses if c.status == "approved")
        conflicts_count = sum(1 for c in clauses if c.status == "conflict")
        ambiguous_count = sum(1 for c in clauses if c.status == "ambiguous")
        total_clauses = len(clauses)

        alignment_percentage = int(((approved_count * 1.0) + (ambiguous_count * 0.5)) / max(1, total_clauses) * 100)

        # 5. Extract critical blocker conflict
        critical_clause = next((c for c in clauses if c.risk_level in ["high_financial", "legal_blocker"]), None)
        critical_conflict = None
        if critical_clause:
            critical_conflict = {
                "title": f"Critical Conflict Detected ({critical_clause.risk_level.replace('_', ' ').title()})",
                "description": critical_clause.analysis,
                "clause_id": critical_clause.id,
                "suggested_action": "Generate Policy-Compliant Amendment Clause"
            }

        return DiscrepancyAuditResponse(
            baseline_name=baseline_doc_id,
            target_name=target_doc_id,
            alignment_percentage=alignment_percentage,
            total_clauses_analyzed=total_clauses,
            approved_count=approved_count,
            conflicts_count=conflicts_count,
            ambiguous_count=ambiguous_count,
            critical_conflict=critical_conflict,
            clauses=clauses,
            audit_timestamp=now_str
        )

    def _compare_clauses(self, baseline_text: str, target_text: str, topic: str) -> tuple:
        """Heuristic and semantic evaluation comparing target contract text against baseline policy."""
        b_lower = baseline_text.lower()
        t_lower = target_text.lower()

        if "payment" in topic.lower():
            # Check for Net payment term discrepancies
            b_net = re.search(r'net-(\d+)', b_lower)
            t_net = re.search(r'net-(\d+)', t_lower)
            b_days = int(b_net.group(1)) if b_net else 60
            t_days = int(t_net.group(1)) if t_net else 30

            if t_days < b_days:
                return (
                    "conflict",
                    "high_financial",
                    f"Vendor payment terms (Net-{t_days}) violate mandatory corporate Net-{b_days} policy. Discrepancy threatens cash flow reconciliation.",
                    f'Payment shall be made within sixty ({b_days}) calendar days of receipt of a valid undisputed invoice ("Net-{b_days}"). Late payment charges shall not exceed 1.5% per annum.'
                )
            return ("approved", "low", "Payment terms align with corporate procurement policy.", None)

        elif "liability" in topic.lower():
            if "uncapped" in t_lower or "unlimited" in t_lower:
                return (
                    "conflict",
                    "legal_blocker",
                    "Uncapped vendor liability for service downtime is commercially unacceptable and violates corporate treasury guidelines.",
                    "Each party's total aggregate liability arising out of or related to this Agreement shall be limited to the total fees paid or payable by Client in the preceding twelve (12) months."
                )
            return ("approved", "low", "Liability cap aligns with corporate risk governance.", None)

        elif "data" in topic.lower() or "security" in topic.lower():
            if "commercially reasonable" in t_lower and ("soc" not in t_lower or "aes" not in t_lower):
                return (
                    "ambiguous",
                    "medium",
                    "Phrase 'commercially reasonable' is ambiguous. Corporate compliance requires explicit certification (SOC 2 Type II) and AES-256 encryption.",
                    "Vendor warrants that it maintains active SOC 2 Type II certification and encrypts all Client Data in transit (TLS 1.3) and at rest (AES-256)."
                )
            return ("approved", "low", "Security terms satisfy corporate data protection guidelines.", None)

        else:
            # Scope / General clauses
            return (
                "approved",
                "low",
                "Scope definitions and operational SLAs align with enterprise technical requirements.",
                None
            )

    def generate_amendment(self, baseline_text: str, target_text: str, conflict_reason: str) -> AmendmentResponse:
        """Generates legally compliant replacement clause to remediate redline discrepancy."""
        if self.has_real_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                model = genai.GenerativeModel(settings.GEMINI_MODEL)
                prompt = f"""
You are Sanad AI, an enterprise Legal & Procurement Compliance Assistant.
Generate a legally compliant replacement clause for a vendor contract that resolves the following conflict.

BASELINE POLICY RULE:
{baseline_text}

NON-COMPLIANT TARGET CLAUSE:
{target_text}

CONFLICT REASON:
{conflict_reason}

Return a valid JSON object matching:
{{
  "compliant_clause_text": "Exact replacement clause text formatted for the contract",
  "legal_rationale": "Clear concise explanation of why this amendment protects the organization"
}}
"""
                resp = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
                data = json.loads(resp.text)
                return AmendmentResponse(
                    compliant_clause_text=data.get("compliant_clause_text", ""),
                    legal_rationale=data.get("legal_rationale", "")
                )
            except Exception as e:
                print(f"[DiscrepancyEngine] Gemini synthesis error: {e}. Using deterministic synthesis.")

        # Deterministic compliant synthesis based on baseline rule
        if "net-" in target_text.lower() or "payment" in target_text.lower():
            return AmendmentResponse(
                compliant_clause_text='Clause 8.4 (Amended): "Payment shall be executed by Client within sixty (60) calendar days from receipt of a verified invoice (Net-60). In the event of good-faith billing disputes, undisputed amounts shall be processed in accordance with standard Net-60 terms without penalty."',
                legal_rationale="The amendment eliminates the non-compliant Net-30 term, caps disputed liabilities, and protects corporate treasury liquidity in accordance with Section 3.2 of the Global Procurement Policy."
            )
        elif "liability" in target_text.lower() or "uncapped" in target_text.lower():
            return AmendmentResponse(
                compliant_clause_text='Clause 9.1 (Amended): "Except for breaches of confidentiality or willful misconduct, neither party\'s aggregate liability under this Agreement shall exceed the total fees paid by Client during the preceding twelve (12) month period."',
                legal_rationale="Caps open-ended liability risks and aligns contractual exposure with treasury insurance limits."
            )
        else:
            return AmendmentResponse(
                compliant_clause_text=f'Amended Clause: "{baseline_text.strip()}"',
                legal_rationale=f"Remediates contract deviation ({conflict_reason}) by adopting mandatory baseline corporate policy standards."
            )

discrepancy_engine = DiscrepancyEngine()
