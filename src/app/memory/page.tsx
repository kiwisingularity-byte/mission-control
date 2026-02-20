"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";

const categories = [
  { id: "all", name: "All", icon: "🧠" },
  { id: "decision", name: "Decisions", icon: "✅" },
  { id: "learning", name: "Learnings", icon: "📚" },
  { id: "preference", name: "Preferences", icon: "❤️" },
  { id: "project", name: "Projects", icon: "🚀" },
  { id: "conversation", name: "Conversations", icon: "💬" },
  { id: "reference", name: "References", icon: "📌" },
];

type MemoryItem = Doc<"memories">;

export default function MemoryPage() {
  const memories = useQuery(api.memories.list, { includeArchived: false });
  const archivedMemories = useQuery(api.memories.archived);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Search via query when there's a search term
  const searchResults = useQuery(
    api.memories.search,
    searchQuery.length > 2 ? { query: searchQuery } : "skip"
  );

  // Use search results if searching, otherwise use filtered list
  // Sort by viewCount (most viewed first)
  const activeMemories = showArchived ? archivedMemories : memories;
  const displayMemories = searchQuery.length > 2 
    ? searchResults 
    : activeMemories
        ?.filter(m => !selectedCategory || m.category === selectedCategory)
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));

  if (!memories) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading memories...</div>
      </div>
    );
  }

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
              <span className="text-2xl">🧠</span>
              <h1 className="text-xl font-bold text-white">Memory Bank</h1>
              <span className="text-sm text-slate-500">
                ({memories.length} active, {archivedMemories?.length || 0} archived)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  showArchived
                    ? "bg-slate-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {showArchived ? "📦 Archived" : "Archive"}
              </button>
              <button
                onClick={() => setShowNewModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                + New Memory
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search all memories (including archived)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {searchQuery.length > 2 && searchResults && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                {searchResults.length} results
              </div>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => {
              const count = cat.id === "all" 
                ? (showArchived ? archivedMemories?.length : memories.length) || 0
                : (showArchived ? archivedMemories : memories)?.filter(m => m.category === cat.id).length || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id === "all" ? null : cat.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    (cat.id === "all" && !selectedCategory) || selectedCategory === cat.id
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {cat.icon} {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Info banner */}
          <div className="mt-4 p-3 bg-indigo-900/20 rounded-lg border border-indigo-800/50">
            <p className="text-sm text-indigo-300">
              🔥 <strong>Popularity:</strong> Memories are sorted by how often they're viewed. 
              Most-used items appear first. Click a card to expand and increment its view count.
            </p>
          </div>

          {/* Archive banner */}
          {showArchived && (
            <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-sm text-slate-400">
                📦 Showing archived memories. These are hidden from the main view but still searchable. 
                Click <strong>Unarchive</strong> to restore items to the active list.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Memories List */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {!displayMemories || displayMemories.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-4xl mb-4 block">🧠</span>
            <h3 className="text-xl font-medium text-slate-400 mb-2">
              {showArchived ? "No archived memories" : "No memories found"}
            </h3>
            <p className="text-slate-500">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayMemories.map((memory) => (
              <MemoryCard 
                key={memory._id} 
                memory={memory} 
                expanded={expandedId === memory._id}
                onToggle={() => setExpandedId(expandedId === memory._id ? null : memory._id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* New Memory Modal */}
      {showNewModal && <NewMemoryModal onClose={() => setShowNewModal(false)} />}
    </div>
  );
}

function MemoryCard({ 
  memory, 
  expanded, 
  onToggle 
}: { 
  memory: MemoryItem; 
  expanded: boolean;
  onToggle: () => void;
}) {
  const incrementView = useMutation(api.memories.incrementView);
  const archiveMemory = useMutation(api.memories.archive);
  const unarchiveMemory = useMutation(api.memories.unarchive);

  const categoryColors: Record<string, string> = {
    decision: "bg-green-600",
    learning: "bg-blue-600",
    preference: "bg-pink-600",
    project: "bg-purple-600",
    conversation: "bg-cyan-600",
    reference: "bg-amber-600",
  };

  // Heat indicator based on view count
  const viewCount = memory.viewCount || 0;
  const heatColor = viewCount === 0 ? "text-slate-500" 
    : viewCount < 3 ? "text-slate-400"
    : viewCount < 10 ? "text-amber-400"
    : viewCount < 25 ? "text-orange-400"
    : "text-red-400";

  const handleClick = async () => {
    if (!expanded) {
      // Increment view count when expanding
      await incrementView({ id: memory._id });
    }
    onToggle();
  };

  const handleArchive = async () => {
    await archiveMemory({ id: memory._id });
  };

  const handleUnarchive = async () => {
    await unarchiveMemory({ id: memory._id });
  };

  return (
    <div
      className={`bg-slate-900 border rounded-xl p-5 transition-colors cursor-pointer ${
        memory.archived 
          ? "border-slate-700 opacity-60" 
          : "border-slate-800 hover:border-slate-700"
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${categoryColors[memory.category] || "bg-slate-600"}`} />
          <span className="text-xs text-slate-500 uppercase tracking-wide">{memory.category}</span>
          {memory.archived && (
            <span className="text-xs bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">archived</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* View count / heat indicator */}
          <span className={`text-xs ${heatColor}`} title={`Viewed ${viewCount} times`}>
            🔥 {viewCount}
          </span>
          {memory.reviewedAt && (
            <span className="text-xs text-slate-600" title={`Reviewed ${new Date(memory.reviewedAt).toLocaleDateString('en-NZ')}`}>
              ✓
            </span>
          )}
          <span className="text-xs text-slate-500">
            {new Date(memory.createdAt).toLocaleDateString("en-NZ")}
          </span>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2">{memory.title}</h3>
      
      <p className={`text-sm text-slate-400 ${expanded ? "" : "line-clamp-3"}`}>
        {memory.content}
      </p>
      
      {memory.tags && memory.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {memory.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-slate-800 rounded-full text-xs text-slate-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
          {memory.source && (
            <div className="text-xs text-slate-500">
              📎 Source: {memory.source}
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex gap-2">
            {memory.archived ? (
              <button
                onClick={(e) => { e.stopPropagation(); handleUnarchive(); }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-medium transition-colors"
              >
                ↩️ Unarchive
              </button>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); handleArchive(); }}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-medium transition-colors"
              >
                📦 Archive
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NewMemoryModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"decision" | "learning" | "preference" | "project" | "conversation" | "reference">("reference");
  const [tags, setTags] = useState("");
  const [source, setSource] = useState("");
  const [toArchive, setToArchive] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const createMemory = useMutation(api.memories.create);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    
    await createMemory({
      title,
      content,
      category,
      tags: tags ? tags.split(",").map(t => t.trim().toLowerCase()) : undefined,
      source: source || undefined,
      archived: toArchive,
    });
    
    setSaved(true);
    setTimeout(() => onClose(), 500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">📝 New Memory</h2>
        
        <input
          type="text"
          placeholder="Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mb-4"
        />
        
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as typeof category)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 mb-4"
        >
          {categories.slice(1).map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
        
        <textarea
          placeholder="Content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mb-4 h-32"
        />
        
        <input
          type="text"
          placeholder="Tags (comma separated)..."
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mb-4"
        />

        <input
          type="text"
          placeholder="Source (optional)..."
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mb-4"
        />

        {/* Archive toggle */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <input
            type="checkbox"
            id="toArchive"
            checked={toArchive}
            onChange={(e) => setToArchive(e.target.checked)}
            className="w-4 h-4 rounded bg-slate-700 border-slate-600"
          />
          <label htmlFor="toArchive" className="text-sm text-slate-300">
            📦 Save directly to archive (for reference-only items)
          </label>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || !content.trim()}
            className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saved ? "✓ Saved" : toArchive ? "📦 Save to Archive" : "💾 Save Memory"}
          </button>
        </div>
      </div>
    </div>
  );
}