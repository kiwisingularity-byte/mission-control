"use client";

import { useState } from "react";
import Link from "next/link";

const eventTypes = [
  { id: "task", name: "Task", icon: "📋", color: "bg-blue-500" },
  { id: "cron", name: "Cron Job", icon: "⚡", color: "bg-purple-500" },
  { id: "reminder", name: "Reminder", icon: "⏰", color: "bg-yellow-500" },
  { id: "deadline", name: "Deadline", icon: "🎯", color: "bg-red-500" },
  { id: "meeting", name: "Meeting", icon: "👥", color: "bg-green-500" },
];

// Placeholder data
const placeholderEvents = [
  {
    _id: "1",
    title: "Mission Control v1 Launch",
    type: "deadline",
    scheduledFor: Date.now() + 86400000, // tomorrow
    completed: false,
  },
  {
    _id: "2",
    title: "Daily content pipeline check",
    type: "cron",
    scheduledFor: Date.now() + 3600000, // 1 hour from now
    completed: false,
  },
  {
    _id: "3",
    title: "WordPress body image sizing",
    type: "task",
    scheduledFor: Date.now() + 172800000, // 2 days
    completed: false,
  },
];

export default function CalendarPage() {
  const [events] = useState(placeholderEvents);
  const [view, setView] = useState<"upcoming" | "all">("upcoming");
  const [showNewModal, setShowNewModal] = useState(false);

  const upcomingEvents = events
    .filter((e) => !e.completed)
    .sort((a, b) => a.scheduledFor - b.scheduledFor);

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
              <span className="text-2xl">📅</span>
              <h1 className="text-xl font-bold text-white">Calendar</h1>
            </div>
            <button
              onClick={() => setShowNewModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + Schedule Event
            </button>
          </div>
        </div>
      </header>

      {/* View Toggle */}
      <div className="border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex gap-2">
            <button
              onClick={() => setView("upcoming")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === "upcoming"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setView("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === "all"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              All Events
            </button>
          </div>
        </div>
      </div>

      {/* Events List */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {view === "upcoming" ? (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-slate-400 mb-4">Upcoming Events</h2>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-4xl mb-4 block">📅</span>
                <p className="text-slate-400">No upcoming events</p>
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <EventCard key={event._id} event={event as unknown as Record<string, unknown>} />
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <EventCard key={event._id} event={event as unknown as Record<string, unknown>} />
            ))}
          </div>
        )}
      </main>

      {/* New Event Modal */}
      {showNewModal && (
        <NewEventModal onClose={() => setShowNewModal(false)} />
      )}
    </div>
  );
}

function EventCard({ event }: { event: Record<string, unknown> }) {
  const type = event.type as string;
  const typeInfo = eventTypes.find((t) => t.id === type) || eventTypes[0];
  const scheduledFor = event.scheduledFor as number;
  
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = timestamp - now;
    
    if (diff < 0) return "Overdue";
    if (diff < 3600000) return `In ${Math.round(diff / 60000)}m`;
    if (diff < 86400000) return `In ${Math.round(diff / 3600000)}h`;
    if (diff < 604800000) return `In ${Math.round(diff / 86400000)}d`;
    
    return new Date(timestamp).toLocaleDateString("en-NZ", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${typeInfo.color} flex items-center justify-center`}>
            <span className="text-lg">{typeInfo.icon}</span>
          </div>
          <div>
            <h3 className="font-medium text-white">{event.title as string}</h3>
            <p className="text-sm text-slate-400">{typeInfo.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-indigo-400">
            {formatRelativeTime(scheduledFor)}
          </p>
          <p className="text-xs text-slate-500">
            {new Date(scheduledFor).toLocaleTimeString("en-NZ", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
      {event.description !== undefined && event.description !== null && (
        <p className="text-sm text-slate-400 mt-3 border-t border-slate-800 pt-3">
          {event.description as string}
        </p>
      )}
    </div>
  );
}

function NewEventModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("task");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Schedule Event</h2>
        
        <input
          type="text"
          placeholder="Event title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mb-4"
        />
        
        <div className="grid grid-cols-5 gap-2 mb-4">
          {eventTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors ${
                type === t.id
                  ? "border-indigo-500 bg-indigo-600/20"
                  : "border-slate-700 bg-slate-800 hover:bg-slate-700"
              }`}
            >
              <span className="text-lg">{t.icon}</span>
              <span className="text-xs text-slate-400">{t.name}</span>
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        
        <textarea
          placeholder="Description (optional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mb-4 h-20"
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
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
}