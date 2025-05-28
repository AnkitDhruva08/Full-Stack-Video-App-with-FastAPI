from pydantic import BaseModel
from datetime import datetime

class VideoBase(BaseModel):
    title: str
    description: str | None = None

class VideoCreate(VideoBase):
    pass

class VideoUpdate(VideoBase):
    pass

class VideoOut(VideoBase):
    id: int
    filename: str
    upload_date: datetime

    model_config = {
        "from_attributes": True
    }
