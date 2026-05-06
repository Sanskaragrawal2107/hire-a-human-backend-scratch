from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.database import create_connection, disconnect_db
from src.routers import recruiters
from src.routers import engineers
from src.routers import admin
from src.routers import agent

@asynccontextmanager
async def lifespan(app: FastAPI):
	await create_connection()
	try:
		yield
	finally:
		await disconnect_db()


app = FastAPI(lifespan=lifespan, title="HireAHuman API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "https://hire-a-human.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ASGI entrypoint alias for `uvicorn main:main --reload`
main = app

app.include_router(recruiters.router)
app.include_router(engineers.router)
app.include_router(admin.router)
app.include_router(agent.router)