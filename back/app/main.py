from fastapi import FastAPI
from app.routes import auth, books, customers, circulation, reports

app = FastAPI(title="Library Management API")

# Register routers
app.include_router(auth.router)
app.include_router(books.router)
app.include_router(customers.router)
app.include_router(circulation.router)
app.include_router(reports.router)


