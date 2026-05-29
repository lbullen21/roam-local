export type GroupType =
  | "any"
  | "solo"
  | "couple"
  | "friends"
  | "family-with-kids"
  | "dog-friendly";

export type Vibe =
  | "any"
  | "relaxed"
  | "adventurous"
  | "scenic"
  | "active"
  | "romantic"
  | "kid-friendly";

export type SpotKind = "outdoor" | "dining";

export type OutdoorSubcategory =
  | "hike"
  | "park"
  | "river"
  | "lake"
  | "viewpoint"
  | "outdoor";

export type Difficulty = "easy" | "moderate" | "hard";

export type PriceRange = "$" | "$$" | "$$$" | "$$$$";

export type MealKind = "brunch" | "lunch" | "dinner" | "anytime";

interface SpotBase {
  id: string;
  clientId: string;
  kind: SpotKind;
  name: string;
  location: string;
  description: string;
  tagline: string;
  driveTime: string;
  photoQuery: string;
  photoUrl?: string;
  photoAttribution?: { name: string; profileUrl: string };
}

export interface OutdoorSpot extends SpotBase {
  kind: "outdoor";
  subcategory: OutdoorSubcategory;
  difficulty?: Difficulty | null;
  length?: string | null;
  elevationGain?: string | null;
}

export interface DiningSpotV2 extends SpotBase {
  kind: "dining";
  cuisine: string;
  priceRange: PriceRange;
  mealKind: MealKind;
}

export type Spot = OutdoorSpot | DiningSpotV2;
