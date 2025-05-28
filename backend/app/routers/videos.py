from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import uuid4
import shutil, os
from .. import crud, schemas, database

router = APIRouter(prefix="/api/videos", tags=["Videos"])

UPLOAD_DIR = "videos"

@router.post("/", response_model=schemas.VideoOut)
async def upload_video(
    title: str = Form(...),
    description: str = Form(""),
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    filename = f"{uuid4()}_{file.filename}"
    path = os.path.join(UPLOAD_DIR, filename)
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return crud.create_video(db, schemas.VideoCreate(title=title, description=description), filename)

@router.get("/", response_model=list[schemas.VideoOut])
def list_videos(search: str = "", db: Session = Depends(database.get_db)):
    return crud.get_videos(db, search)

@router.put("/{video_id}", response_model=schemas.VideoOut)
async def update_video(
    video_id: int,
    title: str = Form(None),
    description: str = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(database.get_db)
):
    video = crud.get_video(db, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    if file:
        new_filename = f"{uuid4()}_{file.filename}"
        path = os.path.join(UPLOAD_DIR, new_filename)
        with open(path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        os.remove(os.path.join(UPLOAD_DIR, video.filename))
        video.filename = new_filename

    return crud.update_video(db, video_id, {"title": title, "description": description, "filename": video.filename})

@router.delete("/{video_id}")
def delete_video(video_id: int, db: Session = Depends(database.get_db)):
    video = crud.get_video(db, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    os.remove(os.path.join(UPLOAD_DIR, video.filename))
    crud.delete_video(db, video_id)
    return {"detail": "Video deleted"}
