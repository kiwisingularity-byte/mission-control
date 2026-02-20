import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ========== TEAM MEMBERS ==========

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("teamMembers").collect();
  },
});

export const get = query({
  args: { id: v.id("teamMembers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    description: v.optional(v.string()),
    modelId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("teamMembers", {
      name: args.name,
      role: args.role,
      description: args.description,
      status: "idle",
      modelId: args.modelId,
      createdAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("teamMembers"),
    status: v.union(
      v.literal("idle"),
      v.literal("working"),
      v.literal("awaiting_input")
    ),
    currentTask: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updateData: Record<string, unknown> = { status: args.status };
    if (args.currentTask !== undefined) {
      updateData.currentTask = args.currentTask;
    }
    await ctx.db.patch(args.id, updateData);
    return await ctx.db.get(args.id);
  },
});

export const remove = mutation({
  args: { id: v.id("teamMembers") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ========== ACTIVITY LOG ==========

export const listActivity = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("activityLog")
      .order("desc")
      .take(args.limit ?? 50);
  },
});

export const logActivity = mutation({
  args: {
    memberId: v.optional(v.id("teamMembers")),
    action: v.string(),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activityLog", {
      memberId: args.memberId,
      action: args.action,
      details: args.details,
      timestamp: Date.now(),
    });
  },
});