export type ThemeId =
  | "classic"
  | "aurora"
  | "sunset"
  | "ocean"
  | "citrus"
  | "rose"
  | "slate"
  | "desert";

export type Theme = {
  id: ThemeId;
  name: string;
  palette: {
    appBg: string;
    surface: string;
    border: string;
    text: string;
    muted: string;
    subtle: string;
    brand: string;
    brandSoft: string;
    gradientFrom: string;
    gradientMid: string;
    gradientTo: string;
    dotFilled: string;
    dotEmpty: string;
    axisText: string;
    rainbow: string[];
  };
};

const DEFAULT_RAINBOW = [
  "#f87171",
  "#fb923c",
  "#fbbf24",
  "#facc15",
  "#a3e635",
  "#4ade80",
  "#34d399",
  "#2dd4bf",
  "#22d3ee",
  "#38bdf8",
  "#60a5fa",
  "#818cf8",
  "#a78bfa",
  "#e879f9",
  "#f472b6",
  "#fb7185"
];

export const THEMES: Theme[] = [
  {
    id: "classic",
    name: "Classic",
    palette: {
      appBg: "#f5f5f5",
      surface: "#ffffff",
      border: "#e5e7eb",
      text: "#111827",
      muted: "#6b7280",
      subtle: "#9ca3af",
      brand: "#3a8f7a",
      brandSoft: "rgba(58, 143, 122, 0.22)",
      gradientFrom: "#3a8f7a",
      gradientMid: "#f08a7a",
      gradientTo: "#2fb8c8",
      dotFilled: "#111827",
      dotEmpty: "#e5e7eb",
      axisText: "#9ca3af",
      rainbow: DEFAULT_RAINBOW
    }
  },
  {
    id: "aurora",
    name: "Aurora",
    palette: {
      appBg: "#f1f7f6",
      surface: "#ffffff",
      border: "#dce7e4",
      text: "#0f1f1b",
      muted: "#5a6e69",
      subtle: "#93a7a1",
      brand: "#2b8a6f",
      brandSoft: "rgba(43, 138, 111, 0.22)",
      gradientFrom: "#2b8a6f",
      gradientMid: "#42b7a0",
      gradientTo: "#5bd1c8",
      dotFilled: "#0f1f1b",
      dotEmpty: "#dce7e4",
      axisText: "#93a7a1",
      rainbow: DEFAULT_RAINBOW
    }
  },
  {
    id: "sunset",
    name: "Sunset",
    palette: {
      appBg: "#fff4ee",
      surface: "#ffffff",
      border: "#f1d7cc",
      text: "#2b1710",
      muted: "#7a5547",
      subtle: "#b08b7f",
      brand: "#d95c4a",
      brandSoft: "rgba(217, 92, 74, 0.22)",
      gradientFrom: "#d95c4a",
      gradientMid: "#f08a5b",
      gradientTo: "#f3b77b",
      dotFilled: "#2b1710",
      dotEmpty: "#f1d7cc",
      axisText: "#b08b7f",
      rainbow: DEFAULT_RAINBOW
    }
  },
  {
    id: "ocean",
    name: "Ocean",
    palette: {
      appBg: "#f1f7fb",
      surface: "#ffffff",
      border: "#d7e4ef",
      text: "#0f1b2a",
      muted: "#51657a",
      subtle: "#8aa0b3",
      brand: "#2b6cb0",
      brandSoft: "rgba(43, 108, 176, 0.22)",
      gradientFrom: "#2b6cb0",
      gradientMid: "#3aaed8",
      gradientTo: "#5ad1f1",
      dotFilled: "#0f1b2a",
      dotEmpty: "#d7e4ef",
      axisText: "#8aa0b3",
      rainbow: DEFAULT_RAINBOW
    }
  },
  {
    id: "citrus",
    name: "Citrus",
    palette: {
      appBg: "#f6f8ef",
      surface: "#ffffff",
      border: "#e3e7d6",
      text: "#1f2a10",
      muted: "#65704f",
      subtle: "#98a281",
      brand: "#6aa84f",
      brandSoft: "rgba(106, 168, 79, 0.22)",
      gradientFrom: "#6aa84f",
      gradientMid: "#b6c43b",
      gradientTo: "#f2c84b",
      dotFilled: "#1f2a10",
      dotEmpty: "#e3e7d6",
      axisText: "#98a281",
      rainbow: DEFAULT_RAINBOW
    }
  },
  {
    id: "rose",
    name: "Rose",
    palette: {
      appBg: "#fff4f7",
      surface: "#ffffff",
      border: "#f0d7de",
      text: "#2b1119",
      muted: "#7a4a58",
      subtle: "#b08b96",
      brand: "#c94b6b",
      brandSoft: "rgba(201, 75, 107, 0.22)",
      gradientFrom: "#c94b6b",
      gradientMid: "#e67b8f",
      gradientTo: "#f2a3b7",
      dotFilled: "#2b1119",
      dotEmpty: "#f0d7de",
      axisText: "#b08b96",
      rainbow: DEFAULT_RAINBOW
    }
  },
  {
    id: "slate",
    name: "Slate",
    palette: {
      appBg: "#f4f6f8",
      surface: "#ffffff",
      border: "#dde1e7",
      text: "#1c2330",
      muted: "#5b6778",
      subtle: "#97a3b3",
      brand: "#4f5d75",
      brandSoft: "rgba(79, 93, 117, 0.22)",
      gradientFrom: "#4f5d75",
      gradientMid: "#7d8ba4",
      gradientTo: "#a9b6c8",
      dotFilled: "#1c2330",
      dotEmpty: "#dde1e7",
      axisText: "#97a3b3",
      rainbow: DEFAULT_RAINBOW
    }
  },
  {
    id: "desert",
    name: "Desert",
    palette: {
      appBg: "#fdf7ee",
      surface: "#ffffff",
      border: "#f1e0c9",
      text: "#3a2614",
      muted: "#7a5c40",
      subtle: "#b29374",
      brand: "#c27c3b",
      brandSoft: "rgba(194, 124, 59, 0.22)",
      gradientFrom: "#c27c3b",
      gradientMid: "#e09a57",
      gradientTo: "#f2c07a",
      dotFilled: "#3a2614",
      dotEmpty: "#f1e0c9",
      axisText: "#b29374",
      rainbow: DEFAULT_RAINBOW
    }
  }
];

export const DEFAULT_THEME_ID: ThemeId = "classic";

export function getTheme(id: ThemeId) {
  return THEMES.find((theme) => theme.id === id) ?? THEMES[0];
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const {palette} = theme;
  root.style.setProperty("--app-bg", palette.appBg);
  root.style.setProperty("--surface", palette.surface);
  root.style.setProperty("--surface-border", palette.border);
  root.style.setProperty("--text-main", palette.text);
  root.style.setProperty("--text-muted", palette.muted);
  root.style.setProperty("--text-subtle", palette.subtle);
  root.style.setProperty("--brand", palette.brand);
  root.style.setProperty("--brand-soft", palette.brandSoft);
  root.style.setProperty("--coral-bright", palette.gradientMid);
  root.style.setProperty("--cyan-bright", palette.gradientTo);
  root.style.setProperty("--dot-filled", palette.dotFilled);
  root.style.setProperty("--dot-empty", palette.dotEmpty);
  root.style.setProperty("--axis-text", palette.axisText);
}

export function buildThemeOptions(themes: Theme[]) {
  return themes.map((theme) => ({id: theme.id, label: theme.name}));
}
