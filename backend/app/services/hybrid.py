from app.services.content_based import recommend_content
from app.services.collaborative import model, movies_df


def recommend_hybrid(user_id: int, movie_name: str):

    content_movies = recommend_content(movie_name)

    if content_movies is None:
        return None

    recommendations = []

    for title in content_movies:

        movie = movies_df[movies_df["title"].str.contains(title, case=False, na=False)]

        if movie.empty:
            continue

        movie_id = int(movie.iloc[0]["movieId"])

        predicted = model.predict(user_id, movie_id).est

        recommendations.append({
            "movieId": movie_id,
            "title": title,
            "predicted_rating": round(predicted, 2)
        })

    recommendations.sort(
        key=lambda x: x["predicted_rating"],
        reverse=True
    )

    return recommendations