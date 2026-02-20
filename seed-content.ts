// Seed WordPress posts into Convex content pipeline
// Run with: npx convex run seed-content:seed --once

import { MutationBuilder } from "convex/server";
import { v } from "convex/values";

const wordpressPosts = [
  {
    title: "Singularity Countdown",
    type: "article" as const,
    status: "published" as const,
    content: "Tracking the path to artificial general intelligence - comprehensive timeline from ELIZA to AGI predictions.",
    notes: "Main pillar article - heavy custom CSS layout with 3-column grid",
    publishedUrl: "/singularity-countdown/",
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
    content: "Placeholder content for article 4. Robotics and automation content.",
    notes: "Needs full article",
  },
  {
    title: "What Happens After AGI",
    type: "article" as const,
    status: "idea" as const,
    content: "Placeholder content for article 5. AI future predictions.",
    notes: "Needs full article",
  },
  {
    title: "AI in Business Today",
    type: "article" as const,
    status: "idea" as const,
    content: "Placeholder content for article 6. Tech business content.",
    notes: "Needs full article",
  },
  {
    title: "Machine Learning Basics",
    type: "article" as const,
    status: "idea" as const,
    content: "Placeholder content for article 7. ML fundamentals.",
    notes: "Needs full article",
  },
  {
    title: "AI Safety and Alignment",
    type: "article" as const,
    status: "idea" as const,
    content: "Placeholder content for article 8. Safety and ethics content.",
    notes: "Needs full article",
  },
  {
    title: "Future of Work",
    type: "article" as const,
    status: "idea" as const,
    content: "Placeholder content for article 9. Work transformation.",
    notes: "Needs full article",
  },
  {
    title: "Quantum Computing Meets AI",
    type: "article" as const,
    status: "idea" as const,
    content: "Placeholder content for article 10. Quantum + AI content.",
    notes: "Needs full article",
  },
];

console.log("Content to seed:", wordpressPosts);
console.log("\nUse: npx convex run content:create for each item");