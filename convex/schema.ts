import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Tasks Board
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("backlog"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("completed")
    ),
    assignedTo: v.union(v.literal("singularity"), v.literal("cj")),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Content Pipeline
  content: defineTable({
    title: v.string(),
    type: v.union(
      v.literal("article"),
      v.literal("video"),
      v.literal("podcast"),
      v.literal("social_post"),
      v.literal("newsletter")
    ),
    status: v.union(
      v.literal("idea"),
      v.literal("scripting"),
      v.literal("thumbnail"),
      v.literal("production"),
      v.literal("review"),
      v.literal("scheduled"),
      v.literal("published")
    ),
    content: v.optional(v.string()), // Full script/article content
    notes: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    scheduledFor: v.optional(v.number()),
    publishedUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_status", ["status"]),

  // Memory Screen
  memories: defineTable({
    title: v.string(),
    content: v.string(),
    category: v.union(
      v.literal("decision"),
      v.literal("learning"),
      v.literal("preference"),
      v.literal("project"),
      v.literal("conversation"),
      v.literal("reference")
    ),
    tags: v.optional(v.array(v.string())),
    source: v.optional(v.string()), // Where the memory came from
    archived: v.optional(v.boolean()), // Hidden from main view but searchable
    reviewedAt: v.optional(v.number()), // Last review timestamp
    viewCount: v.optional(v.number()), // Popularity tracking
    createdAt: v.number(),
  }),

  // Calendar Events
  calendarEvents: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("task"),
      v.literal("cron"),
      v.literal("reminder"),
      v.literal("deadline"),
      v.literal("meeting")
    ),
    scheduledFor: v.number(),
    completed: v.boolean(),
    createdAt: v.number(),
  }),

  // Team Members (Subagents)
  teamMembers: defineTable({
    name: v.string(),
    role: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("idle"),
      v.literal("working"),
      v.literal("awaiting_input")
    ),
    currentTask: v.optional(v.string()),
    modelId: v.optional(v.string()), // Which model this agent uses
    createdAt: v.number(),
  }),

  // Activity Log (for Office view)
  activityLog: defineTable({
    memberId: v.optional(v.id("teamMembers")),
    action: v.string(),
    details: v.optional(v.string()),
    timestamp: v.number(),
  }),
});