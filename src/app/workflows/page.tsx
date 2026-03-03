"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import Link from "next/link";

const categoryIcons: Record<string, string> = {
  content_creation: "🎬",
  media_capture: "📷",
  communication: "💬",
  automation: "⚙️",
  other: "📁",
};

const categoryColors: Record<string, string> = {
  content_creation: "from-rose-500/20 to-orange-500/20 border-rose-500/30",
  media_capture: "from-pink-500/20 to-rose-500/20 border-pink-500/30",
  communication: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  automation: "from-amber-500/20 to-yellow-500/20 border-amber-500/30",
  other: "from-slate-500/20 to-slate-600/20 border-slate-500/30",
};

const statusColors: Record<string, string> = {
  active: "bg-green-500",
  paused: "bg-yellow-500",
  deprecated: "bg-red-500",
};

export default function WorkflowsPage() {
  const workflows = useQuery(api.workflows.list);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Id<"workflows"> | null>(null);
  const [showNewWorkflow, setShowNewWorkflow] = useState(false);

  if (!workflows) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading workflows...</div>
      </div>
    );
  }

  const activeWorkflows = workflows.filter(w => w.status === "active");
  const pausedWorkflows = workflows.filter(w => w.status === "paused");
  const deprecatedWorkflows = workflows.filter(w => w.status === "deprecated");

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
              <span className="text-2xl">🔄</span>
              <h1 className="text-xl font-bold text-white">Workflows</h1>
            </div>
            <button 
              onClick={() => setShowNewWorkflow(!showNewWorkflow)}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + New Workflow
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-slate-400">Active</span>
            </div>
            <p className="text-2xl font-bold">{activeWorkflows.length}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-sm text-slate-400">Paused</span>
            </div>
            <p className="text-2xl font-bold">{pausedWorkflows.length}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm text-slate-400">Deprecated</span>
            </div>
            <p className="text-2xl font-bold">{deprecatedWorkflows.length}</p>
          </div>
        </div>

        {/* Workflows Grid */}
        {workflows.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">🔄</span>
            <h3 className="text-xl font-medium text-slate-300 mb-2">No workflows yet</h3>
            <p className="text-slate-500 mb-6">Create your first workflow to automate repetitive tasks</p>
            <button 
              onClick={() => setShowNewWorkflow(true)}
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Create Workflow
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map((workflow) => (
              <WorkflowCard 
                key={workflow._id} 
                workflow={workflow}
                onClick={() => setSelectedWorkflow(workflow._id)}
                isSelected={selectedWorkflow === workflow._id}
              />
            ))}
          </div>
        )}

        {/* Workflow Detail Modal */}
        {selectedWorkflow && (
          <WorkflowDetail 
            workflowId={selectedWorkflow} 
            onClose={() => setSelectedWorkflow(null)} 
          />
        )}

        {/* New Workflow Modal */}
        {showNewWorkflow && (
          <NewWorkflowModal onClose={() => setShowNewWorkflow(false)} />
        )}
      </main>
    </div>
  );
}

function WorkflowCard({ 
  workflow, 
  onClick,
  isSelected 
}: { 
  workflow: { 
    _id: Id<"workflows">;
    title: string;
    category: string;
    trigger: string;
    status: string;
    steps: string;
    notes?: string;
  };
  onClick: () => void;
  isSelected: boolean;
}) {
  const stepsList = workflow.steps.split('\n').filter(s => s.trim());
  
  return (
    <div 
      onClick={onClick}
      className={`bg-gradient-to-br ${categoryColors[workflow.category] || categoryColors.other} border rounded-xl p-5 cursor-pointer hover:border-slate-600 transition-all ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{categoryIcons[workflow.category] || "📁"}</span>
          <h3 className="font-semibold text-white">{workflow.title}</h3>
        </div>
        <div className={`w-2 h-2 rounded-full ${statusColors[workflow.status]}`} title={workflow.status} />
      </div>
      
      <div className="mb-3">
        <p className="text-xs text-slate-400 mb-1">Trigger:</p>
        <p className="text-sm text-slate-300 line-clamp-2">{workflow.trigger}</p>
      </div>
      
      <div>
        <p className="text-xs text-slate-400 mb-1">{stepsList.length} steps</p>
        <div className="flex gap-1">
          {stepsList.slice(0, 4).map((_, i) => (
            <div key={i} className="h-1 flex-1 bg-slate-600 rounded-full">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: '100%' }} />
            </div>
          ))}
          {stepsList.length > 4 && (
            <div className="text-xs text-slate-500 ml-2">+{stepsList.length - 4}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function WorkflowDetail({ 
  workflowId, 
  onClose 
}: { 
  workflowId: Id<"workflows">;
  onClose: () => void;
}) {
  const workflow = useQuery(api.workflows.get, { id: workflowId });
  const updateWorkflow = useMutation(api.workflows.update);
  const removeWorkflow = useMutation(api.workflows.remove);

  if (!workflow) return null;

  const stepsList = workflow.steps.split('\n').filter(s => s.trim());

  const handleStatusChange = async (newStatus: "active" | "paused" | "deprecated") => {
    await updateWorkflow({ id: workflowId, status: newStatus });
  };

  const handleDelete = async () => {
    if (confirm("Delete this workflow?")) {
      await removeWorkflow({ id: workflowId });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{categoryIcons[workflow.category] || "📁"}</span>
              <div>
                <h2 className="text-xl font-bold text-white">{workflow.title}</h2>
                <p className="text-sm text-slate-400 capitalize">{workflow.category.replace('_', ' ')}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Trigger */}
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-2">⚡ Trigger</h3>
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-white">{workflow.trigger}</p>
            </div>
          </div>

          {/* Steps */}
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-2">📋 Steps</h3>
            <div className="space-y-2">
              {stepsList.map((step, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-medium shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-slate-300 text-sm">{step.replace(/^\d+\.\s*/, '')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {workflow.notes && (
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">📝 Notes</h3>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-slate-300 text-sm whitespace-pre-wrap">{workflow.notes}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
            <span className="text-sm text-slate-400 mr-2">Status:</span>
            {(["active", "paused", "deprecated"] as const).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  workflow.status === status
                    ? status === 'active' 
                      ? 'bg-green-600 text-white' 
                      : status === 'paused'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-red-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
            <button
              onClick={handleDelete}
              className="ml-auto px-3 py-1.5 rounded-lg text-sm font-medium bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewWorkflowModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"content_creation" | "media_capture" | "communication" | "automation" | "other">("automation");
  const [trigger, setTrigger] = useState("");
  const [steps, setSteps] = useState("");
  const [notes, setNotes] = useState("");
  
  const createWorkflow = useMutation(api.workflows.create);

  const handleCreate = async () => {
    if (!title.trim() || !trigger.trim() || !steps.trim()) return;
    
    await createWorkflow({
      title,
      category,
      trigger,
      steps,
      notes: notes || undefined,
      status: "active",
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">New Workflow</h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Workflow name..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="content_creation">🎬 Content Creation</option>
              <option value="media_capture">📷 Media Capture</option>
              <option value="communication">💬 Communication</option>
              <option value="automation">⚙️ Automation</option>
              <option value="other">📁 Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Trigger</label>
            <input
              type="text"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              placeholder="What starts this workflow?"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Steps (one per line)</label>
            <textarea
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="1. First step&#10;2. Second step&#10;3. Third step"
              rows={6}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional context, credentials, links..."
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!title.trim() || !trigger.trim() || !steps.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-500 px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Create Workflow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}