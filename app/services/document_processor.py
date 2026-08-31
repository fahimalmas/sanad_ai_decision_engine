import os
import re
import unicodedata
from pathlib import Path
from typing import List, Dict, Any, Tuple
import pypdf

# In-memory cache of extracted pages per document
DOCUMENT_PAGES_CACHE: Dict[str, List[Dict[str, Any]]] = {}

class DocumentProcessor:
    """Extracts, parses and semantically chunks documents with page & section metadata."""

    @staticmethod
    def clean_text(text: str) -> str:
        """Normalizes Unicode, Arabic presentation forms, and whitespace."""
        if not text:
            return ""
        # Convert Arabic Presentation Forms (e.g. \uFE80) to standard Arabic Unicode (\u0600)
        norm = unicodedata.normalize("NFKC", text)
        # Clean null bytes or control chars except newlines
        norm = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', norm)
        # Normalize multiple spaces (preserving single newlines)
        norm = re.sub(r'[ \t]+', ' ', norm)
        return norm.strip()

    @classmethod
    def extract_text_with_pages(cls, file_path: Path) -> List[Dict[str, Any]]:
        """Extract text page by page from PDF or TXT files."""
        pages_data = []
        ext = file_path.suffix.lower()

        if ext == ".pdf":
            try:
                reader = pypdf.PdfReader(str(file_path))
                for idx, page in enumerate(reader.pages):
                    raw_text = page.extract_text() or ""
                    cleaned = cls.clean_text(raw_text)
                    if cleaned:
                        pages_data.append({
                            "page_number": idx + 1,
                            "text": cleaned
                        })
            except Exception as e:
                print(f"[DocumentProcessor] Error reading PDF {file_path}: {e}")
        else:
            # Handle text or markdown files with --- PAGE X --- delimiters or fallback
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                
                page_splits = re.split(r'---\s*PAGE\s*(\d+)\s*---', content, flags=re.IGNORECASE)
                if len(page_splits) > 1:
                    current_page = 1
                    for i in range(1, len(page_splits), 2):
                        try:
                            p_num = int(page_splits[i])
                        except ValueError:
                            p_num = current_page
                        p_text = cls.clean_text(page_splits[i+1]) if i+1 < len(page_splits) else ""
                        if p_text:
                            pages_data.append({
                                "page_number": p_num,
                                "text": p_text
                            })
                            current_page = p_num + 1
                else:
                    # Fallback: estimate words per page
                    words = content.split()
                    words_per_page = 350
                    for idx in range(0, len(words), words_per_page):
                        chunk_words = words[idx:idx + words_per_page]
                        pages_data.append({
                            "page_number": (idx // words_per_page) + 1,
                            "text": cls.clean_text(" ".join(chunk_words))
                        })
            except Exception as e:
                print(f"[DocumentProcessor] Error reading text file {file_path}: {e}")

        # Store in cache
        doc_key = file_path.name
        DOCUMENT_PAGES_CACHE[doc_key] = pages_data
        return pages_data

    @classmethod
    def get_document_pages(cls, doc_name: str) -> List[Dict[str, Any]]:
        """Retrieve cached extracted pages for a document."""
        return DOCUMENT_PAGES_CACHE.get(doc_name, [])

    @classmethod
    def structure_aware_chunking(
        cls, 
        pages_data: List[Dict[str, Any]], 
        document_id: str,
        chunk_size: int = 400, 
        chunk_overlap: int = 40
    ) -> List[Dict[str, Any]]:
        """Split page texts into structure-aware chunks with section header extraction."""
        chunks = []
        chunk_counter = 1

        for p_info in pages_data:
            page_num = p_info["page_number"]
            page_text = p_info["text"]
            if not page_text.strip():
                continue

            # Split paragraphs or sections by headers (## Section, Article, المادة, السؤال, etc.)
            sections = re.split(r'(?=\n#{1,3}\s+|\n(?:Section|Article|المادة|السؤال|Clause)\s+[\d\.]+)', page_text)
            
            for section in sections:
                sec_text = section.strip()
                if not sec_text:
                    continue
                
                # Detect section header
                header_match = re.search(r'^(?:#{1,3}\s+|Section\s+[\d\.]+|Article\s+[\d\.]+|المادة\s+[\d\.]+|السؤال\s+[\d\.]+|Clause\s+[\d\.]+)[^\n]+', sec_text, re.MULTILINE)
                section_title = header_match.group(0).replace("#", "").strip() if header_match else f"Section on Page {page_num}"

                words = sec_text.split()
                if len(words) <= chunk_size:
                    chunks.append({
                        "chunk_id": f"{document_id}_chunk_{chunk_counter}",
                        "document_id": document_id,
                        "page_number": page_num,
                        "section_title": section_title,
                        "text_content": sec_text,
                        "token_count": len(words)
                    })
                    chunk_counter += 1
                else:
                    start = 0
                    while start < len(words):
                        sub_words = words[start:start + chunk_size]
                        sub_text = " ".join(sub_words)
                        chunks.append({
                            "chunk_id": f"{document_id}_chunk_{chunk_counter}",
                            "document_id": document_id,
                            "page_number": page_num,
                            "section_title": section_title,
                            "text_content": sub_text,
                            "token_count": len(sub_words)
                        })
                        chunk_counter += 1
                        start += (chunk_size - chunk_overlap)

        return chunks

    # Alias for backward compatibility
    semantic_chunking = structure_aware_chunking

