import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ========== MEMORIES ==========

export const list = query({
  args: {
    category: v.optional(v.union(
      v.literal("decision"),
      v.literal("learning"),
      v.literal("preference"),
      v.literal("project"),
      v.literal("conversation"),
      v.literal("reference")
    )),
    includeArchived: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const includeArchived = args.includeArchived ?? false;
    
    let query = ctx.db.query("memories");
    
    const all = await query.order("desc").collect();
    
    // Filter by archived status
    let filtered = includeArchived 
      ? all 
      : all.filter(m => !m.archived);
    
    // Filter by category if specified
    if (args.category) {
      filtered = filtered.filter(m => m.category === args.category);
    }
    
    return filtered;
  },
});

export const archived = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("memories").order("desc").collect();
    return all.filter(m => m.archived);
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    // Simple text search - searches title and content (includes archived)
    const all = await ctx.db.query("memories").collect();
    const query = args.query.toLowerCase();
    return all.filter(
      (m) =>
        m.title.toLowerCase().includes(query) ||
        m.content.toLowerCase().includes(query) ||
        m.tags?.some((t) => t.toLowerCase().includes(query))
    );
  },
});

export const create = mutation({
  args: {
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
    source: v.optional(v.string()),
    archived: v.optional(v.boolean()), // Create directly to archive if true
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("memories", {
      title: args.title,
      content: args.content,
      category: args.category,
      tags: args.tags,
      source: args.source,
      archived: args.archived ?? false,
      viewCount: 0,
      createdAt: Date.now(),
    });
  },
});

export const incrementView = mutation({
  args: { id: v.id("memories") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Memory not found");
    
    await ctx.db.patch(args.id, { 
      viewCount: (existing.viewCount || 0) + 1 
    });
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("memories"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    category: v.optional(v.union(
      v.literal("decision"),
      v.literal("learning"),
      v.literal("preference"),
      v.literal("project"),
      v.literal("conversation"),
      v.literal("reference")
    )),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Memory not found");
    
    const updateData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) updateData[key] = value;
    }
    
    await ctx.db.patch(id, updateData);
    return await ctx.db.get(id);
  },
});

export const archive = mutation({
  args: { id: v.id("memories") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Memory not found");
    
    await ctx.db.patch(args.id, { archived: true, reviewedAt: Date.now() });
    return await ctx.db.get(args.id);
  },
});

export const unarchive = mutation({
  args: { id: v.id("memories") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Memory not found");
    
    await ctx.db.patch(args.id, { archived: false });
    return await ctx.db.get(args.id);
  },
});

export const markReviewed = mutation({
  args: { id: v.id("memories") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Memory not found");
    
    await ctx.db.patch(args.id, { reviewedAt: Date.now() });
    return await ctx.db.get(args.id);
  },
});

export const remove = mutation({
  args: { id: v.id("memories") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});