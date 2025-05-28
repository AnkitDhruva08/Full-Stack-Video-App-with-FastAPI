from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import videos
from app.database import Base, engine
import os
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Create DB tables
print("Creating database tables if they don't exist...")
Base.metadata.create_all(bind=engine)
print("Database tables ensured.")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
print("CORS middleware enabled for http://localhost:5173")

# Ensure 'videos' directory exists
# VIDEOS_DIR = os.path.join(os.path.dirname(__file__), "..", "videos")
VIDEOS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "videos"))
print('VIDEOS_DIR ==<<<>>', VIDEOS_DIR)
if not os.path.exists(VIDEOS_DIR):
    os.makedirs(VIDEOS_DIR)
    print(f"Created 'videos' directory at {VIDEOS_DIR}")
else:
    print(f"'videos' directory already exists at {VIDEOS_DIR}")




# ✅ Mount the directory so FastAPI serves video files
app.mount("/videos", StaticFiles(directory=VIDEOS_DIR), name="videos")
# Include routers
app.include_router(videos.router)
print("Video router loaded and registered.")

# Optional test route
@app.get("/")
def read_root():
    return {"message": "Hello World"}
