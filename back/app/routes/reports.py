from datetime import date
from fastapi import APIRouter
from typing import List
from app.models import IssueOut
from app.data import issues

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/reminders", response_model=List[IssueOut])
def reminders():
    today = date.today()
    return [i for i in issues if i["return_until"] and i["return_until"] < today and i["return_date"] is None]

@router.get("/book-history/{book_id}", response_model=List[IssueOut])
def book_history(book_id: int):
    return [i for i in issues if i["book"]["id"] == book_id]
