import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { get } from "idb-keyval"; // ✅ Import the get function to access IndexedDB

export default function CachedVideos({ onSelect }) {
  const [cachedVideos, setCachedVideos] = useState([]);

  useEffect(() => {
    fetchCachedVideos();
  }, []);

  const fetchCachedVideos = async () => {
    if (!("caches" in window)) {
      setCachedVideos([]);
      return;
    }

    const cache = await caches.open("video-cache-v1");
    const requests = await cache.keys();

    const videos = await Promise.all(
      requests.map(async (req) => {
        const url = new URL(req.url);
        const filename = url.pathname.split("/").pop();

        // 🔍 Try to get title from IndexedDB
        let title = filename;
        try {
          const meta = await get(filename);
          if (meta?.title) title = meta.title;
        } catch (err) {
          console.warn(`No metadata found for ${filename}`);
        }

        return {
          filename,
          url: req.url,
          title,
        };
      })
    );

    setCachedVideos(videos);
  };

  const handleRemoveFromCache = async (filename, url) => {
    const confirm = await Swal.fire({
      title: "Remove Cached Video?",
      text: `Are you sure you want to remove "${filename}" from cache?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const cache = await caches.open("video-cache-v1");
      await cache.delete(url);

      setCachedVideos((prev) => prev.filter((vid) => vid.url !== url));

      Swal.fire({
        icon: "success",
        title: "Removed!",
        text: `"${filename}" has been removed from cache.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to remove from cache:", error);
      Swal.fire("Error", "Failed to remove video from cache.", "error");
    }
  };

  if (cachedVideos.length === 0) {
    return (
      <p className="mt-6 text-gray-500 italic text-center">
        No cached videos found.
      </p>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        📦 Cached Videos{" "}
        <span className="text-sm text-gray-500">(Offline Storage)</span>
      </h2>
      <div className="space-y-4">
        {cachedVideos.map((video) => (
          <div
            key={video.filename}
            className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md"
          >
            <div
              className="cursor-pointer"
              onClick={() =>
                onSelect({
                  filename: video.filename,
                  url: video.url,
                  title: video.title,
                })
              }
            >
              <p className="font-semibold text-gray-800">{video.title}</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={video.url}
                download={video.filename}
                className="text-blue-600 hover:underline text-sm"
                title="Download"
              >
                ⬇ Download
              </a>
              <button
                onClick={() => handleRemoveFromCache(video.filename, video.url)}
                className="text-red-600 hover:text-red-800 text-sm"
                title="Remove from Cache"
              >
                🗑 Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
