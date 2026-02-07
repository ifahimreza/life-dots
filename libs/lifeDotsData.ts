export type DotStyle = "classic" | "rainbow" | "lineBar";
export type ViewMode = "weeks" | "months" | "years";

export type LanguageId = "default" | "en" | "es" | "fr" | "ja" | "hi" | "bn";

import type {ReactNode} from "react";

export type SelectOption = {
  id: string;
  label: string;
};

export type CountryOption = {
  id: string;
  label: ReactNode;
  name: string;
  countryCode: string;
  expectancy: number;
};

export type Profile = {
  name: string;
  country: string;
  dob: string;
  profession?: string;
  discovery?: string;
  lifeExpectancy?: number;
  hasCustomExpectancy?: boolean;
  dotStyle?: DotStyle;
  language?: LanguageId;
  viewMode?: ViewMode;
};

export const STORAGE_KEY = "dotspan";
export const LEGACY_STORAGE_KEYS = ["life-dots", "life-progress-profile", "life-progress"];

export const SUPPORTED_LANGUAGES: LanguageId[] = [
  "default",
  "en",
  "es",
  "fr",
  "ja",
  "hi",
  "bn"
];

export const DOT_STYLE_IDS: DotStyle[] = ["classic", "rainbow", "lineBar"];

export {countryCodes, lifeExpectancyByCountry} from "../data/countries";

export const GRID_AXIS_OFFSET = 18;
export const GRID_GAP_RATIO = 0.48;
