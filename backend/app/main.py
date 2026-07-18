from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine
from app.database.models import User
from app.routes.auth import router as auth_router
from app.routes.users import router as user_router
from app.routes.recommend import router as recommend_router
from app.routes.movies import router as movies_router


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Movie Recommendation API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
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
    return {
        "message": "Movie Recommendation System API is Running 🚀"
    }
