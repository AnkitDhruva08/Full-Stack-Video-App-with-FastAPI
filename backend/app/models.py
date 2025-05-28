from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from .database import Base

class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    filename = Column(String)
    upload_date = Column(DateTime, default=datetime.utcnow)
