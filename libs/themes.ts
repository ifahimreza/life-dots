export type Theme = {
  id: "default";
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

export const DOTSPAN_THEME: Theme = {
  id: "default",
  name: "DotSpan",
  palette: {
    appBg: "#f5f5f5",
    surface: "#ffffff",
    border: "#e5e7eb",
    text: "#111827",
    muted: "#6b7280",
    subtle: "#9ca3af",
    brand: "#00c565",
    brandSoft: "rgba(0, 197, 101, 0.22)",
    gradientFrom: "#3a8f7a",
    gradientMid: "#f08a7a",
    gradientTo: "#2fb8c8",
    dotFilled: "#111827",
    dotEmpty: "#e5e7eb",
    axisText: "#9ca3af",
    rainbow: DEFAULT_RAINBOW
  }
};

export function getTheme() {
  return DOTSPAN_THEME;
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
