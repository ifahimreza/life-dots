import {
  DotStyle,
  LanguageId,
  Profile,
  ViewMode,
  LEGACY_STORAGE_KEYS,
  STORAGE_KEY
} from "./lifeDotsData";
import {DEFAULT_THEME_ID, ThemeId} from "./themes";
import {lifeExpectancyByCountry} from "../data/countries";

export type ProfileState = {
  name: string;
  country: string;
  dob: Date | null;
  profession: string;
  discovery: string;
  lifeExpectancy: number;
  hasCustomExpectancy: boolean;
  dotStyle: DotStyle;
  themeId: ThemeId;
  language: LanguageId;
  viewMode: ViewMode;
};

export const DEFAULT_PROFILE_STATE: ProfileState = {
  name: "",
  country: "",
  dob: null,
  profession: "",
  discovery: "",
  lifeExpectancy: 80,
  hasCustomExpectancy: false,
  dotStyle: "classic",
  themeId: DEFAULT_THEME_ID,
  language: "default",
  viewMode: "weeks"
};

export function parseProfile(raw: string): Profile | null {
  try {
    return JSON.parse(raw) as Profile;
  } catch {
    return null;
  }
}

export function loadStoredProfile(storage: Storage): Profile | null {
  let stored = storage.getItem(STORAGE_KEY);
  if (!stored) {
    for (const legacyKey of LEGACY_STORAGE_KEYS) {
      const legacyValue = storage.getItem(legacyKey);
      if (legacyValue) {
        stored = legacyValue;
        storage.setItem(STORAGE_KEY, legacyValue);
        storage.removeItem(legacyKey);
        break;
      }
    }
  }
  return stored ? parseProfile(stored) : null;
}

export function toProfileState(profile: Profile | null): ProfileState {
  const nextProfile: Profile = profile ?? ({} as Profile);
  const storedCountry = nextProfile.country || "";
  const storedLanguage = (nextProfile.language ?? "default") as LanguageId;
  const storedViewMode = (nextProfile.viewMode ?? "weeks") as ViewMode;
  const storedExpectancy =
    typeof nextProfile.lifeExpectancy === "number" ? nextProfile.lifeExpectancy : undefined;
  const defaultExpectancy = storedCountry
    ? (lifeExpectancyByCountry[storedCountry] ?? 80)
    : 80;
  const inferredHasCustom =
    storedExpectancy !== undefined && storedExpectancy !== defaultExpectancy;
  const nextHasCustom =
    typeof nextProfile.hasCustomExpectancy === "boolean"
      ? nextProfile.hasCustomExpectancy
      : inferredHasCustom;
  const dob = nextProfile.dob ? new Date(nextProfile.dob) : null;
  const safeDob = dob && !Number.isNaN(dob.getTime()) ? dob : null;

  return {
    name: nextProfile.name || "",
    country: storedCountry,
    dob: safeDob,
    profession: nextProfile.profession || "",
    discovery: nextProfile.discovery || "",
    lifeExpectancy: storedExpectancy ?? defaultExpectancy,
    hasCustomExpectancy: nextHasCustom,
    dotStyle: nextProfile.dotStyle ?? "classic",
    themeId: (nextProfile.themeId as ThemeId) ?? DEFAULT_THEME_ID,
    language: storedLanguage,
    viewMode: storedViewMode
  };
}

export function toStoredProfile(state: ProfileState): Profile {
  return {
    name: state.name,
    country: state.country,
    dob: state.dob ? state.dob.toISOString() : "",
    profession: state.profession,
    discovery: state.discovery,
    lifeExpectancy: state.lifeExpectancy,
    hasCustomExpectancy: state.hasCustomExpectancy,
    dotStyle: state.dotStyle,
    themeId: state.themeId,
    language: state.language,
    viewMode: state.viewMode
  };
}
