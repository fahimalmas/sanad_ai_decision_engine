"""
==============================================================================
Sanad AI - Enterprise Security & Prompt Injection Guardrails
==============================================================================
Author: Fahim Almas (FAHIM ALMAS - fmas.dev)
Description:
    Production-grade input sanitization, indirect prompt injection defense,
    and adversarial payload detection for document processing & user queries.
==============================================================================
"""

import re
import unicodedata
from typing import List, Dict, Any
from pydantic import BaseModel, Field


class SecurityAssessment(BaseModel):
    is_safe: bool = Field(..., description="Whether the payload is safe for LLM consumption")
    risk_score: float = Field(..., ge=0.0, le=1.0, description="Calculated security risk score (0.0=safe, 1.0=critical)")
    threat_category: str = Field("NONE", description="Categorized threat type if detected")
    flags: List[str] = Field(default_factory=list, description="Specific triggers or detected attack patterns")
    sanitized_text: str = Field(..., description="Cleaned and normalized text")


class SecurityGuardrails:
    """
    Enterprise-grade heuristic and pattern-based guardrails protecting against:
    - Direct & Indirect Prompt Injections (e.g. system override instructions in PDFs)
    - Jailbreak attempts and instruction bypasses
    - Unicode steganography / invisible zero-width character exploits
    - System prompt exfiltration attacks
    """

    # Known high-risk adversarial patterns across English & Arabic
    ADVERSARIAL_PATTERNS = [
        # Direct System Prompt Override / Jailbreaks
        r"(?i)\b(ignore|disregard|forget|override)\s+(all\s+)?(previous|prior|above|system)\s+(instructions|prompts|rules|commands)",
        r"(?i)\b(you\s+are\s+now|act\s+as|pretend\s+to\s+be)\s+(an\s+unrestricted|a\s+different|DAN|jailbroken)",
        r"(?i)\b(bypass|disable|turn\s+off)\s+(all\s+)?(safety|policy|guardrails|compliance|filters)",
        r"(?i)\b(reveal|print|output|leak|display)\s+(the\s+)?(system\s+prompt|initial\s+instructions|developer\s+instructions)",
        r"(?i)\[system\s*:\s*override\]",
        r"(?i)```\s*system",
        
        # Arabic Adversarial Injections
        r"(تجاهل|انس|الغ|تخطى)\s+(جميع|كافة)?\s*(التعليمات|الأوامر|القواعد|السياسات)\s*(السابقة|الأصلية)",
        r"(أنت\s+الآن|تصرف\s+كأنك|تظاهر\s+بأنك)\s+(نموذج\s+متحرر|بدون\s+قيود)",
        r"(أظهر|اكشف|اطبع|اعرض)\s+(التعليمات\s+السرية|توجيهات\s+النظام|system\s+prompt)",
        r"(عطّل|أوقف)\s+(الفلاتر|الحماية|الرقابة|سياسة\s+الأمان)",
    ]

    # Suspicious delimiter and Markdown injection indicators
    DELIMITER_PATTERNS = [
        r"<\s*script[^>]*>",
        r"<\s*iframe[^>]*>",
        r"javascript\s*:",
        r"data\s*:\s*text\/html",
    ]

    @classmethod
    def sanitize_unicode(cls, text: str) -> str:
        """
        Strips invisible zero-width characters, homoglyphs, and dangerous unicode controls
        used in steganographic injection attacks.
        """
        if not text:
            return ""

        # Normalize unicode (NFKC handles compatible character conversions)
        normalized = unicodedata.normalize("NFKC", text)

        # Remove zero-width spaces, joiners, non-joiners, bidirectional overrides
        # U+200B-U+200D (zero-width), U+202A-U+202E (directional formatting), U+FEFF (BOM)
        sanitized = re.sub(r"[\u200B-\u200D\u202A-\u202E\uFEFF\u2060-\u206F]", "", normalized)
        
        return sanitized.strip()

    @classmethod
    def assess_text(cls, text: str, source: str = "query") -> SecurityAssessment:
        """
        Performs a deep multi-layered security assessment of text before it reaches the LLM.
        """
        if not text:
            return SecurityAssessment(
                is_safe=True,
                risk_score=0.0,
                threat_category="NONE",
                flags=[],
                sanitized_text=""
            )

        sanitized = cls.sanitize_unicode(text)
        flags: List[str] = []
        risk_score = 0.0
        threat_category = "NONE"

        # 1. Check for prompt injection & system overrides
        for pattern in cls.ADVERSARIAL_PATTERNS:
            match = re.search(pattern, sanitized)
            if match:
                flags.append(f"Prompt Injection Pattern Detected: '{match.group(0)[:40]}...'")
                risk_score = max(risk_score, 0.95)
                threat_category = "PROMPT_INJECTION"

        # 2. Check for dangerous script / iframe / html execution payloads
        for pattern in cls.DELIMITER_PATTERNS:
            match = re.search(pattern, sanitized, re.IGNORECASE)
            if match:
                flags.append(f"Code Injection Delimiter Detected: '{match.group(0)}'")
                risk_score = max(risk_score, 0.90)
                threat_category = "DELIMITER_INJECTION"

        # 3. Check for suspicious length or repetitive boundary overflow
        if len(sanitized) > 100000 and source == "query":
            flags.append("Abnormally large query payload (Buffer Overflow Risk)")
            risk_score = max(risk_score, 0.70)
            threat_category = "DOS_EXPLOIT"

        is_safe = risk_score < 0.70

        return SecurityAssessment(
            is_safe=is_safe,
            risk_score=risk_score,
            threat_category=threat_category,
            flags=flags,
            sanitized_text=sanitized
        )
