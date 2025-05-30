from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import StreamingResponse, Response
import os

from app.config import VIDEOS_DIR  

class RangeRequestMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if "range" in request.headers:
            filename = request.url.path.removeprefix("/videos/")
            file_path = os.path.join(VIDEOS_DIR, filename)
            if not os.path.isfile(file_path):
                return Response(status_code=404)

            file_size = os.path.getsize(file_path)

            range_header = request.headers["range"]

            start_str, end_str = range_header.replace("bytes=", "").split("-")
            start = int(start_str)
            end = int(end_str) if end_str else file_size - 1

            length = end - start + 1

            with open(file_path, "rb") as f:
                f.seek(start)
                data = f.read(length)

            return StreamingResponse(
                iter([data]),
                status_code=206,
                headers={
                    "Content-Range": f"bytes {start}-{end}/{file_size}",
                    "Accept-Ranges": "bytes",
                    "Content-Length": str(length),
                    "Content-Type": "video/mp4",
                }
            )

        return await call_next(request)
