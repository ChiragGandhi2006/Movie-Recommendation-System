import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[3]

MOVIELENS_DIR = BASE_DIR / "dataset" / "movielens"

movies_df = pd.read_csv(MOVIELENS_DIR / "movies.csv")


def search_movies(query: str):
    result = movies_df[
        movies_df["title"].str.contains(query.strip(), case=False, na=False, regex=False)
    ][["movieId", "title"]]

    return result.head(10).to_dict(orient="records")

def get_movie_details(movie_id: int):
    movie = movies_df[movies_df["movieId"] == movie_id]

    if movie.empty:
        return None

    return movie.iloc[0].to_dict()


def recommend_by_genres(genres: list[str], limit: int = 10):
    selected = {genre.casefold() for genre in genres}
    candidates = movies_df.copy()
    candidates["_genres"] = candidates["genres"].fillna("").str.split("|")
    candidates["_score"] = candidates["_genres"].apply(
        lambda movie_genres: sum(genre.casefold() in selected for genre in movie_genres)
    )

    matches = candidates[candidates["_score"] > 0].sort_values(
        ["_score", "movieId"], ascending=[False, True]
    )
    return matches[["movieId", "title", "genres"]].head(limit).to_dict(orient="records")
