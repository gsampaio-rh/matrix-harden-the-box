"""Shared FastAPI dependencies."""

from fastapi import Header, HTTPException

from app.config import settings


async def require_admin(x_admin_key: str = Header(default="")) -> None:
    if not settings.admin_key:
        raise HTTPException(
            status_code=403,
            detail="Admin access disabled — set HTB_ADMIN_KEY to enable",
        )
    if x_admin_key != settings.admin_key:
        raise HTTPException(status_code=403, detail="Invalid or missing admin key")
