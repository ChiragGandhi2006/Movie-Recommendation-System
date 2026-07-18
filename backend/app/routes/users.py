from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import UserPreference
from app.schemas.preference_schema import PreferenceUpdate
from app.utils.auth_dependency import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/profile")
def profile(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    preference = db.query(UserPreference).filter(
        UserPreference.user_id == current_user["id"]
    ).first()

    return {
        "message": "Welcome!",
        "user": {
            **current_user,
            "preferences": preference.genres.split(",") if preference else [],
        }
    }


@router.put("/preferences")
def save_preferences(
    payload: PreferenceUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    genres = list(dict.fromkeys(genre.strip() for genre in payload.genres if genre.strip()))
    if not genres:
        raise HTTPException(status_code=400, detail="Select at least one genre.")

    preference = db.query(UserPreference).filter(
        UserPreference.user_id == current_user["id"]
    ).first()
    if preference:
        preference.genres = ",".join(genres)
    else:
        preference = UserPreference(user_id=current_user["id"], genres=",".join(genres))
        db.add(preference)
    db.commit()
    return {"genres": genres}
