export type SupportedRegion =
  | "India"
  | "MENA"
  | "US"
  | "UK/EU"
  | "SEA"
  | "LATAM";

export type DietType =
  | "Omnivore"
  | "Vegetarian"
  | "Vegan"
  | "Keto"
  | "Halal"
  | "Gluten-free";

export type NutritionPrefs = {
  region: SupportedRegion;
  dietType: DietType;
};

const KEY = "nutrition_prefs_v1";

export const REGIONS: SupportedRegion[] = [
  "India",
  "MENA",
  "US",
  "UK/EU",
  "SEA",
  "LATAM",
];

export const DIET_TYPES: DietType[] = [
  "Omnivore",
  "Vegetarian",
  "Vegan",
  "Keto",
  "Halal",
  "Gluten-free",
];

export function detectRegionFromLocale(locale: string): SupportedRegion {
  const l = (locale || "").toLowerCase();
  if (l.startsWith("hi") || l.endsWith("-in") || l.includes("en-in")) return "India";
  if (
    l.startsWith("ar") ||
    l.endsWith("-sa") ||
    l.endsWith("-ae") ||
    l.endsWith("-eg") ||
    l.endsWith("-qa") ||
    l.endsWith("-kw") ||
    l.endsWith("-om")
  ) {
    return "MENA";
  }
  if (l.endsWith("-us") || l.startsWith("en-us")) return "US";
  if (
    l.endsWith("-gb") ||
    l.endsWith("-ie") ||
    l.endsWith("-fr") ||
    l.endsWith("-de") ||
    l.endsWith("-es") ||
    l.endsWith("-it") ||
    l.endsWith("-nl")
  ) {
    return "UK/EU";
  }
  if (
    l.endsWith("-sg") ||
    l.endsWith("-my") ||
    l.endsWith("-id") ||
    l.endsWith("-ph") ||
    l.endsWith("-th") ||
    l.endsWith("-vn")
  ) {
    return "SEA";
  }
  if (
    l.endsWith("-mx") ||
    l.endsWith("-br") ||
    l.endsWith("-ar") ||
    l.endsWith("-co") ||
    l.endsWith("-cl") ||
    l.endsWith("-pe")
  ) {
    return "LATAM";
  }
  return "US";
}

export function getNutritionPrefs(): NutritionPrefs {
  const fallback: NutritionPrefs = { region: "US", dietType: "Omnivore" };
  if (typeof window === "undefined") return fallback;

  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<NutritionPrefs>;
      if (
        parsed.region &&
        (REGIONS as string[]).includes(parsed.region) &&
        parsed.dietType &&
        (DIET_TYPES as string[]).includes(parsed.dietType)
      ) {
        return parsed as NutritionPrefs;
      }
    }
  } catch {
    // ignore
  }

  try {
    const locale =
      (navigator as any)?.language ||
      (Intl.DateTimeFormat().resolvedOptions().locale as string) ||
      "en-US";
    return { region: detectRegionFromLocale(locale), dietType: "Omnivore" };
  } catch {
    return fallback;
  }
}

export function setNutritionPrefs(prefs: NutritionPrefs) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(prefs));
}

