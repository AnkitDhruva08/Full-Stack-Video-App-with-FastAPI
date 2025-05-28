import React from "react";

export default function VideoPlayer({ video }) {
  if (!video) return null;

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
      <video
        controls
        className="w-full max-h-[400px] rounded"
        src={`http://localhost:8000/videos/${video.filename}`}
      >
        Your browser does not support the video tag.
      </video>
      {video.description && <p className="mt-2 text-gray-700">{video.description}</p>}
    </div>
  );
}
