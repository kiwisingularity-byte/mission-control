"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";

const stages = [
  { id: "idea", name: "Ideas", icon: "💡" },
  { id: "scripting", name: "Scripting", icon: "✍️" },
  { id: "thumbnail", name: "Thumbnail", icon: "🖼️" },
  { id: "production", name: "Production", icon: "🎬" },
  { id: "review", name: "Review", icon: "👀" },
  { id: "scheduled", name: "Scheduled", icon: "📅" },
  { id: "published", name: "Published", icon: "🚀" },
];

const contentTypes = [
  { id: "article", name: "Article", icon: "📝" },
  { id: "video", name: "Video", icon: "🎥" },
  { id: "podcast", name: "Podcast", icon: "🎙️" },
  { id: "social_post", name: "Social Post", icon: "💬" },
  { id: "newsletter", name: "Newsletter", icon: "📧" },
];

const projectInfo: Record<string, { name: string; icon: string; color: string; isUnclassified?: boolean }> = {
  "unclassified": { name: "Unclassified", icon: "📥", color: "from-red-500 to-orange-500", isUnclassified: true },
  "singularity-kiwi": { name: "Singularity Kiwi", icon: "🌌", color: "from-indigo-500 to-purple-600" },
  "solar-surf": { name: "Solar Surf", icon: "☀️", color: "from-yellow-500 to-orange-500" },
  "sunshine-healing": { name: "Sunshine Healing", icon: "🌞", color: "from-amber-400 to-yellow-500" },
  "sass": { name: "SASS", icon: "⚡", color: "from-cyan-500 to-blue-500" },
  "business": { name: "Business", icon: "💼", color: "from-slate-500 to-slate-600" },
  "personal": { name: "Personal", icon: "🏠", color: "from-green-500 to-emerald-500" },
  "uncategorized": { name: "Uncategorized", icon: "📦", color: "from-gray-500 to-gray-600" },
};

const allProjects = [
  { id: "singularity-kiwi", name: "Singularity Kiwi", icon: "🌌" },
  { id: "solar-surf", name: "Solar Surf", icon: "☀️" },
  { id: "sunshine-healing", name: "Sunshine Healing", icon: "🌞" },
  { id: "sass", name: "SASS", icon: "⚡" },
  { id: "business", name: "Business", icon: "💼" },
  { id: "personal", name: "Personal", icon: "🏠" },
  { id: "uncategorized", name: "Uncategorized", icon: "📦" },
];

type ContentItem = Doc<"content">;

