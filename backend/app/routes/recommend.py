from fastapi import APIRouter, HTTPException
from app.services.content_based import recommend_content
from app.services.collaborative import recommend_collaborative
from app.services.hybrid import recommend_hybrid

router = APIRouter(
    prefix="/recommend",
    tags=["Recommendation"]
)

@router.get("/content/{movie_name}")
def content_recommendation(movie_name: str):

    recommendations = recommend_content(movie_name)

    if recommendations is None:
        raise HTTPException(
            status_code=404,
            detail="Movie not found"
        )

    return {
        "movie": movie_name,
        "recommendations": recommendations
    }

@router.get("/collaborative/{user_id}")
def collaborative_recommendation(user_id: int):
    return recommend_collaborative(user_id)

@router.get("/hybrid/{user_id}/{movie_name}")
def hybrid_recommendation(user_id: int, movie_name: str):

    recommendations = recommend_hybrid(user_id, movie_name)

    if recommendations is None:
        raise HTTPException(
            status_code=404,
            detail="Movie not found"
        )

    return recommendations