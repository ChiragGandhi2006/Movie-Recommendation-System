import api from "../api/axiosInstance";

// POST /auth/signup  { username, email, password } -> { message, user_id }
export const signup = (payload) => api.post("/auth/signup", payload);

// POST /auth/login  { email, password } -> { access_token, token_type }
export const login = (payload) => api.post("/auth/login", payload);

// GET /users/profile (requires Bearer token) -> { message, user }
export const getProfile = () => api.get("/users/profile");

export const savePreferences = (genres) => api.put("/users/preferences", { genres });