export default function ProjectContentPage() {
  const params = useParams();
  const projectId = params.project as string;
  const searchParams = useSearchParams();
  const stageParam = searchParams.get("stage");
  
  const project = projectInfo[projectId] || { name: projectId, icon: "📄", color: "from-slate-500 to-slate-600" };
  const isUnclassified = projectId === "unclassified";
  
  const allContent = useQuery(api.content.list);
  // Filter: unclassified shows items with no project, otherwise filter by project
  const content = isUnclassified 
    ? (allContent?.filter((c) => !c.project) ?? [])
    : (allContent?.filter((c) => c.project === projectId) ?? []);
  
  const [selectedStage, setSelectedStage] = useState<string | null>(stageParam);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  useEffect(() => {
    if (stageParam) {
      setSelectedStage(stageParam);
    }
  }, [stageParam]);

  if (!allContent) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading content...</div>
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
              <Link href="/content" className="text-slate-400 hover:text-white">
                ← All Businesses
              </Link>
              <span className="text-2xl">{project.icon}</span>
              <h1 className="text-xl font-bold text-white">{project.name}</h1>
              <span className="text-sm text-slate-500">({content.length} items)</span>
            </div>
            <button
              onClick={() => setShowNewModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + New Content
            </button>
          </div>
        </div>
      </header>

      {/* Stage Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-3">
            <button
              onClick={() => setSelectedStage(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                selectedStage === null
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              All Stages ({content.length})
            </button>
            {stages.map((stage) => {
              const count = content.filter((c) => c.status === stage.id).length;
              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStage(stage.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedStage === stage.id
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {stage.icon} {stage.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {content.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">{project.icon}</span>
            <h3 className="text-xl font-medium text-slate-300 mb-2">No content yet</h3>
            <p className="text-slate-500 mb-6">Start adding content ideas for {project.name}</p>
            <button
              onClick={() => setShowNewModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              + Add Your First Idea
            </button>
          </div>
        ) : selectedStage === null ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {stages.map((stage) => {
              const stageContent = content.filter((c) => c.status === stage.id);
              return (
                <div key={stage.id} className="space-y-3">
                  <div className="flex items-center gap-2 px-2">
                    <span className="text-xl">{stage.icon}</span>
                    <h3 className="font-medium text-slate-300">{stage.name}</h3>
                    <span className="text-xs text-slate-500">({stageContent.length})</span>
                  </div>
                  <div className="space-y-2">
                    {stageContent.map((item) => (
                      <ContentCard 
                        key={item._id} 
                        content={item} 
                        onClick={() => setSelectedItem(item)}
                        showProjectDropdown={isUnclassified}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {content
              .filter((c) => c.status === selectedStage)
              .map((item) => (
                <ContentCard 
                  key={item._id} 
                  content={item} 
                  detailed
                  onClick={() => setSelectedItem(item)}
                  showProjectDropdown={isUnclassified}
                />
              ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showNewModal && (
        <NewContentModal 
          projectId={projectId} 
          onClose={() => setShowNewModal(false)} 
        />
      )}
      {selectedItem && (
        <ContentDetailModal 
          content={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
}

function ContentCard({
  content,
  detailed,
  onClick,
  showProjectDropdown,
}: {
  content: ContentItem;
  detailed?: boolean;
  onClick: () => void;
  showProjectDropdown?: boolean;
}) {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const updateContent = useMutation(api.content.update);

  const handleProjectChange = async (newProject: string) => {
    if (!newProject) return;
    setSelectedProject(newProject);
    await updateContent({
      id: content._id,
      project: newProject as "singularity-kiwi" | "solar-surf" | "sunshine-healing" | "sass" | "business" | "personal" | "uncategorized",
    });
  };

  const typeIcons: Record<string, string> = {
    article: "📝",
    video: "🎥",
    podcast: "🎙️",
    social_post: "💬",
    newsletter: "📧",
  };

  return (
    <div 
      className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-indigo-500 hover:bg-slate-800/50 transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-2 mb-2" onClick={onClick}>
        <span className="text-lg">{typeIcons[content.type] || "📄"}</span>
        <h4 className="font-medium text-white flex-1 group-hover:text-indigo-300 transition-colors">
          {content.title}
        </h4>
      </div>
      {(content.content || content.notes) && (
        <p className="text-sm text-slate-400 mt-2 line-clamp-2" onClick={onClick}>
          {content.notes || content.content}
        </p>
      )}
      <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
        <span className="capitalize">{content.type.replace("_", " ")}</span>
        {!showProjectDropdown && (
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">Click to edit →</span>
        )}
      </div>
      {showProjectDropdown && (
        <div className="mt-3 pt-3 border-t border-slate-800" onClick={(e) => e.stopPropagation()}>
          <label className="block text-xs text-slate-400 mb-1">Assign to:</label>
          <select
            value={selectedProject}
            onChange={(e) => handleProjectChange(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">Select project...</option>
            {allProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.icon} {p.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

function ContentDetailModal({
  content,
  onClose,
}: {
  content: ContentItem;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(content.title);
  const [status, setStatus] = useState(content.status);
  const [contentText, setContentText] = useState(content.content ?? "");
  const [notes, setNotes] = useState(content.notes ?? "");
  const [saved, setSaved] = useState(false);
  
  const updateContent = useMutation(api.content.update);
  const deleteContent = useMutation(api.content.remove);

  const handleSave = async () => {
    await updateContent({
      id: content._id,
      title,
      status,
      content: contentText || undefined,
      notes: notes || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = async () => {
    if (confirm("Delete this content? This cannot be undone.")) {
      await deleteContent({ id: content._id });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-5xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="shrink-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {contentTypes.find(t => t.id === content.type)?.icon || "📄"}
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-bold text-white bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1 -ml-2"
            />
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl px-2"
          >
            ✕
          </button>
        </div>

        {/* Body - Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            {/* Main Content - Takes up 3/4 of the space */}
            <div className="lg:col-span-3 flex flex-col">
              <label className="block text-sm text-slate-400 mb-2">Content</label>
              <textarea
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                placeholder="Main content text..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none min-h-[400px] text-base leading-relaxed"
              />
            </div>

            {/* Sidebar - Status & Notes */}
            <div className="space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Status</label>
                <div className="flex flex-wrap gap-1">
                  {stages.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStatus(s.id as typeof status)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        status === s.id
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {s.icon} {s.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Private notes..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 h-32 text-sm"
                />
              </div>

              {/* Meta */}
              <div className="text-xs text-slate-500 pt-4 border-t border-slate-800 space-y-1">
                <p>Created: {new Date(content.createdAt).toLocaleDateString('en-NZ')}</p>
                <p>Updated: {new Date(content.updatedAt).toLocaleDateString('en-NZ')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 bg-slate-900 border-t border-slate-800 px-6 py-4 flex items-center justify-between">
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
              className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewContentModal({ projectId, onClose }: { projectId: string; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"article" | "video" | "podcast" | "social_post" | "newsletter">("article");
  const [notes, setNotes] = useState("");
  const createContent = useMutation(api.content.create);

  const handleCreate = async () => {
    if (!title.trim()) return;
    await createContent({ 
      title, 
      type, 
      notes,
      project: projectId as "singularity-kiwi" | "solar-surf" | "sunshine-healing" | "sass" | "business" | "personal" | "uncategorized"
    });
    onClose();
  };

  const project = projectInfo[projectId] || { name: projectId, icon: "📄" };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">{project.icon}</span>
          <h2 className="text-xl font-bold">New Content for {project.name}</h2>
        </div>
        <input
          type="text"
          placeholder="Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mb-4"
        />
        <div className="grid grid-cols-5 gap-2 mb-4">
          {contentTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id as typeof type)}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors ${
                type === t.id
                  ? "bg-indigo-600 border-indigo-500"
                  : "bg-slate-800 hover:bg-slate-700 border-slate-700"
              }`}
            >
              <span className="text-xl">{t.icon}</span>
              <span className="text-xs text-slate-400">{t.name}</span>
            </button>
          ))}
        </div>
        <textarea
          placeholder="Notes or quick description..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mb-4 h-24"
        />
        <div className="flex gap-3">
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
            Create
          </button>
        </div>
      </div>
    </div>
  );
}