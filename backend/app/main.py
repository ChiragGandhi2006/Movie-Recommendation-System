from fastapi import FastAPI

from app.database.database import Base, engine
from app.database.models import User
from app.routes.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Movie Recommendation API",
    version="1.0.0"
)

app.include_router(auth_router)


@app.get("/")
def home():
    return {
        "message": "Movie Recommendation System API is Running 🚀"
    }