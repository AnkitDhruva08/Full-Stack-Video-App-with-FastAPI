from sqlalchemy.orm import Session
from . import models, schemas

def get_videos(db: Session, search: str = ""):
    print(f" Fetching videos with search query: '{search}'")
    results = db.query(models.Video).filter(
        models.Video.title.ilike(f"%{search}%")
    ).order_by(models.Video.upload_date.desc()).all()
    print(f" Found {len(results)} video(s)")
    return results

def get_video(db: Session, video_id: int):
    print(f"Fetching video with ID: {video_id}")
    video = db.query(models.Video).filter(models.Video.id == video_id).first()
    if video:
        print(f"Found video: {video.title}")
    else:
        print("Video not found")
    return video

def create_video(db: Session, video: schemas.VideoCreate, filename: str):
    print(f"Creating new video: {video.title} with filename: {filename}")
    db_video = models.Video(**video.dict(), filename=filename)
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    print(f"Video created with ID: {db_video.id}")
    return db_video

def update_video(db: Session, video_id: int, update_data: dict):
    print(f"Updating video ID: {video_id} with data: {update_data}")
    video = get_video(db, video_id)
    if not video:
        print("Cannot update: video not found.")
        return None
    for key, value in update_data.items():
        setattr(video, key, value)
    db.commit()
    db.refresh(video)
    print(f"Video ID {video_id} updated.")
    return video

def delete_video(db: Session, video_id: int):
    print(f"Deleting video with ID: {video_id}")
    video = get_video(db, video_id)
    if not video:
        print("Cannot delete: video not found.")
        return None
    db.delete(video)
    db.commit()
    print(f"Video ID {video_id} deleted.")
    return video
