import pickle
from pathlib import Path
from app.services.movie_service import movies_df

# Get the project root folder
BASE_DIR = Path(__file__).resolve().parents[3]

# Point to the ml folder
ML_DIR = BASE_DIR / "ml"

# Load movies.pkl
with open(ML_DIR / "movies.pkl", "rb") as file:
    movies = pickle.load(file)

# Load similarity.pkl
with open(ML_DIR / "similarity.pkl", "rb") as file:
    similarity = pickle.load(file)

# Load collaborative model
with open(ML_DIR / "collaborative_model.pkl", "rb") as file:
    collaborative_model = pickle.load(file)

print(type(movies))
print(movies.head())
print(movies.columns)

def recommend_content(movie_name: str):

    movie = movies[
    movies["title"].str.lower() == movie_name.lower()
]

    if movie.empty:
        return recommend_from_movielens_genres(movie_name)

    movie_index = movie.index[0]

    distances = similarity[movie_index]

    movies_list = sorted(
        list(enumerate(distances)),
        reverse=True,
        key=lambda x: x[1]
    )[1:6]

    recommendations = []

    for i in movies_list:
        recommendations.append(
            movies.iloc[i[0]].title
        )

    return recommendations


def recommend_from_movielens_genres(movie_name: str, limit: int = 5):
    """Fallback for MovieLens titles that are not in the TMDB content model."""
    matching_movie = movies_df[
        movies_df["title"].str.casefold() == movie_name.casefold()
    ]
    if matching_movie.empty:
        return None

    source = matching_movie.iloc[0]
    genres = {genre for genre in str(source["genres"]).split("|") if genre and genre != "(no genres listed)"}
    if not genres:
        return []

    candidates = movies_df[movies_df["movieId"] != source["movieId"]].copy()
    candidates["_score"] = candidates["genres"].fillna("").apply(
        lambda value: len(genres.intersection(value.split("|")))
    )
    return candidates[candidates["_score"] > 0].sort_values(
        ["_score", "movieId"], ascending=[False, True]
    )["title"].head(limit).tolist()
