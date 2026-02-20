"use client";

import { useState } from "react";
import Link from "next/link";

const roles = [
  { id: "coordinator", name: "Coordinator", icon: "🌌", description: "Main AI - thinking, planning, conversations" },
  { id: "writer", name: "Writer", icon: "✍️", description: "Blog posts, articles, scripts" },
  { id: "coder", name: "Coder", icon: "💻", description: "Code, CSS, HTML, debugging" },
  { id: "designer", name: "Designer", icon: "🎨", description: "Visual assets, thumbnails, layouts" },
  { id: "researcher", name: "Researcher", icon: "🔍", description: "Information gathering, fact-checking" },
  { id: "editor", name: "Editor", icon: "📝", description: "Review, refine, polish content" },
];

const statusColors = {
  idle: "bg-slate-500",
  working: "bg-green-500",
  awaiting_input: "bg-yellow-500",
};

// Placeholder team data
const placeholderTeam = [
  {
    _id: "1",
    name: "Singularity",
    role: "coordinator",
    description: "Primary AI assistant coordinating all work",
    status: "working",
    currentTask: "Building Mission Control",
    modelId: "glm-5:cloud",
  },
  {
    _id: "2",
    name: "Qwen-Coder",
    role: "coder",
    description: "Code generation and debugging",
    status: "idle",
    modelId: "qwen2.5:7b",
  },
  {
    _id: "3",
    name: "Llama-Writer",
    role: "writer",
    description: "Blog posts and article writing",
    status: "idle",
    modelId: "llama3.2:3b",
  },
  {
    _id: "4",
    name: "Phi-Quick",
    role: "researcher",
    description: "Fast information gathering",
    status: "idle",
    modelId: "phi4-mini",
  },
];

export default function TeamPage() {
  const [team] = useState(placeholderTeam);
  const [showNewModal, setShowNewModal] = useState(false);

  const getRoleInfo = (roleId: string) => {
    return roles.find((r) => r.id === roleId) || roles[0];
  };

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
              <span className="text-2xl">👥</span>
              <h1 className="text-xl font-bold text-white">Team</h1>
            </div>
            <button
              onClick={() => setShowNewModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + Add Team Member
            </button>
          </div>
        </div>
      </header>

      {/* Team Stats */}
      <div className="border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{team.length}</p>
              <p className="text-sm text-slate-400">Team Members</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">
                {team.filter((m) => m.status === "working").length}
              </p>
              <p className="text-sm text-slate-400">Working</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">
                {team.filter((m) => m.status === "awaiting_input").length}
              </p>
              <p className="text-sm text-slate-400">Awaiting Input</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => {
            const roleInfo = getRoleInfo(member.role);
            return (
              <div
                key={member._id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
              >
                {/* Avatar & Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl">
                        {roleInfo.icon}
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                          statusColors[member.status as keyof typeof statusColors]
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{member.name}</h3>
                      <p className="text-sm text-slate-400">{roleInfo.name}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-400 mb-4">
                  {member.description}
                </p>

                {/* Current Task */}
                {member.currentTask && (
                  <div className="bg-slate-800/50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-slate-500 mb-1">Current Task</p>
                    <p className="text-sm text-white">{member.currentTask}</p>
                  </div>
                )}

                {/* Model */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Model</span>
                  <code className="bg-slate-800 px-2 py-1 rounded text-indigo-400">
                    {member.modelId}
                  </code>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* New Team Member Modal */}
      {showNewModal && (
        <NewMemberModal onClose={() => setShowNewModal(false)} />
      )}
    </div>
  );
}

function NewMemberModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("coder");
  const [description, setDescription] = useState("");
  const [modelId, setModelId] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Team Member</h2>
        
        <input
          type="text"
          placeholder="Name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mb-4"
        />
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={`flex items-center gap-2 p-3 rounded-lg border transition-colors text-left ${
                role === r.id
                  ? "border-indigo-500 bg-indigo-600/20"
                  : "border-slate-700 bg-slate-800 hover:bg-slate-700"
              }`}
            >
              <span className="text-lg">{r.icon}</span>
              <span className="text-sm text-white">{r.name}</span>
            </button>
          ))}
        </div>
        
        <textarea
          placeholder="Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mb-4 h-20"
        />
        
        <input
          type="text"
          placeholder="Model ID (e.g., glm-5:cloud, phi4-mini)..."
          value={modelId}
          onChange={(e) => setModelId(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mb-4"
        />
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            Add Member
          </button>
        </div>
      </div>
    </div>
  );
}