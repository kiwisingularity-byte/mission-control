"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Convex client - URL will be set after running `npx convex dev`
// The CLI will create a .env.local file with NEXT_PUBLIC_CONVEX_URL
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
console.log("Convex URL:", convexUrl); // Debug
const convex = new ConvexReactClient(convexUrl || "https://placeholder.convex.cloud");

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}