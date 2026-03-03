#!/bin/bash
# Mission Control startup script
# Clears Turbopack cache to prevent corruption issues after restart

cd /Users/singularity/Projects/mission-control

# Clear Turbopack cache (prevents corruption on restart)
rm -rf .next/cache 2>/dev/null

# Start Next.js dev server
exec /opt/homebrew/bin/npm run dev