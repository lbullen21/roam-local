const WIKI_REST_SUMMARY = "https://en.wikipedia.org/api/rest_v1/page/summary";
const WIKI_API = "https://en.wikipedia.org/w/api.php";
const PLACES_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const PLACES_MEDIA_BASE = "https://places.googleapis.com/v1";
const USER_AGENT =
  "RoamLocal/0.1 (https://github.com/roam-local; portfolio demo)";
const CACHE_MAX = 200;

export interface Photo {
  url: string;
  attribution: { name: string; profileUrl: string };
}

export interface PhotoSubject {
  name: string;
  location: string;
  kind: "outdoor" | "dining";
}

const cache = new Map<string, Photo | null>();

function rememberInCache(key: string, value: Photo | null): void {
  if (cache.size >= CACHE_MAX) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, value);
}

function cacheKey(spot: PhotoSubject): string {
  return `${spot.kind}|${spot.name}|${spot.location}`.toLowerCase();
}

// Words that are too generic to disambiguate a place by themselves.
const STOP_WORDS = new Set([
  "the", "a", "an", "of", "and", "at", "in", "on", "for",
  "state", "national", "park", "parks", "trail", "trails",
  "lake", "lakes", "river", "rivers", "creek", "creeks",
  "mountain", "mountains", "peak", "peaks", "butte", "buttes",
  "viewpoint", "viewpoints", "area", "areas", "forest", "forests",
  "recreation", "loop", "falls", "monument", "preserve",
]);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3);
}

function significantTokens(s: string): string[] {
  return tokenize(s).filter((t) => !STOP_WORDS.has(t));
}

/**
 * Strict match: every significant token from the spot name must appear in the
 * article/place title. Falls back to all-tokens (including stop words) when
 * the spot name has no significant tokens (e.g. "Black Butte").
 */
function strictTitleMatch(articleTitle: string, spotName: string): boolean {
  if (!articleTitle) return false;
  const articleAll = new Set(tokenize(articleTitle));
  if (articleAll.size === 0) return false;
  if (/^(list|category|file|template|disambiguation)\b/i.test(articleTitle)) {
    return false;
  }
  const spotSignificant = significantTokens(spotName);
  const spotAll = tokenize(spotName);
  const required = spotSignificant.length > 0 ? spotSignificant : spotAll;
  if (required.length === 0) return false;
  return required.every((t) => articleAll.has(t));
}

interface WikiSummaryResponse {
  type?: string;
  title?: string;
  content_urls?: { desktop?: { page?: string } };
  thumbnail?: { source?: string };
  originalimage?: { source?: string };
}

async function getWikipediaSummary(title: string): Promise<Photo | null> {
  const path = encodeURIComponent(title.trim().replace(/\s+/g, "_"));
  const url = `${WIKI_REST_SUMMARY}/${path}?redirect=true`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) return null;
    const data = (await res.json()) as WikiSummaryResponse;
    if (data.type !== "standard") return null;
    if (!data.title || !strictTitleMatch(data.title, title)) return null;
    const imageUrl = data.thumbnail?.source || data.originalimage?.source;
    if (!imageUrl) return null;
    return {
      url: imageUrl,
      attribution: {
        name: "Wikipedia",
        profileUrl:
          data.content_urls?.desktop?.page ||
          `https://en.wikipedia.org/wiki/${path}`,
      },
    };
  } catch {
    return null;
  }
}

interface WikiSearchResponse {
  query?: {
    pages?: Record<
      string,
      {
        title?: string;
        fullurl?: string;
        thumbnail?: { source?: string };
        original?: { source?: string };
      }
    >;
  };
}

async function getWikipediaSearch(spot: PhotoSubject): Promise<Photo | null> {
  const query = `${spot.name} ${spot.location}`.trim();
  const url = new URL(WIKI_API);
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", query);
  url.searchParams.set("gsrlimit", "5");
  url.searchParams.set("prop", "pageimages|info");
  url.searchParams.set("piprop", "thumbnail|original");
  url.searchParams.set("pithumbsize", "800");
  url.searchParams.set("inprop", "url");

  try {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) return null;
    const data = (await res.json()) as WikiSearchResponse;
    const pages = data.query?.pages;
    if (!pages) return null;

    for (const page of Object.values(pages)) {
      if (!page.title || !strictTitleMatch(page.title, spot.name)) continue;
      const imageUrl = page.thumbnail?.source || page.original?.source;
      if (!imageUrl) continue;
      return {
        url: imageUrl,
        attribution: {
          name: "Wikipedia",
          profileUrl: page.fullurl || "https://en.wikipedia.org",
        },
      };
    }
    return null;
  } catch {
    return null;
  }
}

async function getWikipediaPhoto(spot: PhotoSubject): Promise<Photo | null> {
  return (
    (await getWikipediaSummary(spot.name)) ?? (await getWikipediaSearch(spot))
  );
}

interface PlacesSearchResponse {
  places?: Array<{
    id?: string;
    displayName?: { text?: string };
    googleMapsUri?: string;
    photos?: Array<{
      name?: string;
      authorAttributions?: Array<{ displayName?: string; uri?: string }>;
    }>;
  }>;
}

interface PlacesMediaResponse {
  photoUri?: string;
}

async function getGooglePlacesPhoto(
  spot: PhotoSubject
): Promise<Photo | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  try {
    const searchRes = await fetch(PLACES_SEARCH_URL, {
      method: "POST",
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.googleMapsUri,places.photos",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        textQuery: `${spot.name}, ${spot.location}`,
        maxResultCount: 1,
      }),
    });
    if (!searchRes.ok) return null;
    const data = (await searchRes.json()) as PlacesSearchResponse;
    const place = data.places?.[0];
    if (!place) return null;

    const placeName = place.displayName?.text;
    if (placeName && !strictTitleMatch(placeName, spot.name)) return null;

    const photo = place.photos?.[0];
    if (!photo?.name) return null;

    const mediaUrl = new URL(`${PLACES_MEDIA_BASE}/${photo.name}/media`);
    mediaUrl.searchParams.set("maxWidthPx", "800");
    mediaUrl.searchParams.set("skipHttpRedirect", "true");
    mediaUrl.searchParams.set("key", apiKey);

    const mediaRes = await fetch(mediaUrl);
    if (!mediaRes.ok) return null;
    const mediaData = (await mediaRes.json()) as PlacesMediaResponse;
    if (!mediaData.photoUri) return null;

    const author = photo.authorAttributions?.[0];
    return {
      url: mediaData.photoUri,
      attribution: {
        name: author?.displayName
          ? `${author.displayName} · Google Maps`
          : "Google Maps",
        profileUrl:
          author?.uri || place.googleMapsUri || "https://maps.google.com",
      },
    };
  } catch {
    return null;
  }
}

export async function getPhoto(spot: PhotoSubject): Promise<Photo | null> {
  const key = cacheKey(spot);
  if (cache.has(key)) return cache.get(key) ?? null;

  let photo: Photo | null = null;
  if (spot.kind === "outdoor") {
    photo = await getWikipediaPhoto(spot);
    if (!photo) photo = await getGooglePlacesPhoto(spot);
  } else {
    // Restaurants — Wikipedia coverage is mostly chains, which would mislead.
    // Use Google Places only.
    photo = await getGooglePlacesPhoto(spot);
  }

  rememberInCache(key, photo);
  return photo;
}
