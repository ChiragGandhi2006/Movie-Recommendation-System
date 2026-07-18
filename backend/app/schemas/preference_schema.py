from pydantic import BaseModel, Field


class PreferenceUpdate(BaseModel):
    genres: list[str] = Field(min_length=1, max_length=8)
