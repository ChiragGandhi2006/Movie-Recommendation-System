from fastapi import APIRouter, HTTPException
from app.services.movie_service import search_movies, get_movie_details

router = APIRouter(
    prefix="/movies",
    tags=["Movies"]
)

@router.get("/search")
def search(query: str):
    return search_movies(query)

@router.get("/{movie_id}")
def movie_details(movie_id: int):

    movie = get_movie_details(movie_id)

    if movie is None:
        raise HTTPException(
            status_code=404,
            detail="Movie not found"
        )

    return movie
