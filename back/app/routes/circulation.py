from datetime import date, timedelta
from fastapi import APIRouter, HTTPException, status
from typing import List
from app.models import IssueOut, IssueRequest, ReturnRequest
from app.data import issues, books, customers

router = APIRouter(prefix="/api/circulation", tags=["Circulation"])

@router.get("/{cust_id}/issues/current", response_model=List[IssueOut])
def get_current_issues(cust_id: int):
    return [i for i in issues if i["customer_id"] == cust_id and i["return_date"] == None]

@router.post("/{cust_id}/issue", response_model=IssueOut, status_code=status.HTTP_201_CREATED)
def issue_book(cust_id: int, req: IssueRequest):
    cust = next((c for c in customers if c["id"] == cust_id), None)
    if not cust:
        raise HTTPException(status_code=404, detail="Customer not found")
    book = next((b for b in books if b["id"] == req.book_id), None)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if any(i["book"]["id"] == req.book_id and i["return_date"] is None for i in issues):
        raise HTTPException(status_code=400, detail="Book already issued")

    issue = {
        "id": max([x["id"] for x in issues]) + 1,
        "book": book,
        "issue_date": date.today(),
        "return_until": date.today() + timedelta(days=req.days),
        "return_date": None,
        "renewed": False,
        "customer_id": cust_id,
    }
    issues.append(issue)
    return issue

@router.post("/{cust_id}/return", response_model=IssueOut)
def return_book(cust_id: int, req: ReturnRequest):
    issue = next((i for i in issues if i["id"] == req.issue_id), None)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    issue["return_date"] = date.today()
    return issue

@router.post("/{cust_id}/renew/{issue_id}", response_model=IssueOut)
def renew_issue(cust_id: int, issue_id: int):
    issue = next((i for i in issues if i["id"] == issue_id), None)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    if issue["renewed"]:
        raise HTTPException(status_code=400, detail="Already renewed")
    issue["renewed"] = True
    issue["return_until"] = issue["return_until"] + timedelta(days=7)
    return issue
