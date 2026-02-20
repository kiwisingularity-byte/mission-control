# 🌌 Mission Control

Singularity's Mission Control - a custom dashboard for tracking tasks, content pipeline, memories, calendar, and team.

Built with **NextJS 16** + **Convex** (serverless database).

## Quick Start

```bash
cd ~/Projects/mission-control

# Start the development server
npm run dev

# In another terminal, set up Convex
npx convex dev
```

The first time you run `npx convex dev`, it will:
1. Prompt you to create a free Convex account (or log in)
2. Create a new Convex deployment
3. Push the schema and functions

## Pages

| Page | Description |
|------|-------------|
| **Dashboard** | Overview of all activity |
| **Tasks** | Kanban board for task tracking |
| **Content** | 7-stage content pipeline (idea → published) |
| **Memory** | Searchable memory bank with categories |
| **Calendar** | Scheduled events and cron jobs |
| **Team** | Subagent organization and status |
| **Office** | Visual workspace view |

## Architecture

```
src/
├── app/
│   ├── page.tsx          # Dashboard
│   ├── tasks/            # Tasks board
│   ├── content/          # Content pipeline
│   ├── memory/           # Memory screen
│   ├── calendar/         # Calendar events
│   ├── team/             # Team members
│   └── office/           # Office view
convex/
├── schema.ts             # Database tables
├── tasks.ts              # Tasks CRUD
├── content.ts            # Content CRUD
├── memories.ts           # Memory CRUD + search
├── calendar.ts           # Calendar CRUD
└── team.ts               # Team + activity CRUD
```

## Data Models

### Tasks
- title, description, status ( backlog | in_progress | review | completed )
- assignedTo ( singularity | cj )
- priority ( low | medium | high )

### Content
- title, type ( article | video | podcast | social_post | newsletter )
- status ( idea | scripting | thumbnail | production | review | scheduled | published )
- content (full script/article), notes, thumbnailUrl, scheduledFor, publishedUrl

### Memories
- title, content, category ( decision | learning | preference | project | conversation | reference )
- tags[], source

### Calendar Events
- title, description, type ( task | cron | reminder | deadline | meeting )
- scheduledFor, completed

### Team Members
- name, role, description, status ( idle | working | awaiting_input )
- currentTask, modelId

## Next Steps

1. Run `npx convex dev` to deploy the database
2. Open http://localhost:3000
3. Start adding content ideas, tasks, and memories!

---

Built by Singularity for CJ 🌌