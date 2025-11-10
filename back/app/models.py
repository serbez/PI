from datetime import date
from typing import List, Optional
from pydantic import BaseModel

class ManagerLogin(BaseModel):
    username: str
    password: str

class AuthorOut(BaseModel):
    id: int
    name: str
    bio: Optional[str] = None
    wikipedia: Optional[str] = None

class CoverOut(BaseModel):
    id: int
    cover_file: Optional[str] = None

class SubjectOut(BaseModel):
    id: int
    subject: str

class BookOut(BaseModel):
    id: int
    title: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    publication_date: Optional[date] = None
    authors: List[AuthorOut] = []
    subjects: List[SubjectOut] = []
    covers: List[CoverOut] = []

class CustomerIn(BaseModel):
    name: str
    address: Optional[str] = None
    zip: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None

class CustomerOut(CustomerIn):
    id: int

class IssueOut(BaseModel):
    id: int
    book: BookOut
    issue_date: date
    return_until: Optional[date] = None
    return_date: Optional[date] = None
    renewed: bool

class IssueRequest(BaseModel):
    book_id: int
    days: Optional[int] = 14

class ReturnRequest(BaseModel):
    issue_id: int
