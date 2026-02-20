"use client";

import { useState } from "react";
import Link from "next/link";

const statusColumns = [
  { id: "backlog", name: "Backlog", color: "bg-slate-600" },
  { id: "in_progress", name: "In Progress", color: "bg-blue-500" },
  { id: "review", name: "Review", color: "bg-yellow-500" },
  { id: "completed", name: "Completed", color: "bg-green-500" },
];

// Placeholder data - will be replaced with Convex live data
const placeholderTasks = [
  { _id: "1", title: "Fix memory embedding API", status: "backlog", assignedTo: "singularity", priority: "high" },
  { _id: "2", title: "Finish WordPress body image sizing", status: "backlog", assignedTo: "singularity", priority: "medium" },
  { _id: "3", title: "Install BlueBubbles for full iMessage features", status: "backlog", assignedTo: "cj", priority: "low" },
];

export default function TasksPage() {
  const [tasks] = useState(placeholderTasks);

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
              <span className="text-2xl">📋</span>
              <h1 className="text-xl font-bold text-white">Tasks Board</h1>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              + New Task
            </button>
          </div>
        </div>
      </header>

      {/* Board */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statusColumns.map((column) => (
            <div key={column.id} className="space-y-3">
              <div className="flex items-center justify-between px-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`} />
                  <h3 className="font-medium text-slate-300">{column.name}</h3>
                </div>
                <span className="text-sm text-slate-500">
                  {tasks.filter((t) => t.status === column.id).length}
                </span>
              </div>
              <div className="space-y-2">
                {tasks
                  .filter((t) => t.status === column.id)
                  .map((task) => (
                    <TaskCard key={task._id} task={task as unknown as Record<string, unknown>} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function TaskCard({ task }: { task: Record<string, unknown> }) {
  const priorityColors = {
    low: "bg-slate-600",
    medium: "bg-yellow-600",
    high: "bg-red-600",
  };

  const priority = task.priority as keyof typeof priorityColors;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-white">{task.title as string}</h4>
        {priority && (
          <div className={`w-2 h-2 rounded-full ${priorityColors[priority] || "bg-slate-600"}`} />
        )}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
            task.assignedTo === "singularity"
              ? "bg-indigo-600 text-white"
              : "bg-emerald-600 text-white"
          }`}
        >
          {task.assignedTo === "singularity" ? "S" : "C"}
        </div>
        <span className="text-xs text-slate-400 capitalize">
          {task.assignedTo as string}
        </span>
      </div>
    </div>
  );
}