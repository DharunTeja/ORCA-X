from typing import List, Optional
from fastapi import APIRouter, Query, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database.connection import get_db
from backend.models.models import MarineDocument
from backend.schemas.schemas import RAGDocumentResult, RAGSearchRequest
from backend.services.rag_service import search_marine_knowledge

router = APIRouter(prefix="/api/rag", tags=["Marine Knowledge RAG"])

@router.post("/search", response_model=List[RAGDocumentResult])
async def search_knowledge(req: RAGSearchRequest):
    """Semantic & keyword search across PFZ bulletins, research papers, and guidelines."""
    return await search_marine_knowledge(
        query=req.query,
        category=req.category,
        source=req.source,
        top_k=req.top_k or 5
    )

@router.get("/documents", response_model=List[RAGDocumentResult])
async def list_documents(
    category: Optional[str] = Query(None),
    source: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """List all indexed marine documents with optional filtering."""
    stmt = select(MarineDocument)
    if category and category != "All":
        stmt = stmt.where(MarineDocument.category == category)
    if source and source != "All":
        stmt = stmt.where(MarineDocument.source == source)
        
    res = await db.execute(stmt)
    docs = res.scalars().all()
    
    return [
        RAGDocumentResult(
            id=d.id,
            title=d.title,
            category=d.category,
            source=d.source,
            publication_date=d.publication_date,
            summary=d.summary,
            relevance_score=1.0,
            key_findings=[
                f"Published by {d.source}.",
                f"Class: {d.category}.",
                "Official verified maritime knowledge asset."
            ],
            file_url=d.file_url
        )
        for d in docs
    ]
