from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv
from urllib.parse import quote_plus
from pathlib import Path
import os

# ==========================================================
# Load .env file
# ==========================================================

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

# ==========================================================
# Read Environment Variables
# ==========================================================

DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = quote_plus(os.getenv("DB_PASSWORD", ""))

# ==========================================================
# Database URL
# ==========================================================

DATABASE_URL = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# (Optional) Print for debugging
print("DATABASE_URL =", DATABASE_URL)

# ==========================================================
# Create Engine
# ==========================================================

engine = create_engine(
    DATABASE_URL,
    echo=True
)

# ==========================================================
# Session
# ==========================================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ==========================================================
# Base Class
# ==========================================================

Base = declarative_base()

# ==========================================================
# Dependency
# ==========================================================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()