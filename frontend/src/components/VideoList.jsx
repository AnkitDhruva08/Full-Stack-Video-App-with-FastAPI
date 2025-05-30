import React, { useEffect, useState } from "react";
import { get, set } from "idb-keyval";
import Swal from "sweetalert2";


export default function VideoList({ videos, onSelect, onDelete, onEdit }) {
  const [savedIndexedDB, setSavedIndexedDB] = useState({});
  const [savedCache, setSavedCache] = useState({});

  // Check which videos are saved in IndexedDB
  async function checkIndexedDB(videos) {
    const statuses = {};
    for (const video of videos) {
      try {
        const data = await get(video.filename);
        statuses[video.filename] = !!data;
      } catch (err) {
        console.error(`Error checking IndexedDB for ${video.filename}:`, err);
        statuses[video.filename] = false;
      }
    }
    console.log("IndexedDB statuses:", statuses);
    setSavedIndexedDB(statuses);
  }

  useEffect(() => {
    if (videos?.length) {
      checkIndexedDB(videos);
    }
  }, [videos]);

  // Save video blob and metadata to IndexedDB
  const saveVideoIndexedDB = async (video) => {
    const url = `http://localhost:8000/videos/${video.filename}`;
    try {
      const response = await fetch(url);
      console.log(`Fetching video from ${url}, response status:`, response.status);
      if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
      const blob = await response.blob();
  
     await set(video.filename, {
        filename: video.filename, 
        title: video.title,
        description: video.description,
        id: video.id,
        date: video.upload_date,
        blob,
      });
      
      setSavedIndexedDB((prev) => ({ ...prev, [video.filename]: true }));
  
      Swal.fire({
        icon: "success",
        title: "Saved to IndexedDB!",
        text: `Video "${video.title}" is now available offline.`,
        timer: 2000,
        showConfirmButton: false,
      });
      console.log(`Video "${video.title}" saved to IndexedDB.`);
    } catch (error) {
      console.error("Failed to save video:", error);
      Swal.fire("Error", "Failed to save video. Is the backend running?", "error");
    }
  };
  

  // Cache video file for offline use
  const saveVideoCache = async (video) => {
    if (!("caches" in window)) {
      Swal.fire("Error", "Cache Storage not supported in this browser.", "error");
      console.error("Cache Storage not supported");
      return;
    }

    const url = `http://localhost:8000/videos/${video.filename}`;
    try {
      const cache = await caches.open("video-cache-v1");
      await cache.add(url);
      setSavedCache((prev) => ({ ...prev, [video.filename]: true }));

      Swal.fire({
        icon: "success",
        title: "Cached!",
        text: `Video "${video.title}" cached successfully for offline playback.`,
        timer: 2000,
        showConfirmButton: false,
      });
      console.log(`Video "${video.title}" cached.`);
    } catch (error) {
      console.error("Failed to cache video:", error);
      Swal.fire("Error", "Failed to cache video.", "error");
    }
  };

  // Handle offline save (IndexedDB + Cache)
  const handleSaveOffline = async (video) => {
    console.log(`Starting offline save for video "${video.title}"`);

    if (savedIndexedDB[video.filename] && savedCache[video.filename]  ) {
      Swal.fire("Info", "Video is already saved and cached for offline use.", "info");
      console.log(`Video "${video.title}" already offline.`);
      return;
    }

    if (!savedIndexedDB[video.filename]) {
      await saveVideoIndexedDB(video);
    }

    if (!savedCache[video.filename]) {
      await saveVideoCache(video);
    }

    console.log(`Offline save completed for video "${video.title}"`);
  };

  if (!videos || videos.length === 0) return <p className="mt-4">No videos found.</p>;

  return (
    <div className="mt-6 space-y-4">
      {videos.map((video) => (
        <div
          key={video.id}
          className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
        >
          <div
            className="cursor-pointer flex-1"
            onClick={() => onSelect(video)}
          >
            <p className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              {video.title}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(video.upload_date).toLocaleString()}
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-wrap gap-2 md:ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(video);
              }}
              className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-3 py-1 rounded-md text-sm font-medium"
            >
              ✏️ Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(video.id);
              }}
              className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md text-sm font-medium"
            >
              🗑️ Delete
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSaveOffline(video);
              }}
              className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded-md text-sm font-medium"
            >
              💾 Save Offline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
