from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services.content_based import recommend_content
from app.services.collaborative import recommend_collaborative
from app.services.hybrid import recommend_hybrid
from app.services.movie_service import recommend_by_genres
from app.database.database import get_db
from app.database.models import UserPreference
from app.utils.auth_dependency import get_current_user

router = APIRouter(
    prefix="/recommend",
    tags=["Recommendation"]
)


@router.get("/personalized")
def personalized_recommendations(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    preference = db.query(UserPreference).filter(
        UserPreference.user_id == current_user["id"]
    ).first()
    if not preference:
        raise HTTPException(status_code=400, detail="Choose your favourite genres first.")

    genres = preference.genres.split(",")
    return {"genres": genres, "recommendations": recommend_by_genres(genres)}

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
