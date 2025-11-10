from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.models import BookOut, AuthorOut
from app.data import books

router = APIRouter(prefix="/api/books", tags=["Books"])

@router.get("", response_model=List[BookOut])
def get_books(q: Optional[str] = None, author: Optional[str] = None, subject: Optional[str] = None):
    result = books
    if q:
        result = [b for b in result if q.lower() in b["title"].lower()]
    if author:
        result = [b for b in result if any(author.lower() in a["name"].lower() for a in b["authors"])]
    if subject:
        result = [b for b in result if any(subject.lower() in s["subject"].lower() for s in b["subjects"])]
    return result

@router.get("/{book_id}", response_model=BookOut)
def get_book(book_id: int):
    book = next((b for b in books if b["id"] == book_id), None)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.get("/{book_id}/authors", response_model=List[AuthorOut])
def get_book_authors(book_id: int):
    book = next((b for b in books if b["id"] == book_id), None)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book["authors"]
