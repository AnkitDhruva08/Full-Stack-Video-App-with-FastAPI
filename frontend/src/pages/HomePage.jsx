import { useEffect, useState } from "react";
import UploadVideoForm from "../components/UploadVideoForm";
import VideoList from "../components/VideoList";
import VideoPlayer from "../components/VideoPlayer";
import EditVideoModal from "../components/EditVideoModal";
import CachedVideos from "../components/CachedVideos"; // ✅ Add this line
import api from "../api";
import Swal from "sweetalert2";

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [editVideo, setEditVideo] = useState(null);

  const fetchVideos = async (search = "") => {
    try {
      const res = await api.get(`/?search=${search}`);
      setVideos(res.data);
    } catch (err) {
      console.error("Error fetching videos:", err);
      Swal.fire("Error", "Failed to fetch videos.", "error");
    }
  };

  useEffect(() => {
    fetchVideos(searchTerm);
  }, [searchTerm]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this video!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/${id}`);
      await fetchVideos(searchTerm);
      if (selectedVideo?.id === id) setSelectedVideo(null);
      Swal.fire("Deleted!", "The video has been deleted.", "success");
    } catch (err) {
      console.error("Error deleting video:", err);
      Swal.fire("Error", "Failed to delete video.", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🎬 Welcome to Video Manager</h1>

      {/* Upload Form */}
      <UploadVideoForm
        onUpload={() => {
          fetchVideos(searchTerm);
          Swal.fire("Success", "Video uploaded successfully!", "success");
        }}
      />

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mt-6 w-full p-2 border rounded"
      />

      {/* Video List (from server) */}
      <VideoList
        videos={videos}
        onSelect={setSelectedVideo}
        onDelete={handleDelete}
        onEdit={setEditVideo}
      />

      {/* Cached Videos (for offline mode) */}
      <CachedVideos onSelect={setSelectedVideo} />

      {/* Video Playback */}
      {selectedVideo && <VideoPlayer video={selectedVideo} />}

      {/* Edit Modal */}
      {editVideo && (
        <EditVideoModal
          video={editVideo}
          onClose={() => setEditVideo(null)}
          onUpdate={() => {
            fetchVideos(searchTerm);
            setEditVideo(null);
            Swal.fire("Success", "Video updated successfully!", "success");
          }}
        />
      )}
    </div>
  );
};

export default HomePage;
