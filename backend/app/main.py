from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routers import videos
from app.database import Base, engine
from app.middleware.range_middleware import RangeRequestMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from app.config import VIDEOS_DIR  # Import VIDEOS_DIR here

import os

app = FastAPI()

print("Creating database tables if they don't exist...")
Base.metadata.create_all(bind=engine)
print("Database tables ensured.")

# Global CORS middleware for API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Optional middleware to support HTTP Range Requests for video streaming
app.add_middleware(RangeRequestMiddleware)

print("VIDEOS_DIR ==<<<>>", VIDEOS_DIR)

# Create directory if it doesn't exist
if not os.path.exists(VIDEOS_DIR):
    os.makedirs(VIDEOS_DIR)
    print(f"Created 'videos' directory at {VIDEOS_DIR}")
else:
    print(f"'videos' directory already exists at {VIDEOS_DIR}")

class CORSMiddlewareForStaticFiles(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response: Response = await call_next(request)
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
        response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"
        return response

app.add_middleware(CORSMiddlewareForStaticFiles)

app.mount("/videos", StaticFiles(directory=VIDEOS_DIR), name="videos")

app.include_router(videos.router)
print("Video router loaded and registered.")

@app.get("/")
def read_root():
    return {"message": "Hello World"}
