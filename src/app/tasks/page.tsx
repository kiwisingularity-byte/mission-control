"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";

const statusColumns = [
  { id: "backlog", name: "Backlog", color: "bg-slate-600" },
  { id: "in_progress", name: "In Progress", color: "bg-blue-500" },
  { id: "review", name: "Review", color: "bg-yellow-500" },
  { id: "completed", name: "Completed", color: "bg-green-500" },
];

export default function TasksPage() {
  const tasks = useQuery(api.tasks.list);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showNewTask, setShowNewTask] = useState(false);
  const createTask = useMutation(api.tasks.create);

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;
    await createTask({ title: newTaskTitle, status: "backlog", assignedTo: "singularity" });
    setNewTaskTitle("");
    setShowNewTask(false);
  };

  if (!tasks) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading tasks...</div>
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
              <span className="text-2xl">📋</span>
              <h1 className="text-xl font-bold text-white">Tasks Board</h1>
            </div>
            <button 
              onClick={() => setShowNewTask(!showNewTask)}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + New Task
            </button>
          </div>
          
          {showNewTask && (
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                onKeyDown={(e) => e.key === "Enter" && handleCreateTask()}
              />
              <button 
                onClick={handleCreateTask}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Add
              </button>
            </div>
          )}
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
                    <TaskCard key={task._id} task={task} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function TaskCard({ task }: { task: { 
  _id: Id<"tasks">; 
  title: string; 
  description?: string;
  status: string; 
  assignedTo: string; 
  priority?: string;
} }) {
  const updateTask = useMutation(api.tasks.update);
  const removeTask = useMutation(api.tasks.remove);

  const priorityColors: Record<string, string> = {
    low: "bg-slate-600",
    medium: "bg-yellow-600",
    high: "bg-red-600",
  };

  const handleComplete = async () => {
    await updateTask({ id: task._id, status: "completed" });
  };

  const handleMove = async (newStatus: "backlog" | "in_progress" | "review") => {
    await updateTask({ id: task._id, status: newStatus });
  };

  const handleDelete = async () => {
    if (confirm("Delete this task?")) {
      await removeTask({ id: task._id });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-white text-sm">{task.title}</h4>
        <div className="flex items-center gap-1">
          {task.priority && (
            <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority] || "bg-slate-600"}`} />
          )}
        </div>
      </div>
      
      {task.description && (
        <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
              task.assignedTo === "singularity"
                ? "bg-indigo-600 text-white"
                : "bg-emerald-600 text-white"
            }`}
          >
            {task.assignedTo === "singularity" ? "S" : "C"}
          </div>
          <span className="text-xs text-slate-400 capitalize">{task.assignedTo}</span>
        </div>
        
        <div className="flex items-center gap-1">
          {task.status !== "completed" && (
            <button
              onClick={handleComplete}
              className="text-xs bg-green-600/20 text-green-400 hover:bg-green-600/30 px-2 py-1 rounded transition-colors"
              title="Mark complete"
            >
              ✓
            </button>
          )}
          {task.status === "backlog" && (
            <button
              onClick={() => handleMove("in_progress")}
              className="text-xs bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-2 py-1 rounded transition-colors"
              title="Start task"
            >
              ▶
            </button>
          )}
          {task.status === "in_progress" && (
            <button
              onClick={() => handleMove("review")}
              className="text-xs bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30 px-2 py-1 rounded transition-colors"
              title="Move to review"
            >
              ⏸
            </button>
          )}
          <button
            onClick={handleDelete}
            className="text-xs bg-red-600/20 text-red-400 hover:bg-red-600/30 px-2 py-1 rounded transition-colors"
            title="Delete task"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}