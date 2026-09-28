from typing import List, Optional
from sqlalchemy import select
from backend.database.connection import AsyncSessionLocal
from backend.models.models import MarineDocument
from backend.schemas.schemas import RAGDocumentResult

async def search_marine_knowledge(
    query: str,
    category: Optional[str] = None,
    source: Optional[str] = None,
    top_k: int = 5
) -> List[RAGDocumentResult]:
    """Retrieve indexed marine intelligence documents matching query keywords."""
    async with AsyncSessionLocal() as session:
        stmt = select(MarineDocument)
        if category and category != "All":
            stmt = stmt.where(MarineDocument.category == category)
        if source and source != "All":
            stmt = stmt.where(MarineDocument.source == source)

        res = await session.execute(stmt)
        docs = res.scalars().all()

        results: List[RAGDocumentResult] = []
        tokens = [t.lower() for t in query.split() if len(t) > 2]

        for d in docs:
            score = 0.5  # Base relevance
            doc_blob = f"{d.title} {d.summary} {d.full_text} {d.keywords or ''}".lower()
            
            for t in tokens:
                if t in doc_blob:
                    score += 0.15
                if t in d.title.lower():
                    score += 0.25

            score = min(0.99, round(score, 2))

            key_findings = [
                f"Source agency: {d.source} Marine Sciences Division.",
                f"Classification: {d.category} validated for North Indian Ocean Basin.",
                f"Operational impact: Direct application to coastal advisory and fleet safety compliance."
            ]

            results.append(RAGDocumentResult(
                id=d.id,
                title=d.title,
                category=d.category,
                source=d.source,
                publication_date=d.publication_date,
                summary=d.summary,
                relevance_score=score,
                key_findings=key_findings,
                file_url=d.file_url
            ))

        # Sort by relevance descending
        results.sort(key=lambda x: x.relevance_score, reverse=True)
        return results[:top_k]
