import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ========== CALENDAR ==========

export const list = query({
  args: {
    from: v.optional(v.number()),
    to: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("calendarEvents");
    
    if (args.from) {
      query = query.filter((q) => q.gte(q.field("scheduledFor"), args.from!));
    }
    if (args.to) {
      query = query.filter((q) => q.lte(q.field("scheduledFor"), args.to!));
    }
    
    return await query.order("asc").collect();
  },
});

export const upcoming = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db
      .query("calendarEvents")
      .filter((q) => q.gte(q.field("scheduledFor"), now))
      .filter((q) => q.eq(q.field("completed"), false))
      .order("asc")
      .take(args.limit ?? 10);
  },
});

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("calendarEvents", {
      title: args.title,
      description: args.description,
      type: args.type,
      scheduledFor: args.scheduledFor,
      completed: false,
      createdAt: Date.now(),
    });
  },
});

export const complete = mutation({
  args: { id: v.id("calendarEvents") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { completed: true });
  },
});

export const remove = mutation({
  args: { id: v.id("calendarEvents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});