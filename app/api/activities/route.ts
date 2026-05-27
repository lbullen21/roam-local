import { NextResponse } from "next/server";
import { callClaude, extractJson } from "@/lib/anthropic";
import type { Activity } from "@/lib/types";

export const runtime = "nodejs";

interface RequestBody {
  location?: string;
  groupType?: string;
  vibe?: string;
}

const SYSTEM = `You are a knowledgeable local guide who recommends outdoor summer activities. You suggest hikes, parks, rivers, lakes, viewpoints, and other outdoor spots within 30 miles of a given location.

Your suggestions are:
- Specific and real (use actual place names a local would know)
- Tailored to the group type and vibe provided
- Varied (mix categories — don't return only hikes)
- Honest about drive time and difficulty

Respond ONLY with valid JSON. No prose, no markdown fences.`;

function buildPrompt(b: RequestBody): string {
  const location = b.location || "Bend, Oregon";
  const group = b.groupType || "any";
  const vibe = b.vibe || "any";

  return `Suggest 6 outdoor activities within ~30 miles of ${location} for a summer day.

Group: ${group}
Vibe: ${vibe}

Return a JSON array of exactly 6 objects with this schema:
[
  {
    "id": "kebab-case-slug",
    "name": "Real place name",
    "category": "hike" | "park" | "river" | "lake" | "viewpoint" | "outdoor",
    "description": "1-2 sentences, vivid and specific",
    "driveTime": "e.g. '15 min' or '45 min'",
    "difficulty": "easy" | "moderate" | "hard" | null,
    "whyToday": "one short sentence — why this is great today, summer-specific hook"
  }
]

Rules:
- difficulty is only set for category "hike"; otherwise null.
- Mix at least 3 different categories.
- Keep all strings concise.
- Output JSON only.`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const prompt = buildPrompt(body);

    const raw = await callClaude({
      system: SYSTEM,
      userPrompt: prompt,
      maxTokens: 2000,
    });

    const activities = extractJson<Activity[]>(raw);
    if (!Array.isArray(activities)) {
      throw new Error("Model did not return an array.");
    }

    return NextResponse.json({ activities });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
