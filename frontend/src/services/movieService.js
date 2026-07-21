import api from "../api/axiosInstance";

// GET /movies/search?query=  -> [{ movieId, title }]
export const searchMovies = (query) =>
  api.get("/movies/search", { params: { query } });

// GET /movies/{movie_id} -> { movieId, title, genres }
export const getMovieDetails = (movieId) => api.get(`/movies/${movieId}`);

// GET /recommend/content/{movie_name} -> { movie, recommendations: [titles] }
export const getContentRecommendations = (movieName) =>
  api.get(`/recommend/content/${encodeURIComponent(movieName)}`);

// GET /recommend/collaborative/{user_id} -> [{ movieId, title, predicted_rating }]
export const getCollaborativeRecommendations = (userId) =>
  api.get(`/recommend/collaborative/${userId}`);

// GET /recommend/hybrid/{user_id}/{movie_name} -> [{ movieId, title, predicted_rating }]
export const getHybridRecommendations = (userId, movieName) =>
  api.get(`/recommend/hybrid/${userId}/${encodeURIComponent(movieName)}`);

export const getPersonalizedRecommendations = () => api.get("/recommend/personalized");
