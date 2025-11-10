from fastapi import APIRouter, HTTPException, status
from typing import List
from app.models import CustomerOut, CustomerIn
from app.data import customers

router = APIRouter(prefix="/api/customers", tags=["Customers"])

@router.get("", response_model=List[CustomerOut])
def list_customers():
    return customers

@router.get("/{cust_id}", response_model=CustomerOut)
def get_customer(cust_id: int):
    cust = next((c for c in customers if c["id"] == cust_id), None)
    if not cust:
        raise HTTPException(status_code=404, detail="Customer not found")
    return cust

@router.post("", response_model=CustomerOut, status_code=status.HTTP_201_CREATED)
def create_customer(data: CustomerIn):
    cust = data.model_dump()
    cust["id"] = max([x["id"] for x in customers]) + 1
    customers.append(cust)
    return cust

@router.put("/{cust_id}", response_model=CustomerOut)
def update_customer(cust_id: int, data: CustomerIn):
    cust = next((c for c in customers if c["id"] == cust_id), None)
    if not cust:
        raise HTTPException(status_code=404, detail="Customer not found")
    cust.update(data.model_dump())
    return cust

@router.delete("/{cust_id}", status_code=204)
def delete_customer(cust_id: int):
    global customers
    customers = [c for c in customers if c["id"] != cust_id]
    return {"ok": True}
