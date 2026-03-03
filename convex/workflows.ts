import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// List all workflows
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("workflows").order("desc").collect();
  },
});

// Get workflows by category
export const getByCategory = query({
  args: { 
    category: v.union(
      v.literal("content_creation"),
      v.literal("media_capture"),
      v.literal("communication"),
      v.literal("automation"),
      v.literal("other")
    ) 
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workflows")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

// Get workflows by status
export const getByStatus = query({
  args: { 
    status: v.union(
      v.literal("active"),
      v.literal("paused"),
      v.literal("deprecated")
    ) 
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workflows")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

// Get single workflow
export const get = query({
  args: { id: v.id("workflows") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create workflow
export const create = mutation({
  args: {
    title: v.string(),
    category: v.union(
      v.literal("content_creation"),
      v.literal("media_capture"),
      v.literal("communication"),
      v.literal("automation"),
      v.literal("other")
    ),
    trigger: v.string(),
    steps: v.string(),
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("paused"),
      v.literal("deprecated")
    )),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("workflows", {
      title: args.title,
      category: args.category,
      trigger: args.trigger,
      steps: args.steps,
      status: args.status ?? "active",
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update workflow
export const update = mutation({
  args: {
    id: v.id("workflows"),
    title: v.optional(v.string()),
    category: v.optional(v.union(
      v.literal("content_creation"),
      v.literal("media_capture"),
      v.literal("communication"),
      v.literal("automation"),
      v.literal("other")
    )),
    trigger: v.optional(v.string()),
    steps: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("paused"),
      v.literal("deprecated")
    )),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Workflow not found");
    
    // Filter out undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    
    await ctx.db.patch(id, {
      ...cleanUpdates,
      updatedAt: Date.now(),
    });
    return id;
  },
});

// Remove workflow
export const remove = mutation({
  args: { id: v.id("workflows") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});