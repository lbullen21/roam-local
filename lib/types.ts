export type GroupType =
  | "solo"
  | "couple"
  | "friends"
  | "family-with-kids"
  | "dog-friendly";

export type Vibe =
  | "relaxed"
  | "adventurous"
  | "scenic"
  | "active"
  | "romantic"
  | "kid-friendly";

export type ActivityCategory =
  | "hike"
  | "park"
  | "river"
  | "lake"
  | "viewpoint"
  | "outdoor";

export interface Activity {
  id: string;
  name: string;
  category: ActivityCategory;
  description: string;
  driveTime: string;
  difficulty?: "easy" | "moderate" | "hard" | null;
  whyToday: string;
}

export type DiningKind = "brunch" | "lunch" | "dinner";

export interface DiningSpot {
  id: string;
  name: string;
  cuisine: string;
  priceRange: "$" | "$$" | "$$$" | "$$$$";
  kind: DiningKind;
  reason: string;
}
