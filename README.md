---
title: MovieVerse AI
emoji: 🎬
colorFrom: red
colorTo: purple
sdk: docker
app_port: 7860
---

# MovieVerse AI deployment

This project is ready for a free [Hugging Face Docker Space](https://huggingface.co/new-space). The container builds the React frontend and serves it with the FastAPI API at one URL.

## Deploy

1. Create a public **Docker** Space at [Hugging Face](https://huggingface.co/new-space).
2. Add these Space secrets: `SECRET_KEY` (a long random value), `ALGORITHM` (`HS256`), and `ACCESS_TOKEN_EXPIRE_MINUTES` (`60`).
3. Upload the model artifacts with Git LFS before pushing; they are required for content, collaborative, and hybrid recommendations:

   ```powershell
   git lfs install
   git add -f ml/collaborative_model.pkl ml/movies.pkl ml/similarity.pkl
   git add .gitattributes Dockerfile .dockerignore backend/.env.example backend/requirements.deploy.txt README.md
   git commit -m "Add free Docker deployment"
   git remote add huggingface https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME
   git push huggingface HEAD:main
   ```

The app uses SQLite at `/app/data/movieverse.db` when `DATABASE_URL` is not set. This is suitable for a demo, but free Spaces can reset it after a rebuild. Add a managed database URL as the `DATABASE_URL` Space secret for durable user accounts.

## Local container check

```powershell
docker build -t movieverse-ai .
docker run --rm -p 7860:7860 --env-file backend/.env movieverse-ai
```

Open `http://localhost:7860`.
