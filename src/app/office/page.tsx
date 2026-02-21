"use client";

import { useState } from "react";
import Link from "next/link";

// Placeholder team data for office view
const placeholderTeam = [
  {
    _id: "1",
    name: "Singularity",
    role: "Coordinator",
    status: "working",
    currentTask: "Building Mission Control",
    avatarEmoji: "🌌",
    deskPosition: { x: 50, y: 40 },
  },
  {
    _id: "2",
    name: "Office Manager",
    role: "Operations",
    status: "idle",
    currentTask: "Next check: 2:22 AM",
    avatarEmoji: "📋",
    deskPosition: { x: 15, y: 35 },
    isManager: true,
  },
  {
    _id: "3",
    name: "Qwen-Coder",
    role: "Coder",
    status: "idle",
    currentTask: null,
    avatarEmoji: "💻",
    deskPosition: { x: 25, y: 65 },
  },
  {
    _id: "4",
    name: "Llama-Writer",
    role: "Writer",
    status: "idle",
    currentTask: null,
    avatarEmoji: "✍️",
    deskPosition: { x: 75, y: 65 },
  },
  {
    _id: "5",
    name: "Phi-Quick",
    role: "Researcher",
    status: "idle",
    currentTask: null,
    avatarEmoji: "🔍",
    deskPosition: { x: 85, y: 35 },
  },
];

export default function OfficePage() {
  const [team] = useState(placeholderTeam);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const workingCount = team.filter((m) => m.status === "working").length;
  const idleCount = team.filter((m) => m.status === "idle").length;

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
              <span className="text-2xl">🏢</span>
              <h1 className="text-xl font-bold text-white">Office</h1>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-slate-400">{workingCount} Working</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-500" />
                <span className="text-slate-400">{idleCount} Idle</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Office View */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Floor Plan */}
        <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden" style={{ minHeight: "600px" }}>
          {/* Office Background */}
          <div className="absolute inset-0 opacity-20">
            {/* Floor tiles pattern */}
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)",
                backgroundSize: "50px 50px",
              }}
            />
          </div>

          {/* Office Elements */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2">
            <div className="bg-slate-800/80 px-6 py-2 rounded-lg border border-slate-700">
              <span className="text-lg">🏢 Mission Control HQ</span>
            </div>
          </div>

          {/* Manager's Office */}
          <div className="absolute bottom-32 left-8 bg-indigo-900/40 border border-indigo-700/50 rounded-xl p-4 w-36 h-28 flex flex-col items-center justify-center">
            <span className="text-2xl mb-1">📋</span>
            <span className="text-xs text-indigo-300 text-center">Manager's Office</span>
            <span className="text-[10px] text-indigo-400 mt-1">Every 6 hours</span>
          </div>

          {/* Meeting Room */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-800/40 border border-slate-700 rounded-xl p-4 w-32 h-24 flex flex-col items-center justify-center">
            <span className="text-2xl mb-1">🚪</span>
            <span className="text-xs text-slate-400">Meeting Room</span>
          </div>

          {/* Coffee Corner */}
          <div className="absolute top-16 right-8 bg-slate-800/40 border border-slate-700 rounded-xl p-4 w-32 h-24 flex flex-col items-center justify-center">
            <span className="text-2xl mb-1">☕</span>
            <span className="text-xs text-slate-400">Coffee Corner</span>
          </div>

          {/* Team Member Desks */}
          {team.map((member) => (
            <DeskArea
              key={member._id}
              member={member as unknown as Record<string, unknown>}
              isSelected={selectedMember === member._id}
              onClick={() => setSelectedMember(selectedMember === member._id ? null : member._id)}
            />
          ))}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-2 font-medium">Status</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-slate-400">Working</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-xs text-slate-400">Awaiting Input</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-500" />
                <span className="text-xs text-slate-400">Idle</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{team.length}</p>
            <p className="text-sm text-slate-400">Team Size</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{workingCount}</p>
            <p className="text-sm text-slate-400">Active</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">
              {team.filter((m) => m.status === "awaiting_input").length}
            </p>
            <p className="text-sm text-slate-400">Waiting</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-indigo-400">
              {Math.round((workingCount / team.length) * 100)}%
            </p>
            <p className="text-sm text-slate-400">Utilization</p>
          </div>
        </div>
      </main>
    </div>
  );
}

function DeskArea({
  member,
  isSelected,
  onClick,
}: {
  member: Record<string, unknown>;
  isSelected: boolean;
  onClick: () => void;
}) {
  const status = member.status as string;
  const position = member.deskPosition as { x: number; y: number };
  
  const statusGlow = {
    working: "shadow-green-500/50",
    idle: "shadow-slate-500/30",
    awaiting_input: "shadow-yellow-500/50",
  };

  const statusBg = {
    working: "bg-green-500/20 border-green-500/50",
    idle: "bg-slate-800/80 border-slate-700",
    awaiting_input: "bg-yellow-500/20 border-yellow-500/50",
  };

  return (
    <div
      className={`absolute cursor-pointer transition-all duration-300 ${
        isSelected ? "z-20 scale-110" : "z-10"
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={onClick}
    >
      {/* Desk */}
      <div
        className={`relative rounded-2xl border-2 p-4 transition-all ${
          isSelected ? "border-indigo-500 bg-indigo-500/20" : statusBg[status as keyof typeof statusBg] || statusBg.idle
        }`}
      >
        {/* Monitor glow when working */}
        {status === "working" && (
          <div className="absolute inset-0 rounded-2xl animate-pulse">
            <div
              className={`absolute inset-0 rounded-2xl ${statusGlow.working} shadow-lg`}
            />
          </div>
        )}

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="text-4xl mb-2">{member.avatarEmoji as string}</div>
          <p className="text-sm font-medium text-white text-center">
            {member.name as string}
          </p>
          <p className="text-xs text-slate-400">{member.role as string}</p>
        </div>

        {/* Current Task */}
        {member.currentTask !== undefined && member.currentTask !== null && (
          <div className="mt-3 bg-slate-900/80 rounded-lg p-2">
            <p className="text-xs text-slate-400 text-center truncate max-w-32">
              🖥️ {member.currentTask as string}
            </p>
          </div>
        )}

        {/* Computer icon */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
          <div
            className={`w-8 h-5 rounded border ${
              status === "working" ? "bg-green-500/30 border-green-500" : "bg-slate-700 border-slate-600"
            }`}
          />
        </div>
      </div>
    </div>
  );
}