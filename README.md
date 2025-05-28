# Full Stack Video Upload & Management Application

## Tech Stack
- **Frontend**: React.js
- **Backend**: FastAPI
- **Database**: PostgreSQL

---

## Features

✅ Upload videos securely to server  
✅ View and play uploaded videos in-browser  
✅ Search and filter videos by title or upload date  
✅ Edit video title, description, or file  
✅ Delete videos with confirmation  



<!-- PROJECT STRUCTURE -->
Full-Stack-Video-App-with-FastAPI/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── database.py
│   │   ├── crud.py
│   │   ├── schemas.py
│   │   ├── routers/
│   │   │   └── videos.py
│   ├── videos/                 # Folder to store uploaded videos
│   └── requirements.txt
|	└── .env
│
└── frontend/
    ├── public/
    ├── src/
	|	├── pages
	|	|	|___ HomePage.jsx|
    │   ├── components/
    │   │   ├── UploadVideoForm.jsx
    │   │   ├── VideoList.jsx
    │   │   ├── VideoPlayer.jsx
    │   │   └── EditVideoModal.jsx
    │   ├── App.jsx
    │   ├── api.js
    │   └── main.jsx
    └── package.json
