import { NextResponse } from "next/server";
import { callClaude, extractJson } from "@/lib/anthropic";
import { getPhoto } from "@/lib/photos";
import type {
  GroupType,
  MealKind,
  Spot,
  SpotKind,
  Vibe,
} from "@/lib/types";

export const runtime = "nodejs";

interface RequestBody {
  location?: string;
  kinds?: SpotKind[];
  counts?: { outdoor?: number; dining?: number };
  query?: string;
  groupType?: GroupType;
  vibe?: Vibe;
  mealKind?: MealKind;
  anchorSpots?: Spot[];
}

const SYSTEM = `You are a knowledgeable local guide who recommends both outdoor destinations and restaurants for a day trip.

Outdoor picks include hikes, parks, rivers, lakes, viewpoints, and other natural spots within ~30 miles of the given location.
Dining picks are real, specific restaurants — brunch, lunch, or dinner — that pair well with the day.

Your suggestions are:
- Specific and real (use actual place names a local would know)
- Tailored to the group type, vibe, and any anchor spots already chosen
- Varied (mix outdoor categories — don't return only hikes; mix cuisines and prices for dining)
- Honest about drive time and difficulty
- Each includes a short photoQuery (2–6 words) suitable for an image search

Respond ONLY with valid JSON. No prose, no markdown fences.`;

function buildPrompt(b: RequestBody): string {
  const location = b.location?.trim() || "Bend, Oregon";
  const kinds = b.kinds && b.kinds.length > 0 ? b.kinds : ["outdoor", "dining"];
  const outdoorCount = b.counts?.outdoor ?? (kinds.includes("outdoor") ? 6 : 0);
  const diningCount = b.counts?.dining ?? (kinds.includes("dining") ? 4 : 0);
  const group = b.groupType && b.groupType !== "any" ? b.groupType : "any";
  const vibe = b.vibe && b.vibe !== "any" ? b.vibe : "any";
  const meal = b.mealKind || "anytime";
  const query = b.query?.trim();

  const anchorSummary =
    (b.anchorSpots ?? [])
      .map((a) => `- ${a.name} (${a.kind})`)
      .join("\n") || "none";

  const requestParts: string[] = [];
  if (outdoorCount > 0) {
    requestParts.push(
      `${outdoorCount} outdoor spots (mix of categories — hike, park, river, lake, viewpoint, outdoor)`
    );
  }
  if (diningCount > 0) {
    requestParts.push(
      `${diningCount} restaurants (mix of cuisines and price ranges)`
    );
  }

  return `Suggest ${requestParts.join(" and ")} within ~30 miles of ${location}.

Group: ${group}
Vibe: ${vibe}
Meal focus: ${meal}
${query ? `Free-text query: ${query}\n` : ""}Anchor spots already in the user's day:
${anchorSummary}

Return a single JSON array combining all spots, each matching one of these two shapes:

Outdoor spot:
{
  "kind": "outdoor",
  "id": "kebab-case-slug",
  "name": "Real place name",
  "subcategory": "hike" | "park" | "river" | "lake" | "viewpoint" | "outdoor",
  "description": "2-3 sentences, vivid and specific",
  "tagline": "one short sentence — why this is great today",
  "driveTime": "e.g. '15 min' or '45 min'",
  "difficulty": "easy" | "moderate" | "hard" | null,
  "length": "e.g. '4.2 mi' or null",
  "elevationGain": "e.g. '850 ft' or null",
  "photoQuery": "2-6 word image search seed"
}

Dining spot:
{
  "kind": "dining",
  "id": "kebab-case-slug",
  "name": "Real restaurant name",
  "cuisine": "e.g. 'Pacific Northwest', 'Mexican', 'Brewpub'",
  "priceRange": "$" | "$$" | "$$$" | "$$$$",
  "mealKind": "brunch" | "lunch" | "dinner" | "anytime",
  "description": "2-3 sentences about the spot, the food, and the room",
  "tagline": "one short sentence — why it fits this day specifically",
  "driveTime": "e.g. '10 min'",
  "photoQuery": "2-6 word image search seed (no word 'photo')"
}

Rules:
- difficulty / length / elevationGain are only set when subcategory is "hike"; otherwise null.
- Tie taglines back to the chosen anchor spots or vibe when relevant.
- Keep all strings concise.
- Output JSON only.`;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function attachClientIds(spots: Spot[], location: string): Spot[] {
  const seen = new Set<string>();
  return spots.map((spot) => {
    const base = `${slugify(spot.name)}:${slugify(location)}`;
    let clientId = base;
    let suffix = 2;
    while (seen.has(clientId)) {
      clientId = `${base}-${suffix++}`;
    }
    seen.add(clientId);
    return { ...spot, clientId, location };
  });
}

async function attachPhotos(spots: Spot[]): Promise<Spot[]> {
  return Promise.all(
    spots.map(async (spot) => {
      const photo = await getPhoto({
        name: spot.name,
        location: spot.location,
        kind: spot.kind,
      });
      if (!photo) return spot;
      return {
        ...spot,
        photoUrl: photo.url,
        photoAttribution: photo.attribution,
      };
    })
  );
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const location = body.location?.trim() || "Bend, Oregon";
    const prompt = buildPrompt(body);

    const raw = await callClaude({
      system: SYSTEM,
      userPrompt: prompt,
      maxTokens: 3000,
    });

    const parsed = extractJson<Spot[]>(raw);
    if (!Array.isArray(parsed)) {
      throw new Error("Model did not return an array.");
    }

    const withIds = attachClientIds(parsed, location);
    const spots = await attachPhotos(withIds);
    return NextResponse.json({ spots });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
