import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[3]

MOVIELENS_DIR = BASE_DIR / "dataset" / "movielens"

movies_df = pd.read_csv(MOVIELENS_DIR / "movies.csv")


def search_movies(query: str):
    result = movies_df[
        movies_df["title"].str.contains(query, case=False, na=False)
    ][["movieId", "title"]]

    return result.head(10).to_dict(orient="records")

def get_movie_details(movie_id: int):
    movie = movies_df[movies_df["movieId"] == movie_id]

    if movie.empty:
        return None

    return movie.iloc[0].to_dict()