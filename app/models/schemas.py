from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# ==========================================
# Decision & Query Workspace Schemas
# ==========================================

class CitationItem(BaseModel):
    page_number: int = Field(..., description="Page number where the evidence is located")
    section_title: str = Field(..., description="Section or clause title")
    exact_quote: str = Field(..., description="Verbatim text quote from the document")
    relevance_score: Optional[float] = Field(0.95, description="Similarity or relevance score")

class ActionItem(BaseModel):
    id: str = Field(..., description="Unique ID for action item")
    text: str = Field(..., description="Actionable instruction for the user")
    completed: bool = Field(False, description="Whether the step is completed")

class RiskAlert(BaseModel):
    severity: str = Field("warning", description="Severity: warning, blocker, info")
    title: str = Field(..., description="Risk or exception title")
    description: str = Field(..., description="Detailed explanation of exception or compliance condition")

class DecisionQueryRequest(BaseModel):
    document_id: Optional[str] = Field(None, description="Target document ID or filename")
    query: str = Field(..., description="User query or policy question")
    mode: str = Field("compliance", description="Mode: executive, compliance, full_evidence")

class DecisionQueryResponse(BaseModel):
    document_id: str
    document_name: str
    query: str
    verdict: str = Field(..., description="e.g. Approved, Approved w/ Conditions, Requires Exception, Rejected")
    verdict_badge_type: str = Field("success", description="success, warning, error, info")
    grounding_confidence: float = Field(..., description="Grounded confidence percentage e.g. 96.4")
    confidence_label: str = Field("96.4% Grounded", description="Display label for confidence")
    executive_summary: str = Field(..., description="Direct synthesized answer and decision")
    citations: List[CitationItem] = Field(default_factory=list)
    risk_alert: Optional[RiskAlert] = None
    action_items: List[ActionItem] = Field(default_factory=list)
    suggested_queries: List[str] = Field(default_factory=list)
    retrieval_latency_ms: float = Field(84.0, description="Latency in milliseconds")

# ==========================================
# Ingestion & Document Pipeline Schemas
# ==========================================

class ChunkItem(BaseModel):
    chunk_id: str
    document_id: str
    page_number: int
    section_title: str
    text_content: str
    token_count: int

class DocumentMetadata(BaseModel):
    document_id: str
    filename: str
    category: str = Field("General", description="HR, Legal, Compliance, Procurement")
    total_pages: int
    chunk_count: int
    embedding_model: str = "text-embedding-004"
    grounding_health: str = "Verified (Grounded)"
    status: str = "Indexed"
    upload_timestamp: str
    file_size_kb: float

class IngestionStatusResponse(BaseModel):
    total_documents: int
    total_chunks: int
    avg_latency_ms: float
    vector_db_status: str
    active_pipeline: Optional[Dict[str, Any]] = None
    documents: List[DocumentMetadata]

# ==========================================
# Policy vs Contract Discrepancy Schemas
# ==========================================

class DiscrepancyClause(BaseModel):
    id: str
    baseline_section: str
    baseline_text: str
    target_clause: str
    target_text: str
    status: str = Field("approved", description="approved, conflict, ambiguous")
    risk_level: str = Field("low", description="low, medium, high_financial, legal_blocker")
    analysis: str
    recommended_amendment: Optional[str] = None

class DiscrepancyAuditRequest(BaseModel):
    baseline_doc_id: str = Field(..., description="Baseline internal policy document")
    target_doc_id: str = Field(..., description="Target contract or vendor agreement")

class DiscrepancyAuditResponse(BaseModel):
    baseline_name: str
    target_name: str
    alignment_percentage: int = Field(74, description="0 to 100 percentage")
    total_clauses_analyzed: int
    approved_count: int
    conflicts_count: int
    ambiguous_count: int
    critical_conflict: Optional[Dict[str, Any]] = None
    clauses: List[DiscrepancyClause]
    audit_timestamp: str

class AmendmentRequest(BaseModel):
    baseline_text: str
    target_text: str
    conflict_reason: str

class AmendmentResponse(BaseModel):
    compliant_clause_text: str
    legal_rationale: str
