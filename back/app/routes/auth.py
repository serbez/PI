from fastapi import APIRouter, HTTPException, status
from app.models import ManagerLogin
from app.data import users

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/login")
def login(data: ManagerLogin):
    user = next((m for m in users if m["username"] == data.username and m["password"] == data.password), None)

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="nu ne slozhno zhe vrode dolzhno bit' ...")
    
    return {"id": user["id"], "username": user["username"], "token": f"token-{user['id']}"}
