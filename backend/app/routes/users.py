from fastapi import APIRouter, Depends

from app.utils.auth_dependency import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/profile")
def profile(
    current_user=Depends(get_current_user)
):

    return {
        "message": "Welcome!",
        "user": current_user
    }