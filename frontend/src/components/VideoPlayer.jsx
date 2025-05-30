import React from "react";

export default function VideoPlayer({ video }) {
  if (!video) return null;

  const videoSrc = video.url || `http://localhost:8000/videos/${video.filename}`;
  

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
      <video
        controls
        preload="metadata"
        className="w-full max-h-[400px] rounded"
        src={videoSrc}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
