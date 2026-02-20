import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ========== CONTENT PIPELINE ==========

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("content").order("desc").collect();
  },
});

export const getByStatus = query({
  args: {
    status: v.optional(v.union(
      v.literal("idea"),
      v.literal("scripting"),
      v.literal("thumbnail"),
      v.literal("production"),
      v.literal("review"),
      v.literal("scheduled"),
      v.literal("published")
    )),
  },
  handler: async (ctx, args) => {
    if (!args.status) {
      return await ctx.db.query("content").order("desc").collect();
    }
    const status = args.status;
    return await ctx.db
      .query("content")
      .withIndex("by_status", (q) => q.eq("status", status))
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    type: v.union(
      v.literal("article"),
      v.literal("video"),
      v.literal("podcast"),
      v.literal("social_post"),
      v.literal("newsletter")
    ),
    status: v.optional(v.union(
      v.literal("idea"),
      v.literal("scripting"),
      v.literal("thumbnail"),
      v.literal("production"),
      v.literal("review"),
      v.literal("scheduled"),
      v.literal("published")
    )),
    content: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("content", {
      title: args.title,
      type: args.type,
      status: args.status ?? "idea",
      content: args.content,
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("content"),
    title: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("idea"),
      v.literal("scripting"),
      v.literal("thumbnail"),
      v.literal("production"),
      v.literal("review"),
      v.literal("scheduled"),
      v.literal("published")
    )),
    content: v.optional(v.string()),
    notes: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    scheduledFor: v.optional(v.number()),
    publishedUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Content not found");
    
    const updateData: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) updateData[key] = value;
    }
    
    await ctx.db.patch(id, updateData);
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("content") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});