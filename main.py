from contextlib import asynccontextmanager

from fastapi import FastAPI

from src.database import create_connection, disconnect_db
from src.routers import recruiters
from src.routers import engineers
from src.routers import admin

@asynccontextmanager
async def lifespan(app: FastAPI):
	await create_connection()
	try:
		yield
	finally:
		await disconnect_db()


app = FastAPI(lifespan=lifespan)

app.include_router(recruiters.router)
app.include_router(engineers.router)
app.include_router(admin.router)