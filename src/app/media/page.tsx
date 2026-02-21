"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";

const projects = [
  { id: "singularity-kiwi", name: "Singularity.Kiwi", icon: "🌐" },
  { id: "solar-surf", name: "Solar Surf", icon: "🏄" },
  { id: "sunshine-healing", name: "Sunshine Healing", icon: "☀️" },
  { id: "business", name: "Business", icon: "💼" },
  { id: "personal", name: "Personal", icon: "📸" },
  { id: "uncategorized", name: "Uncategorized", icon: "📁" },
];

type MediaItem = Doc<"media">;

export default function MediaPage() {
  const media = useQuery(api.media.list, {});
  const stats = useQuery(api.media.stats);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<"image" | "video" | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  if (!media || !stats) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading media library...</div>
      </div>
    );
  }

  const filteredMedia = media.filter((m) => {
    if (selectedProject && m.project !== selectedProject) return false;
    if (selectedType && m.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-slate-400 hover:text-white">
                ← Back
              </Link>
              <span className="text-2xl">📷</span>
              <h1 className="text-xl font-bold text-white">Media Library</h1>
            </div>
            <button
              onClick={() => setShowNewModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + Add Media
            </button>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <StatCard label="Total" value={stats.total} icon="📂" />
            <StatCard label="Images" value={stats.images} icon="🖼️" />
            <StatCard label="Videos" value={stats.videos} icon="🎥" />
            <StatCard label="⭐⭐⭐⭐⭐" value={stats.byRating[5]} />
            <StatCard label="Rated" value={stats.rated} icon="✅" />
            <StatCard label="Unrated" value={stats.unrated} icon="⏳" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex gap-4 overflow-x-auto">
            {/* Type Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedType(null)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === null
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => setSelectedType("image")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === "image"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                🖼️ Images
              </button>
              <button
                onClick={() => setSelectedType("video")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === "video"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                🎥 Videos
              </button>
            </div>

            {/* Project Filter */}
            <div className="flex gap-2 border-l border-slate-700 pl-4">
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProject(selectedProject === p.id ? null : p.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedProject === p.id
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {p.icon} {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {filteredMedia.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-xl font-medium text-slate-300 mb-2">No media yet</h3>
            <p className="text-slate-500 mb-6">
              {selectedProject || selectedType
                ? "No media matches your filters"
                : "Add your first media to get started"}
            </p>
            <button
              onClick={() => setShowNewModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              + Add Media
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredMedia.map((item) => (
              <MediaCard
                key={item._id}
                media={item}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showNewModal && <NewMediaModal onClose={() => setShowNewModal(false)} />}
      {selectedItem && (
        <MediaDetailModal
          media={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon?: string }) {
  return (
    <div className="bg-slate-800/50 rounded-lg px-4 py-2">
      <div className="text-xs text-slate-500">{icon ? `${icon} ` : ""}{label}</div>
      <div className="text-xl font-bold text-white">{value}</div>
    </div>
  );
}

// Convert local file path to web URL
function getMediaUrl(localPath: string | undefined): string | null {
  if (!localPath) return null;
  // Convert /Users/singularity/Desktop/Singularity-Media/... to /media/...
  const mediaPath = localPath.replace(/^\/Users\/singularity\/Desktop\/Singularity-Media\//, "/media/");
  return mediaPath;
}

function MediaCard({ media, onClick }: { media: MediaItem; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [moving, setMoving] = useState(false);
  const updateMedia = useMutation(api.media.update);

  // Determine what to show as thumbnail
  const thumbnailSrc = getMediaUrl(media.thumbnailPath) || 
    (media.type === "image" ? getMediaUrl(media.originalPath) : null);

  const handleMove = async (newProject: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMoving(true);
    await updateMedia({ id: media._id, project: newProject });
    setMoving(false);
    setShowMoveMenu(false);
  };

  return (
    <div
      onClick={onClick}
      className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500/30 transition-all cursor-pointer group relative"
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-slate-800 relative">
        {thumbnailSrc && !imgError ? (
          <img
            src={thumbnailSrc}
            alt={media.filename}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            {media.type === "video" ? "🎥" : "🖼️"}
          </div>
        )}
        {/* Play button overlay for videos */}
        {media.type === "video" && thumbnailSrc && !imgError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
              <span className="text-3xl text-slate-900 ml-1">▶</span>
            </div>
          </div>
        )}
        {/* Rating Badge */}
        {media.rating && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 text-sm font-medium text-yellow-400">
            {"⭐".repeat(media.rating)}
          </div>
        )}
        {/* Type Badge */}
        <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm rounded px-2 py-0.5 text-xs text-slate-300">
          {media.type}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h4 className="font-medium text-white text-sm truncate group-hover:text-indigo-300 transition-colors">
          {media.filename}
        </h4>
        {media.description && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            {media.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-2 text-xs">
          {/* Move Button */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMoveMenu(!showMoveMenu);
              }}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
              title="Move to project"
            >
              <span className="capitalize">{media.project?.replace("-", " ")}</span>
              <span className="text-[10px]">▼</span>
            </button>
            
            {showMoveMenu && (
              <div 
                className="absolute bottom-full left-0 mb-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 min-w-[140px] py-1"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-xs text-slate-500 px-3 py-1 border-b border-slate-700 mb-1">Move to...</div>
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={(e) => handleMove(p.id, e)}
                    disabled={moving || p.id === media.project}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center gap-2 ${
                      p.id === media.project 
                        ? "text-indigo-400 bg-indigo-500/10" 
                        : "text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <span>{p.icon}</span>
                    <span>{p.name}</span>
                    {p.id === media.project && <span className="ml-auto">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MediaDetailModal({
  media,
  onClose,
}: {
  media: MediaItem;
  onClose: () => void;
}) {
  const [filename, setFilename] = useState(media.filename);
  const [description, setDescription] = useState(media.description ?? "");
  const [project, setProject] = useState(media.project ?? "uncategorized");
  const [rating, setRating] = useState(media.rating ?? 3);
  const [tags, setTags] = useState(media.tags?.join(", ") ?? "");
  const [saved, setSaved] = useState(false);

  const updateMedia = useMutation(api.media.update);
  const deleteMedia = useMutation(api.media.remove);

  const handleSave = async () => {
    await updateMedia({
      id: media._id,
      filename,
      description: description || undefined,
      project,
      rating,
      tags: tags ? tags.split(",").map((t) => t.trim()) : undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = async () => {
    if (confirm("Delete this media entry? The file will remain on disk.")) {
      await deleteMedia({ id: media._id });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{media.type === "video" ? "🎥" : "🖼️"}</span>
            <h2 className="text-lg font-bold text-white">{media.filename}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Preview */}
        <div className="bg-slate-800 aspect-video flex items-center justify-center relative">
          {media.type === "video" ? (
            <video
              src={getMediaUrl(media.originalPath) || undefined}
              controls
              className="w-full h-full object-contain"
              poster={getMediaUrl(media.thumbnailPath) || undefined}
            >
              Your browser does not support video playback.
            </video>
          ) : (
            <img
              src={getMediaUrl(media.originalPath) || undefined}
              alt={media.filename}
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Filename */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Filename</label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-transform ${
                    star <= rating ? "text-yellow-400 scale-110" : "text-slate-600"
                  }`}
                >
                  ⭐
                </button>
              ))}
              <span className="text-slate-400 text-sm ml-2 self-center">
                {rating}/5 stars
              </span>
            </div>
          </div>

          {/* Project */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Project</label>
            <div className="flex flex-wrap gap-2">
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProject(p.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    project === p.id
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {p.icon} {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="AI-generated description from vision model..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 h-24"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="surfboard, workshop, repair"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Path */}
          <div className="text-xs text-slate-500 pt-4 border-t border-slate-800">
            <div className="truncate">
              <span className="text-slate-400">Path:</span> {media.originalPath}
            </div>
            <div className="mt-1">
              <span className="text-slate-400">Created:</span>{" "}
              {new Date(media.createdAt).toLocaleDateString("en-NZ")}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            🗑️ Delete
          </button>
          <div className="flex gap-3">
            {saved && <span className="text-green-400 text-sm">✓ Saved</span>}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewMediaModal({ onClose }: { onClose: () => void }) {
  const [filename, setFilename] = useState("");
  const [type, setType] = useState<"image" | "video">("image");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState<string>("uncategorized");
  const [rating, setRating] = useState(3);
  const [path, setPath] = useState("");

  const createMedia = useMutation(api.media.create);

  const handleCreate = async () => {
    if (!filename.trim() || !path.trim()) return;
    await createMedia({
      filename,
      type,
      originalPath: path,
      description: description || undefined,
      project,
      rating,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Media</h2>

        <div className="space-y-4">
          {/* Type */}
          <div className="flex gap-2">
            <button
              onClick={() => setType("image")}
              className={`flex-1 py-3 rounded-lg border transition-colors ${
                type === "image"
                  ? "bg-indigo-600 border-indigo-500"
                  : "bg-slate-800 border-slate-700 hover:bg-slate-700"
              }`}
            >
              <span className="text-2xl">🖼️</span>
              <div className="text-sm mt-1">Image</div>
            </button>
            <button
              onClick={() => setType("video")}
              className={`flex-1 py-3 rounded-lg border transition-colors ${
                type === "video"
                  ? "bg-indigo-600 border-indigo-500"
                  : "bg-slate-800 border-slate-700 hover:bg-slate-700"
              }`}
            >
              <span className="text-2xl">🎥</span>
              <div className="text-sm mt-1">Video</div>
            </button>
          </div>

          {/* Filename */}
          <input
            type="text"
            placeholder="Filename..."
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          {/* Path */}
          <input
            type="text"
            placeholder="Full path to file..."
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          {/* Rating */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-slate-600"}`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          {/* Project */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Project</label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.icon} {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <textarea
            placeholder="Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 h-20"
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            Add Media
          </button>
        </div>
      </div>
    </div>
  );
}