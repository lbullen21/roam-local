# Roam Local

A summer day planner that suggests outdoor activities and dining nearby — powered by Claude.

Pick a location (defaults to Bend, Oregon), choose a vibe and group, lock in 1–2 outdoor adventures, then get restaurant picks that match the rest of your day.

## Tech stack

- **Next.js 14** (App Router) + **React 18**
- **TypeScript**
- **Tailwind CSS** with a warm summer palette
- **Anthropic API** (`claude-sonnet-4-20250514`) called server-side from `/app/api/*` routes

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Add your Anthropic API key

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and set:

```env
ANTHROPIC_API_KEY=your_key_here
```

You can get a key at [console.anthropic.com](https://console.anthropic.com/).

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How it works

The app walks you through four steps:

1. **Location** — defaults to Bend, Oregon. Type in any city or pick a suggestion.
2. **Vibe** — pick your group type (solo, couple, friends, family + kids, dog-friendly) and a vibe (relaxed, adventurous, scenic, active, romantic, kid-friendly).
3. **Activities** — Claude suggests 6 outdoor activities within 30 miles. Pick 1–2 to anchor your day.
4. **Dining** — based on your activities and vibe, Claude suggests 5 nearby restaurants with a one-line reason each fits the day.

### API routes

Two server-side endpoints keep your Anthropic key off the client:

- `POST /api/activities` — body: `{ location, groupType, vibe }`
- `POST /api/dining` — body: `{ location, groupType, vibe, activities, mealKind }`

Both routes prompt Claude for JSON, then strip code fences and parse the result.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | Lint with Next.js defaults |

## Project structure

```text
app/
  api/
    activities/route.ts   # Claude → outdoor activity JSON
    dining/route.ts       # Claude → dining JSON
  globals.css             # Tailwind layers + summer theme tokens
  layout.tsx
  page.tsx                # Step-by-step flow (client component)
components/
  ActivityCard.tsx
  DiningCard.tsx
  Loader.tsx
  LocationInput.tsx
  StepIndicator.tsx
  VibeSelector.tsx
lib/
  anthropic.ts            # fetch wrapper + JSON extractor
  types.ts                # shared types
```

## Notes

- Suggestions are AI-generated, so always double-check restaurant hours and trail conditions before heading out.
- The default location is Bend, Oregon — change it anywhere in step 1.
