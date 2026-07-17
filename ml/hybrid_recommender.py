import pickle
import pandas as pd
import re
from pathlib import Path

# ============================================================
# Project Paths
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent

# ============================================================
# Load Models
# ============================================================

with open(BASE_DIR / "movies.pkl", "rb") as f:
    movies = pickle.load(f)

with open(BASE_DIR / "similarity.pkl", "rb") as f:
    similarity = pickle.load(f)

with open(BASE_DIR / "collaborative_model.pkl", "rb") as f:
    collaborative_model = pickle.load(f)

# ============================================================
# Load MovieLens Dataset
# ============================================================

ml_movies = pd.read_csv(PROJECT_DIR / "dataset" / "movielens" / "movies.csv")
links = pd.read_csv(PROJECT_DIR / "dataset" / "movielens" / "links.csv")

# ============================================================
# Clean Movie Titles
# ============================================================

def clean_title(title):
    return re.sub(r"\(\d{4}\)", "", title).strip()

ml_movies["clean_title"] = ml_movies["title"].apply(clean_title)

title_to_movieid = dict(
    zip(
        ml_movies["clean_title"],
        ml_movies["movieId"]
    )
)

# ============================================================
# Content-Based Recommendation
# ============================================================

def content_recommend(movie_name, top_n=20):

    if movie_name not in movies["title"].values:
        raise ValueError(f"Movie '{movie_name}' not found.")

    movie_index = movies[movies["title"] == movie_name].index[0]

    distances = similarity[movie_index]

    movie_list = sorted(
        list(enumerate(distances)),
        key=lambda x: x[1],
        reverse=True
    )[1:top_n + 1]

    recommendations = []

    for i in movie_list:

        recommendations.append({
            "title": movies.iloc[i[0]].title,
            "similarity": float(i[1])
        })

    return recommendations


# ============================================================
# Collaborative Prediction
# ============================================================

def collaborative_score(user_id, movie_title):

    movie_id = title_to_movieid.get(movie_title)

    if movie_id is None:
        return None

    prediction = collaborative_model.predict(user_id, movie_id)

    return float(prediction.est)


# ============================================================
# Hybrid Recommendation
# ============================================================

CONTENT_WEIGHT = 0.7
COLLAB_WEIGHT = 0.3


def hybrid_recommend(user_id, movie_name, top_n=5):

    recommendations = []

    content_movies = content_recommend(movie_name, top_n=20)

    for movie in content_movies:

        predicted_rating = collaborative_score(
            user_id,
            movie["title"]
        )

        if predicted_rating is None:
            continue

        normalized_rating = predicted_rating / 5

        hybrid_score = (
            CONTENT_WEIGHT * movie["similarity"] +
            COLLAB_WEIGHT * normalized_rating
        )

        recommendations.append({

            "title": movie["title"],

            "similarity_score": round(
                movie["similarity"], 3
            ),

            "predicted_rating": round(
                predicted_rating, 2
            ),

            "hybrid_score": round(
                hybrid_score, 3
            )

        })

    recommendations.sort(
        key=lambda x: x["hybrid_score"],
        reverse=True
    )

    return recommendations[:top_n]


# ============================================================
# Test
# ============================================================

if __name__ == "__main__":

    result = hybrid_recommend(
        user_id=1,
        movie_name="Avatar",
        top_n=5
    )

    for idx, movie in enumerate(result, start=1):

        print(f"{idx}. {movie['title']}")
        print(f"   Similarity Score : {movie['similarity_score']}")
        print(f"   Predicted Rating : {movie['predicted_rating']}")
        print(f"   Hybrid Score     : {movie['hybrid_score']}")
        print("-" * 40)