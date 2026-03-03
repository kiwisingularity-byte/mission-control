"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/", icon: "🌌", emoji: true },
  { name: "Tasks", href: "/tasks", icon: "📋", emoji: true },
  { name: "Content", href: "/content", icon: "🎬", emoji: true },
  { name: "Media", href: "/media", icon: "📷", emoji: true },
  { name: "Memory", href: "/memory", icon: "🧠", emoji: true },
  { name: "Calendar", href: "/calendar", icon: "📅", emoji: true },
  { name: "Workflows", href: "/workflows", icon: "🔄", emoji: true },
  { name: "Team", href: "/team", icon: "👥", emoji: true },
  { name: "Office", href: "/office", icon: "🏢", emoji: true },
];

export default function Home() {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌌</span>
              <div>
                <h1 className="text-xl font-bold text-white">Mission Control</h1>
                <p className="text-sm text-slate-400">Singularity & CJ</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Dashboard Grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome back, CJ</h2>
          <p className="text-slate-400">Here's what's happening across Mission Control</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <StatCard title="Active Tasks" value="—" icon="📋" color="blue" href="/tasks" />
          <StatCard title="Content Ideas" value="—" icon="💡" color="yellow" href="/content" />
          <StatCard title="Media" value="—" icon="📷" color="pink" href="/media" />
          <StatCard title="Memories" value="—" icon="🧠" color="purple" href="/memory" />
          <StatCard title="Upcoming Events" value="—" icon="📅" color="green" href="/calendar" />
          <StatCard title="Workflows" value="—" icon="🔄" color="cyan" href="/workflows" />
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickAccessCard
            title="Content Pipeline"
            description="Manage your content from idea to published"
            icon="🎬"
            href="/content"
            color="from-rose-500 to-orange-500"
          />
          <QuickAccessCard
            title="Media Library"
            description="Photos, videos with star ratings"
            icon="📷"
            href="/media"
            color="from-pink-500 to-rose-500"
          />
          <QuickAccessCard
            title="Tasks Board"
            description="Track what we're working on together"
            icon="📋"
            href="/tasks"
            color="from-blue-500 to-cyan-500"
          />
          <QuickAccessCard
            title="Memory Screen"
            description="Search through all our shared memories"
            icon="🧠"
            href="/memory"
            color="from-purple-500 to-pink-500"
          />
          <QuickAccessCard
            title="Calendar"
            description="Scheduled tasks and reminders"
            icon="📅"
            href="/calendar"
            color="from-green-500 to-emerald-500"
          />
          <QuickAccessCard
            title="Team"
            description="Our digital organization and subagents"
            icon="👥"
            href="/team"
            color="from-amber-500 to-yellow-500"
          />
          <QuickAccessCard
            title="Office"
            description="Visual workspace view"
            icon="🏢"
            href="/office"
            color="from-slate-500 to-slate-600"
          />
          <QuickAccessCard
            title="Workflows"
            description="Automated processes and routines"
            icon="🔄"
            href="/workflows"
            color="from-cyan-500 to-blue-500"
          />
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-sm border-t border-slate-800 px-4 py-2">
        <div className="flex justify-around">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-2 px-3 rounded-lg ${
                pathname === item.href ? "text-indigo-400" : "text-slate-400"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  color,
  href 
}: { 
  title: string; 
  value: string; 
  icon: string; 
  color: "blue" | "yellow" | "purple" | "green" | "pink" | "cyan";
  href: string;
}) {
  const colors = {
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
    yellow: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30",
    purple: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
    green: "from-green-500/20 to-emerald-500/20 border-green-500/30",
    pink: "from-pink-500/20 to-rose-500/20 border-pink-500/30",
    cyan: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
  };

  return (
    <Link href={href} className="block">
      <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-4 hover:border-slate-600 transition-colors cursor-pointer`}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">{title}</span>
          <span className="text-xl">{icon}</span>
        </div>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
    </Link>
  );
}

function QuickAccessCard({
  title,
  description,
  icon,
  href,
  color,
}: {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 p-6 hover:border-slate-700 transition-all"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity`}
      />
      <div className="relative">
        <span className="text-4xl mb-4 block">{icon}</span>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </Link>
  );
}