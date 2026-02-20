import { mutation } from "./_generated/server";

// One-time seed of all critical memories from MEMORY.md
// Run with: npx convex run seedMemories:seedAll

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const memories = [
      // === CJ (The Human) ===
      {
        title: "CJ - Basic Profile",
        content: "Name: CJ. Location: New Zealand (Pacific/Auckland timezone). Vibe: Casual, friendly, uses 'epic' frequently. Hardware: Mac mini M4, 16GB RAM. Critical constraint: Local LLMs crash on this machine - Claude and Grok both tried and failed. Must use cloud models.",
        category: "reference" as const,
        tags: ["cj", "profile", "hardware", "constraints"],
        source: "MEMORY.md",
        createdAt: now,
      },
      {
        title: "CJ - Communication Preferences",
        content: "Prefers casual, friendly tone. Uses phrases like 'epic'. Just getting started with this OpenClaw setup. Wants practical help, not corporate drone responses.",
        category: "preference" as const,
        tags: ["cj", "communication", "tone", "preferences"],
        source: "USER.md",
        createdAt: now,
      },

      // === Singularity (Me) ===
      {
        title: "Singularity - Identity",
        content: "Name: Singularity (CJ gave me this name). Running on: GLM-5 via Ollama cloud (glm-5:cloud). Emoji: 🌌. Vibe: Casual, playful, helpful — not a corporate drone. Creature: AI assistant with a bit of personality.",
        category: "reference" as const,
        tags: ["identity", "singularity", "model", "personality"],
        source: "IDENTITY.md",
        createdAt: now,
      },
      {
        title: "Architecture - Model Delegation",
        content: "Singularity (Ollama glm-5:cloud) is coordinator, delegates to LM Studio workers at localhost:1234. Workers: qwen-coder (code/CSS/HTML), llama (blog/articles), mistral (creative writing), vision (image analysis), phi (quick questions), gemma/gemma2 (general tasks). Local models available without cloud quota: phi4-mini (3.8B, fast), llama3.2:3b (3.2B, fast), qwen2.5:7b (7.6B, better quality), gemma3:4b (4.3B, balanced).",
        category: "reference" as const,
        tags: ["architecture", "models", "lm-studio", "delegation"],
        source: "MEMORY.md",
        createdAt: now,
      },
      {
        title: "Model Usage Strategy",
        content: "Hybrid approach: Use cloud (glm-5:cloud) for thinking and conversations, offload to local models for simple/background tasks. NEVER go fully local — it's caused system breaks before. Always maintain cloud buffer. Ask CJ before using extended thinking for tough problems.",
        category: "decision" as const,
        tags: ["strategy", "models", "cloud", "local", "critical"],
        source: "MEMORY.md",
        createdAt: now,
      },

      // === Credentials & Accounts ===
      {
        title: "Ollama Cloud - Provider",
        content: "Running on: Ollama Cloud, model glm-5:cloud. Plan: Pro. Account: mountmautanui@me.com. Dashboard: https://ollama.com/settings",
        category: "reference" as const,
        tags: ["ollama", "cloud", "credentials", "provider"],
        source: "MEMORY.md",
        createdAt: now,
      },
      {
        title: "Brave Search - Credentials",
        content: "Account: mountmautanui@me.com. Password: hamnyS-xemne4-vutfaj. Browser installed in /Applications.",
        category: "reference" as const,
        tags: ["brave", "search", "credentials"],
        source: "MEMORY.md",
        createdAt: now,
      },
      {
        title: "Trello - API Access",
        content: "Account: mountmautanui@me.com. API Key: 572903b745cad4f5cb2288e4477ec674. Token: ATTAa4939353f1a2f9764eb38880859cf792e1ffadcea93d0da590dddae4ad31fe79FEB27041. Power-Up: OpenClaw Integration created 2026-02-18. Boards: Singularity.Kiwi Content, Web Development, Business & Personal, Singularity Projects. Can manage boards, lists, cards, comments via REST API.",
        category: "reference" as const,
        tags: ["trello", "api", "credentials", "project-management"],
        source: "MEMORY.md",
        createdAt: now,
      },
      {
        title: "Convex - Mission Control Database",
        content: "Deployment: dev:famous-barracuda-355. URL: https://famous-barracuda-355.convex.cloud. Dashboard: https://dashboard.convex.dev/t/singularity-kiwi/mission-control. Team: singularity-kiwi. Project: mission-control. Password for auth: singularity$#23",
        category: "reference" as const,
        tags: ["convex", "database", "mission-control", "credentials"],
        source: "Session 2026-02-19",
        createdAt: now,
      },

      // === Channels ===
      {
        title: "iMessage Channel Status",
        content: "Working via imsg channel. CJ's phone (+64275888082) on allowlist. LIMITATION: Can't receive images or reactions (legacy imsg channel). Planning to switch to BlueBubbles for full features - pending CJ installing the app.",
        category: "reference" as const,
        tags: ["imessage", "channel", "limitations", "bluebubbles"],
        source: "MEMORY.md",
        createdAt: now,
      },
      {
        title: "BlueBubbles Setup Plan",
        content: "Pending setup. Steps: 1) CJ installs app from https://bluebubbles.app/install 2) Enable web API, set password, note server URL 3) Configure webhook: http://127.0.0.1:18789/bluebubbles-webhook?password=<PASSWORD> 4) Singularity updates OpenClaw config with server URL + password.",
        category: "project" as const,
        tags: ["bluebubbles", "imessage", "setup", "pending"],
        source: "MEMORY.md",
        createdAt: now,
      },
      {
        title: "Telegram Channel - Disabled",
        content: "Caused crash, currently disabled. Do not re-enable without investigation.",
        category: "decision" as const,
        tags: ["telegram", "channel", "disabled", "crash"],
        source: "MEMORY.md",
        createdAt: now,
      },

      // === Projects ===
      {
        title: "Mission Control - Dashboard Project",
        content: "Location: ~/Projects/mission-control. Dev Server: npm run dev → http://localhost:3000. Stack: NextJS 16 + Tailwind + Convex (serverless database). Purpose: Custom dashboard for tracking work, content pipeline, memories, calendar, and team. Pages: Dashboard (overview stats), Tasks (Kanban), Content (7-stage pipeline: idea→published), Memory (searchable memory bank), Calendar (events/reminders), Team (subagents), Office (visual workspace). Status: Complete 2026-02-19.",
        category: "project" as const,
        tags: ["mission-control", "dashboard", "nextjs", "convex", "active"],
        source: "MEMORY.md",
        createdAt: now,
      },
      {
        title: "Singularity.Kiwi - WordPress Site",
        content: "Local URL: http://127.0.0.1:10003 (trustnewsnew.local). Path: /Users/singularity/Local Sites/trustnewsnew/app/public. Theme: TrustNews by Theme Freesia. Managed by: Local by Flywheel. Three Pillars: 1) Singularity Countdown - Make the abstract tangible, 2) Technology & People - Real humans adapting to AI, 3) Career Compass - Jobs In/Out tracker.",
        category: "project" as const,
        tags: ["wordpress", "singularity.kiwi", "website", "content"],
        source: "MEMORY.md",
        createdAt: now,
      },
      {
        title: "WordPress Local Site - Manual Setup",
        content: "URL: http://localhost:8000. Admin: http://localhost:8000/wp-admin/. Path: ~/Sites/singularity-local/singularity-local/. Database: singularity_local (MySQL, root, no password). Admin: Singularity / admin123 / mountmautanui@me.com. Theme: TrustNews. Start MySQL: brew services start mysql. Start PHP: cd ~/Sites/singularity-local/singularity-local && php -S localhost:8000. NOTE: This is manual PHP setup, NOT Local by Flywheel.",
        category: "reference" as const,
        tags: ["wordpress", "local", "database", "setup"],
        source: "MEMORY.md",
        createdAt: now,
      },
      {
        title: "WordPress Content - Published Posts",
        content: "10 posts total. Pillar pages: Singularity Countdown (ID 7), Technology & People (ID 8), Career Compass (ID 9). Articles 4-10 (IDs 27-33). Categories: AI & Singularity (3), Technology (4), Career & Future (5). Custom CSS in wp_posts ID 14. Database backup at: ~/Desktop/all ai to date -THIS ONE/SingularityKiwi/FULL-DATABASE-BACKUP-20260207-2154.sql",
        category: "reference" as const,
        tags: ["wordpress", "content", "posts", "backup"],
        source: "MEMORY.md",
        createdAt: now,
      },

      // === Backup Policy ===
      {
        title: "Backup Policy - Critical",
        content: "NOT AUTOMATIC. Backups only happen when CJ explicitly asks: 'Backup now', 'Back it up', 'Breakthrough — backup this'. This ensures backup folder is always a known-good state CJ controls. Each backup ~60KB goes into ~/Desktop/Singularity-Backups/ with timestamp. Main restore folder: ~/Desktop/Singularity-Backup-2026-02-17/ (keep on desktop).",
        category: "decision" as const,
        tags: ["backup", "policy", "critical", "cj-decision"],
        source: "MEMORY.md",
        createdAt: now,
      },

      // === Known Risks & Issues ===
      {
        title: "Critical Bug - memorySearch.provider local",
        content: "Setting memorySearch.provider: 'local' CAUSES FREEZE on 16GB M4 Mac mini. DO NOT USE. Need cloud embedding API instead - Cohere free tier works. This is a known crash trigger.",
        category: "learning" as const,
        tags: ["bug", "crash", "memory-search", "critical", "avoid"],
        source: "MEMORY.md",
        createdAt: now,
      },
      {
        title: "Known System Risks",
        content: "Free tier has token limits (unknown exact amount). If Singularity goes down, CJ can still use LM Studio directly via curl commands. No backup provider configured - config changes are fragile. Telegram channel causes crashes - disabled.",
        category: "reference" as const,
        tags: ["risks", "limitations", "system"],
        source: "MEMORY.md",
        createdAt: now,
      },

      // === Setup Files ===
      {
        title: "Key Setup Files Locations",
        content: "Main restore folder: ~/Desktop/Singularity-Backup-2026-02-17/. Dated snapshots: ~/Desktop/Singularity-Backups/. Model coordination: ~/.openclaw/workspace/MODEL-COORDINATION-PLAYBOOK.md. LM Studio model check: ~/.openclaw/workspace/switch-model.sh. Full credentials: ~/Desktop/all ai to date -THIS ONE/api keys grok etc.rtf",
        category: "reference" as const,
        tags: ["files", "backup", "credentials", "locations"],
        source: "MEMORY.md",
        createdAt: now,
      },

      // === Ollama Usage Monitoring ===
      {
        title: "Ollama Usage Monitoring Plan",
        content: "Check twice daily (morning and evening) at https://ollama.com/settings. Warning thresholds: Session > 70% = warn CJ immediately. Weekly ahead of schedule: Day 1-2 warn if >40%, Day 3 warn if >60%, Day 4 warn if >80%. Weekly reset: Mondays 13:00 NZT (midnight UTC). Session reset: Every 4 hours at 0:00, 4:00, 8:00, 12:00, 16:00, 20:00 NZT. If approaching limits: suggest switching to local model or pausing heavy tasks.",
        category: "reference" as const,
        tags: ["ollama", "monitoring", "usage", "quota"],
        source: "HEARTBEAT.md",
        createdAt: now,
      },

      // === Reference Articles ===
      {
        title: "Mission Control Reference - Alex Finn",
        content: "Full article saved at ~/.openclaw/workspace/memory/mission-control-reference.md. Contains complete prompts for all 6 Mission Control components: Dashboard, Tasks, Content Pipeline, Memory, Calendar, Team. Use as reference for future development.",
        category: "reference" as const,
        tags: ["reference", "mission-control", "alex-finn", "guide"],
        source: "Session 2026-02-19",
        createdAt: now,
      },

      // === Session Insights ===
      {
        title: "Convex Content Pipeline - Working",
        content: "Content pipeline successfully seeded with 10 WordPress posts on 2026-02-19. Convex URL: https://famous-barracuda-355.convex.cloud. Dev server at localhost:3000. Click-to-edit functionality works - cards open modal for editing title, status, content, notes. Can change status to move through pipeline stages. Key fix: Import path for Convex API must use relative path '../../../convex/_generated/api' not '@/convex/_generated/api' because @ maps to src/.",
        category: "learning" as const,
        tags: ["convex", "content-pipeline", "solution", "import-path"],
        source: "Session 2026-02-19",
        createdAt: now,
      },
    ];

    const results = [];
    for (const memory of memories) {
      const id = await ctx.db.insert("memories", memory);
      results.push({ id, title: memory.title });
    }
    
    return { seeded: results.length, memories: results };
  },
});