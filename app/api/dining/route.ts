import { NextResponse } from "next/server";
import { callClaude, extractJson } from "@/lib/anthropic";
import type { Activity, DiningSpot } from "@/lib/types";

export const runtime = "nodejs";

interface RequestBody {
  location?: string;
  groupType?: string;
  vibe?: string;
  activities?: Activity[];
  mealKind?: "brunch" | "dinner" | "either";
}

const SYSTEM = `You are a sharp local food guide. You recommend brunch and dinner spots that match the vibe of someone's day — close to the activities they've chosen, fitting their group, and worth the trip.

Your picks are:
- Real, specific restaurants a local would mention
- Within a sensible drive of the activities provided
- A mix of price ranges and cuisines
- Matched to the vibe (post-hike, romantic dinner, family-friendly, etc.)

Respond ONLY with valid JSON. No prose, no markdown fences.`;

function buildPrompt(b: RequestBody): string {
  const location = b.location || "Bend, Oregon";
  const group = b.groupType || "any";
  const vibe = b.vibe || "any";
  const meal = b.mealKind || "either";

  const activitySummary =
    (b.activities ?? [])
      .map((a) => `- ${a.name} (${a.category})`)
      .join("\n") || "no specific activities chosen";

  return `Suggest 5 restaurants near ${location} for someone whose day looks like this.

Group: ${group}
Vibe: ${vibe}
Meal focus: ${meal}
Activities anchoring the day:
${activitySummary}

Return a JSON array of exactly 5 objects with this schema:
[
  {
    "id": "kebab-case-slug",
    "name": "Real restaurant name",
    "cuisine": "e.g. 'Pacific Northwest', 'Mexican', 'Brewpub'",
    "priceRange": "$" | "$$" | "$$$" | "$$$$",
    "kind": "brunch" | "lunch" | "dinner",
    "reason": "one short sentence — why it fits this day specifically"
  }
]

Rules:
- Include at least one brunch and one dinner option when meal focus is "either".
- Tie the reason back to the chosen activities or vibe.
- Output JSON only.`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const prompt = buildPrompt(body);

    const raw = await callClaude({
      system: SYSTEM,
      userPrompt: prompt,
      maxTokens: 1800,
    });

    const dining = extractJson<DiningSpot[]>(raw);
    if (!Array.isArray(dining)) {
      throw new Error("Model did not return an array.");
    }

    return NextResponse.json({ dining });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
