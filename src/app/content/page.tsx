"use client";

import Link from "next/link";

const businesses = [
  {
    id: "unclassified",
    name: "Unclassified",
    description: "Content without a project — reassign here",
    icon: "📥",
    color: "from-red-500 to-orange-500",
    isUnclassified: true,
  },
  {
    id: "singularity-kiwi",
    name: "Singularity Kiwi",
    description: "Website content, blog posts, AI insights",
    icon: "🌌",
    color: "from-indigo-500 to-purple-600",
  },
  {
    id: "solar-surf",
    name: "Solar Surf",
    description: "Solar panel cleaning business content",
    icon: "☀️",
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: "sunshine-healing",
    name: "Sunshine Healing",
    description: "Clare's wellness & healing content",
    icon: "🌞",
    color: "from-amber-400 to-yellow-500",
  },
  {
    id: "sass",
    name: "SASS",
    description: "SaaS project content",
    icon: "⚡",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "business",
    name: "Business",
    description: "General business content & operations",
    icon: "💼",
    color: "from-slate-500 to-slate-600",
  },
  {
    id: "personal",
    name: "Personal",
    description: "Personal projects & content",
    icon: "🏠",
    color: "from-green-500 to-emerald-500",
  },
];

export default function ContentBusinessSelector() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-slate-400 hover:text-white">
              ← Back
            </Link>
            <span className="text-2xl">🎬</span>
            <h1 className="text-xl font-bold text-white">Content Pipeline</h1>
          </div>
        </div>
      </header>

      {/* Business Selector */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Select a Business</h2>
          <p className="text-slate-400">Choose which business's content you want to manage</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <Link
              key={business.id}
              href={`/content/${business.id}`}
              className="group relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 p-6 hover:border-slate-600 transition-all"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${business.color} opacity-0 group-hover:opacity-15 transition-opacity`}
              />
              <div className="relative">
                <span className="text-5xl mb-4 block">{business.icon}</span>
                <h3 className="text-xl font-semibold mb-2">{business.name}</h3>
                <p className="text-sm text-slate-400">{business.description}</p>
                <div className="mt-4 flex items-center text-indigo-400 text-sm font-medium">
                  View Content →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}