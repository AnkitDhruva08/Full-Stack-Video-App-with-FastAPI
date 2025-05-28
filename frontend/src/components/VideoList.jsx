import React from "react";

export default function VideoList({ videos, onSelect, onDelete, onEdit }) {
  if (videos.length === 0) return <p className="mt-4">No videos found.</p>;

  return (
    <div className="mt-6 space-y-4">
      {videos.map((video) => (
        <div
          key={video.id}
          className="flex items-center justify-between bg-white p-4 rounded shadow"
        >
          <div
            className="cursor-pointer"
            onClick={() => onSelect(video)}
          >
            <p className="font-semibold">{video.title}</p>
            <p className="text-sm text-gray-500">{new Date(video.upload_date).toLocaleString()}</p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => onEdit(video)}
              className="text-yellow-600 hover:text-yellow-800"
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={() => {
                 onDelete(video.id);
              }}
              className="text-red-600 hover:text-red-800"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
