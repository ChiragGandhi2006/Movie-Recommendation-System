# MovieVerse AI — Frontend

A premium, Netflix-inspired React frontend for an existing FastAPI + ML movie recommendation backend. Built with Vite, Tailwind CSS, React Router, Axios, and Framer Motion.

## Getting started

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5173` by default.

## Connecting to your backend

Set the backend base URL in `.env`:

```
VITE_API_URL=http://localhost:8000
```

The frontend was built strictly from your existing FastAPI routes — no backend code, endpoints, or request/response shapes were changed. It calls exactly:

| Endpoint | Used by |
|---|---|
| `POST /auth/signup` | Signup page |
| `POST /auth/login` | Login page |
| `GET /users/profile` | Profile page, navbar, personalized recommendations |
| `GET /movies/search?query=` | Search bar, Search page, Trending/Popular sections |
| `GET /movies/{movie_id}` | Movie Details page |
| `GET /recommend/content/{movie_name}` | Recommendations page (Content-Based tab) |
| `GET /recommend/collaborative/{user_id}` | Home page, Recommendations page (Collaborative tab) |
| `GET /recommend/hybrid/{user_id}/{movie_name}` | Recommendations page (Hybrid tab) |

## Notes on current backend limitations

A few UI states gracefully degrade because the backend doesn't yet expose this data — nothing was faked, and no backend code was touched:

- **Posters**: there's no poster/image field in `/movies/{id}` or the MovieLens dataset, so posters are generated as deterministic gradient placeholders from the movie title.
- **Overview/synopsis**: not present in the dataset; the Movie Details page shows a short note instead of fabricated text.
- **Trending / Popular sections**: there's no dedicated endpoint for these, so they're populated with real titles pulled from `/movies/search` using curated seed terms.
- **Forgot password**: no reset endpoint exists yet; the UI shows a friendly "coming soon" message instead of calling a non-existent route.
- **Content recommendations**: the endpoint returns plain title strings (no `movieId`), so the frontend does a best-effort `/movies/search` lookup per title to enable "View Details" links.

## Tech stack

React 19 · Vite · Tailwind CSS v4 · React Router v7 · Axios · Framer Motion · React Icons
