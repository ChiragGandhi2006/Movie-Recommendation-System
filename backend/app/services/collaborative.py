import pickle
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[3]

ML_DIR = BASE_DIR / "ml"
DATASET_DIR = BASE_DIR / "dataset" / "movielens"

# Load trained SVD model
with open(ML_DIR / "collaborative_model.pkl", "rb") as file:
    model = pickle.load(file)

movies_df = pd.read_csv(DATASET_DIR / "movies.csv")


def recommend_collaborative(user_id: int, top_n: int = 10):

    predictions = []

    for movie_id in movies_df["movieId"]:

        predicted_rating = model.predict(user_id, movie_id).est

        predictions.append({
            "movieId": movie_id,
            "predicted_rating": predicted_rating
        })

    predictions = sorted(
        predictions,
        key=lambda x: x["predicted_rating"],
        reverse=True
    )[:top_n]

    recommendations = []

    for item in predictions:

        movie = movies_df[movies_df["movieId"] == item["movieId"]].iloc[0]

        recommendations.append({
            "movieId": int(movie["movieId"]),
            "title": movie["title"],
            "predicted_rating": round(item["predicted_rating"], 2)
        })

    return recommendations