const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

interface AnthropicTextBlock {
  type: "text";
  text: string;
}

interface AnthropicResponse {
  content: AnthropicTextBlock[];
}

export async function callClaude(opts: {
  system: string;
  userPrompt: string;
  maxTokens?: number;
}): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to .env.local — see .env.local.example."
    );
  }

  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: opts.maxTokens ?? 1500,
      system: opts.system,
      messages: [{ role: "user", content: opts.userPrompt }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${errText}`);
  }

  const data: AnthropicResponse = await res.json();
  const text = data.content
    ?.filter((c) => c.type === "text")
    .map((c) => c.text)
    .join("\n")
    .trim();

  if (!text) throw new Error("Empty response from Claude.");
  return text;
}

/**
 * Extract the first valid JSON value from Claude's response. Claude sometimes
 * wraps JSON in prose or code fences, so we strip those before parsing.
 */
export function extractJson<T>(raw: string): T {
  let s = raw.trim();
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) s = fence[1].trim();

  const firstBrace = s.search(/[\[{]/);
  if (firstBrace === -1) {
    throw new Error("No JSON found in model response.");
  }
  const lastBrace = Math.max(s.lastIndexOf("]"), s.lastIndexOf("}"));
  const candidate = s.slice(firstBrace, lastBrace + 1);
  return JSON.parse(candidate) as T;
}
