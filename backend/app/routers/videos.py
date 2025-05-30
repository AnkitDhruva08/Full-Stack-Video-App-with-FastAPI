from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import uuid4
import shutil
import os
from .. import crud, schemas, database

router = APIRouter(prefix="/api/videos", tags=["Videos"])

UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "videos"))


@router.post("/", response_model=schemas.VideoOut)
async def upload_video(
    title: str = Form(...),
    description: str = Form(""),
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    filename = "{}_{}".format(uuid4(), file.filename)
    path = os.path.join(UPLOAD_DIR, filename)

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = crud.create_video(db, schemas.VideoCreate(title=title, description=description), filename)
    print("Video uploaded successfully with ID: {}".format(result.id))
    return result


@router.get("/", response_model=list[schemas.VideoOut])
def list_videos(search: str = "", db: Session = Depends(database.get_db)):
    videos = crud.get_videos(db, search)
    return videos


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
        new_filename = "{}_{}".format(uuid4(), file.filename)
        path = os.path.join(UPLOAD_DIR, new_filename)
        with open(path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        old_file_path = os.path.join(UPLOAD_DIR, video.filename)
        if os.path.exists(old_file_path):
            os.remove(old_file_path)

        video.filename = new_filename

    update_data = {
        "title": title if title is not None else video.title,
        "description": description if description is not None else video.description,
        "filename": video.filename
    }

    result = crud.update_video(db, video_id, update_data)
    return result


@router.delete("/{video_id}")
def delete_video(video_id: int, db: Session = Depends(database.get_db)):
    video = crud.get_video(db, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    file_path = os.path.join(UPLOAD_DIR, video.filename)
    if os.path.exists(file_path):
        os.remove(file_path)

    crud.delete_video(db, video_id)
    return {"detail": "Video deleted"}
