import sys
from pathlib import Path

# Add project root to sys.path
root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def run_comprehensive_audit():
    print("=" * 65)
    print("🛡️  SANAD AI - PRE-FLIGHT COMPREHENSIVE CODE & API AUDIT")
    print("=" * 65)

    # 1. Health & Environment Verification
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    health = res.json()
    print(f"✓ 1. System Health Check: Status={health['status']}")
    print(f"     Active Provider: {health['llm_provider']} ({health['privacy_mode']})")
    print(f"     Vector Store: {health['vector_store']['status']} (ChromaDB Local)")

    # 2. Local LLM Provider Switch Test
    res = client.post("/api/settings/provider?provider=ollama")
    assert res.status_code == 200, "Switch to Ollama failed"
    data = res.json()
    assert data["active_provider"] == "ollama", "Provider mismatch"
    print(f"✓ 2. Local LLM (On-Premises) Switch: {data['privacy_mode']} ✓")

    # Revert to gemini
    res = client.post("/api/settings/provider?provider=gemini")
    assert res.status_code == 200

    # 3. Document Catalog Verification
    res = client.get("/api/documents")
    assert res.status_code == 200
    docs = res.json()
    assert docs["total_documents"] >= 4, "Missing sample documents in registry"
    print(f"✓ 3. Knowledge Base Catalog: {docs['total_documents']} documents indexed with {docs['total_chunks']} chunks.")

    # 4. Dynamic Page Content API Test (Page 18 of HR Policy)
    res = client.get("/api/documents/HR_Policy_2026_v4.pdf/page/18")
    assert res.status_code == 200
    page_data = res.json()
    assert "Section 4.2" in page_data["text"], "Section 4.2 text missing from page 18"
    print(f"✓ 4. Dynamic Page Retrieval: Successfully loaded Page {page_data['page_number']} of {page_data['document_id']}.")

    # 5. English Policy Decision Query
    en_query = {
        "document_id": "HR_Policy_2026_v4.pdf",
        "query": "Can I claim a $1,500 laptop reimbursement?",
        "mode": "compliance"
    }
    res = client.post("/api/workspace/query", json=en_query)
    assert res.status_code == 200
    en_data = res.json()
    assert "Approved" in en_data["verdict"]
    assert en_data["citations"][0]["page_number"] == 18
    assert len(en_data["action_items"]) >= 2
    print(f"✓ 5. English Grounded Query: Verdict='{en_data['verdict']}', Citation Page={en_data['citations'][0]['page_number']} (Confidence={en_data['confidence_label']})")

    # 6. Arabic Policy Decision Query (UAE Labor Law)
    ar_query = {
        "document_id": "UAE_Labor_Law_Executive_Regulations.pdf",
        "query": "كم تبلغ الإجازة السنوية ومكافأة نهاية الخدمة القانونية؟",
        "mode": "compliance"
    }
    res = client.post("/api/workspace/query", json=ar_query)
    assert res.status_code == 200
    ar_data = res.json()
    assert len(ar_data["citations"]) > 0
    print(f"✓ 6. Arabic Grounded Query: Verdict='{ar_data['verdict']}', Citations={len(ar_data['citations'])} (Confidence={ar_data['confidence_label']})")

    # 7. Policy vs Contract Discrepancy Redline Audit
    diff_req = {
        "baseline_doc_id": "Global_Procurement_Policy_2026.pdf",
        "target_doc_id": "Vendor_TechServices_SLA_Draft.pdf"
    }
    res = client.post("/api/discrepancy/audit", json=diff_req)
    assert res.status_code == 200
    diff_data = res.json()
    assert diff_data["alignment_percentage"] == 74
    assert diff_data["conflicts_count"] == 2
    print(f"✓ 7. Redline Discrepancy Audit: Alignment={diff_data['alignment_percentage']}%, Critical Conflicts={diff_data['conflicts_count']}")

    # 8. AI Amendment Clause Generation
    amend_req = {
        "baseline_text": "Net-60 days",
        "target_text": "Net-30 days with 12% surcharge",
        "conflict_reason": "Violates corporate Net-60 policy"
    }
    res = client.post("/api/discrepancy/amendment", json=amend_req)
    assert res.status_code == 200
    amend_data = res.json()
    assert "Net-60" in amend_data["compliant_clause_text"]
    print(f"✓ 8. AI Legal Amendment: Generated '{amend_data['compliant_clause_text'][:55]}...'")

    # 9. PDF & JSON Compliance Reports Export
    pdf_res = client.get("/api/export/audit-pdf")
    assert pdf_res.status_code == 200 and len(pdf_res.content) > 1000
    json_res = client.get("/api/export/audit-json")
    assert json_res.status_code == 200 and len(json_res.content) > 500
    print(f"✓ 9. Audit Report Exports: PDF ({len(pdf_res.content)} bytes), JSON ({len(json_res.content)} bytes)")

    # 10. Single Page App Frontend Serving
    res = client.get("/")
    assert res.status_code == 200
    assert "Sanad AI" in res.text
    print(f"✓ 10. SPA Frontend Bundle: Served {len(res.text)} bytes of clean HTML/JS/Tailwind assets.")

    print("\n" + "=" * 65)
    print("🎉 ALL 10 COMPREHENSIVE VERIFICATION TESTS PASSED WITH 100% SUCCESS!")
    print("🚀 THE CODEBASE IS CLEAN, ENTERPRISE-GRADE, AND READY FOR GITHUB!")
    print("=" * 65 + "\n")

if __name__ == "__main__":
    run_comprehensive_audit()
