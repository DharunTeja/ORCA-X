from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database.connection import get_db
from backend.models.models import User
from backend.schemas.schemas import UserResponse
from backend.api.auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("", response_model=list[UserResponse])
async def list_users(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(User)
    res = await db.execute(stmt)
    return res.scalars().all()

@router.put("/language/{lang_code}")
async def update_preferred_language(
    lang_code: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if lang_code not in ["en", "te", "hi", "ta", "kn", "ml"]:
        raise HTTPException(status_code=400, detail="Unsupported language code")

    current_user.preferred_language = lang_code
    await db.commit()
    return {"status": "success", "preferred_language": lang_code}
