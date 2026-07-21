import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from app.database.database import Base, engine
from app.database.models import User
from app.routes.auth import router as auth_router
from app.routes.users import router as user_router
from app.routes.recommend import router as recommend_router
from app.routes.movies import router as movies_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Movie Recommendation API", version="1.0.0")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in CORS_ORIGINS.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(recommend_router)
app.include_router(movies_router)


@app.get("/")
def home():
    return {"message": "Movie Recommendation System API is running"}


# The Docker deployment builds the Vite app and serves it from this API origin.
FRONTEND_DIST = Path(__file__).resolve().parents[2] / "frontend" / "dist"
if FRONTEND_DIST.is_dir():
    @app.get("/{full_path:path}", include_in_schema=False)
    def frontend(full_path: str):
        requested_file = (FRONTEND_DIST / full_path).resolve()
        if full_path and requested_file.is_relative_to(FRONTEND_DIST.resolve()) and requested_file.is_file():
            return FileResponse(requested_file)
        return FileResponse(FRONTEND_DIST / "index.html")
