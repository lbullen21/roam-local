# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Next.js dev server on http://localhost:3000
- `npm run build` — production build
- `npm start` — run the production build
- `npm run lint` — Next.js ESLint defaults

There is no test suite configured.

`ANTHROPIC_API_KEY` must be set in `.env.local` (see `.env.local.example`) for any API route to work. `lib/anthropic.ts` throws a descriptive error if the key is missing.

## Architecture

Next.js App Router app (React, TypeScript, Tailwind). Path alias `@/*` resolves to the project root (e.g. `@/lib/types`, `@/components/ActivityCard`).

### Server-side Claude calls

The Anthropic API key never reaches the client. All Claude calls go through two server route handlers that share one helper:

- `lib/anthropic.ts` — `callClaude({ system, userPrompt, maxTokens })` hits `https://api.anthropic.com/v1/messages` directly (no SDK), with the model pinned to `claude-sonnet-4-20250514`. `extractJson<T>(raw)` strips ```json fences and trims to the first `[`/`{` and last `]`/`}` before `JSON.parse` — Claude sometimes wraps JSON in prose, so the routes always pipe responses through this helper rather than parsing directly.
- `app/api/activities/route.ts` — `POST { location, groupType, vibe }` → returns `{ activities: Activity[] }` (always 6).
- `app/api/dining/route.ts` — `POST { location, groupType, vibe, activities, mealKind }` → returns `{ dining: DiningSpot[] }` (always 5). The activity list from step 3 is summarized into the prompt so dining picks are tied to the day's anchor activities.

Both routes set `export const runtime = "nodejs"` and wrap everything in try/catch, returning `{ error }` with status 500 on failure. System prompts demand JSON-only output; user prompts include the exact schema and rules (e.g. "difficulty is only set for category 'hike'").

### Client flow

`app/page.tsx` is the entire UI — a single client component holding a 4-step state machine (`step: 1 | 2 | 3 | 4`):

1. **Location** (`LocationInput`) — defaults to `"Bend, Oregon"`.
2. **Vibe** (`VibeSelector`) — picks `GroupType` and `Vibe`. On continue, fires `fetchActivities` and advances to step 3.
3. **Activities** — grid of `ActivityCard`s. Selection capped at `MAX_ACTIVITIES = 2`; the toggle handler short-circuits when the cap is hit.
4. **Dining** — fires `fetchDining(chosen)` with the selected activities.

Each fetch sets its own `loading`/`error`/data triple. Back/Refresh/Start-over buttons re-trigger the relevant fetch; `handleStartOver` resets all fetch state but keeps the location.

### Shared types

`lib/types.ts` is the source of truth for `GroupType`, `Vibe`, `ActivityCategory`, `Activity`, `DiningKind`, `DiningSpot`. The API route prompts hard-code these enums into the schema strings — if you add a new vibe or category, update both the type and the prompt's allowed values.

### Styling

Tailwind with a custom warm palette (`sun`, `coral`, `sky`, `leaf`) defined in `tailwind.config.ts`. `app/globals.css` defines reusable component classes (`.card`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.chip`) via `@apply` — prefer these over re-deriving the same utility chains in components. Display font is Fraunces, body is Inter (loaded from Google Fonts in `globals.css`).
