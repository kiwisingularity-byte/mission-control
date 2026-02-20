import { mutation } from "./_generated/server";
import { v } from "convex/values";

// One-time seed function to populate WordPress content
export const seedWordPress = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    
    const posts = [
      {
        title: "Singularity Countdown",
        type: "article" as const,
        status: "published" as const,
        content: "Tracking the path to artificial general intelligence - comprehensive timeline from ELIZA to AGI predictions.",
        notes: "Main pillar article - heavy custom CSS layout with 3-column grid",
      },
      {
        title: "Technology & People",
        type: "article" as const,
        status: "idea" as const,
        content: "Real stories of how AI and robotics are transforming everyday life. Coming soon.",
        notes: "Pillar page - needs development",
      },
      {
        title: "Career Compass",
        type: "article" as const,
        status: "idea" as const,
        content: "Discover which careers are future-proof and which are at risk. Visual career tracker and guidance coming soon.",
        notes: "Pillar page - needs development",
      },
      {
        title: "The Rise of Humanoid Robots",
        type: "article" as const,
        status: "idea" as const,
        content: "Robotics and automation content - Tesla Optimus, Figure AI, industrial deployment.",
        notes: "Needs full article",
      },
      {
        title: "What Happens After AGI",
        type: "article" as const,
        status: "idea" as const,
        content: "AI future predictions - software AGI timeline, physical deployment, societal impact.",
        notes: "Needs full article",
      },
      {
        title: "AI in Business Today",
        type: "article" as const,
        status: "idea" as const,
        content: "Tech business content - current AI adoption, enterprise use cases.",
        notes: "Needs full article",
      },
      {
        title: "Machine Learning Basics",
        type: "article" as const,
        status: "idea" as const,
        content: "ML fundamentals for beginners - neural nets, training, inference.",
        notes: "Needs full article",
      },
      {
        title: "AI Safety and Alignment",
        type: "article" as const,
        status: "idea" as const,
        content: "Safety and ethics - Constitutional AI, alignment problem, responsible development.",
        notes: "Needs full article",
      },
      {
        title: "Future of Work",
        type: "article" as const,
        status: "idea" as const,
        content: "Work transformation - automation impact, new job categories, adaptation strategies.",
        notes: "Needs full article",
      },
      {
        title: "Quantum Computing Meets AI",
        type: "article" as const,
        status: "idea" as const,
        content: "Quantum + AI convergence - quantum machine learning, computational advantages.",
        notes: "Needs full article",
      },
    ];

    const results = [];
    for (const post of posts) {
      const id = await ctx.db.insert("content", {
        ...post,
        createdAt: now,
        updatedAt: now,
      });
      results.push({ id, title: post.title });
    }
    
    return results;
  },
});