import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all media, optionally filtered
export const list = query({
  args: {
    project: v.optional(v.string()),
    type: v.optional(v.union(v.literal("image"), v.literal("video"))),
    minRating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("media");

    if (args.project) {
      query = query.filter((q) => q.eq(q.field("project"), args.project));
    }
    if (args.type) {
      query = query.filter((q) => q.eq(q.field("type"), args.type));
    }
    const minRating = args.minRating;
    if (minRating !== undefined) {
      query = query.filter((q) => q.gte(q.field("rating"), minRating));
    }

    return await query.order("desc").take(100);
  },
});

// Get media by ID
export const get = query({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new media entry
export const create = mutation({
  args: {
    filename: v.string(),
    originalPath: v.string(),
    type: v.union(v.literal("image"), v.literal("video")),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    project: v.optional(v.string()),
    rating: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    thumbnailPath: v.optional(v.string()),
    sizeBytes: v.optional(v.number()),
    capturedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const project = (args.project || "uncategorized") as "singularity-kiwi" | "solar-surf" | "sunshine-healing" | "sass" | "business" | "personal" | "uncategorized";
    return await ctx.db.insert("media", {
      ...args,
      project,
      rating: args.rating, // No default - unrated until clicked
      createdAt: now,
    });
  },
});

// Update media (for rating changes, etc.)
export const update = mutation({
  args: {
    id: v.id("media"),
    filename: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    project: v.optional(v.string()),
    rating: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    thumbnailPath: v.optional(v.string()),
    clearRating: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, project, thumbnailPath, clearRating, ...updates } = args;
    const updateData: Record<string, unknown> = {
      ...updates,
      ...(project !== undefined && { project: project as "singularity-kiwi" | "solar-surf" | "sunshine-healing" | "sass" | "business" | "personal" | "uncategorized" }),
      ...(thumbnailPath !== undefined && { thumbnailPath }),
    };
    // Handle rating clearing - Convex needs explicit undefined value to remove
    if (clearRating) {
      updateData.rating = undefined;
    }
    await ctx.db.patch(id, updateData);
    return await ctx.db.get(id);
  },
});

// Set rating (convenience function)
export const setRating = mutation({
  args: {
    id: v.id("media"),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.rating < 1 || args.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    await ctx.db.patch(args.id, { rating: args.rating });
    return await ctx.db.get(args.id);
  },
});

// Delete media entry
export const remove = mutation({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Clear all ratings (reset to unrated)
export const clearAllRatings = mutation({
  handler: async (ctx) => {
    const all = await ctx.db.query("media").collect();
    for (const item of all) {
      await ctx.db.patch(item._id, { rating: undefined });
    }
    return { cleared: all.length };
  },
});

// Get stats
export const stats = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("media").collect();

    return {
      total: all.length,
      images: all.filter((m) => m.type === "image").length,
      videos: all.filter((m) => m.type === "video").length,
      byProject: {
        "singularity-kiwi": all.filter((m) => m.project === "singularity-kiwi").length,
        "solar-surf": all.filter((m) => m.project === "solar-surf").length,
        "sunshine-healing": all.filter((m) => m.project === "sunshine-healing").length,
        business: all.filter((m) => m.project === "business").length,
        personal: all.filter((m) => m.project === "personal").length,
        uncategorized: all.filter((m) => m.project === "uncategorized").length,
      },
      byRating: {
        5: all.filter((m) => m.rating === 5).length,
        4: all.filter((m) => m.rating === 4).length,
        3: all.filter((m) => m.rating === 3).length,
        2: all.filter((m) => m.rating === 2).length,
        1: all.filter((m) => m.rating === 1).length,
      },
      rated: all.filter((m) => m.rating && m.rating > 0).length,
      unrated: all.filter((m) => !m.rating).length,
    };
  },
});