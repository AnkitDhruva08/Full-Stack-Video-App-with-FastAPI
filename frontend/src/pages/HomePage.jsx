import { useEffect, useState } from "react";
import UploadVideoForm from "../components/UploadVideoForm";
import VideoList from "../components/VideoList";
import VideoPlayer from "../components/VideoPlayer";
import EditVideoModal from "../components/EditVideoModal";
import api from "../api";

const HomePage = () => {
  // State to store all videos fetched from the backend
  const [videos, setVideos] = useState([]);

  // Search term for filtering videos
  const [searchTerm, setSearchTerm] = useState("");

  // Currently selected video for playback
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Video selected for editing in modal
  const [editVideo, setEditVideo] = useState(null);

  // Fetch videos from backend (with optional search query)
  const fetchVideos = async (search = "") => {
    try {
      const res = await api.get(`/?search=${search}`);
      setVideos(res.data);
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  // Fetch all videos on initial load and when search term changes
  useEffect(() => {
    fetchVideos(searchTerm);
  }, [searchTerm]);

  // Handle video deletion
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      await api.delete(`/${id}`);
      fetchVideos(searchTerm); // Refresh list
      if (selectedVideo?.id === id) setSelectedVideo(null); // Deselect if deleted
    } catch (err) {
      console.error("Error deleting video:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🎬 Welcome to Video Manager</h1>

      {/* Upload Form */}
      <UploadVideoForm onUpload={fetchVideos} />

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mt-6 w-full p-2 border rounded"
      />

      {/* Video List */}
      <VideoList
        videos={videos}
        onSelect={setSelectedVideo}
        onDelete={handleDelete}
        onEdit={setEditVideo}
      />

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
          }}
        />
      )}
    </div>
  );
};

export default HomePage;
