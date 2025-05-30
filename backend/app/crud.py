from sqlalchemy.orm import Session
from . import models, schemas

def get_videos(db: Session, search: str = ""):
    results = db.query(models.Video).filter(
        models.Video.title.ilike(f"%{search}%")
    ).order_by(models.Video.upload_date.desc()).all()
    return results

def get_video(db: Session, video_id: int):
    video = db.query(models.Video).filter(models.Video.id == video_id).first()
    return video

def create_video(db: Session, video: schemas.VideoCreate, filename: str):
    db_video = models.Video(**video.dict(), filename=filename)
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    return db_video

def update_video(db: Session, video_id: int, update_data: dict):
    video = get_video(db, video_id)
    if not video:
        return None
    for key, value in update_data.items():
        setattr(video, key, value)
    db.commit()
    db.refresh(video)
    return video

def delete_video(db: Session, video_id: int):
    video = get_video(db, video_id)
    if not video:
        return None
    db.delete(video)
    db.commit()
    return video
