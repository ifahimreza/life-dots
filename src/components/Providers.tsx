"use client";

import {ReactNode, createContext, useContext, useEffect, useState} from "react";
import {BaseProvider, DarkTheme, LightTheme} from "baseui";
import {Provider as StyletronProvider} from "styletron-react";
import {Client, Server} from "styletron-engine-atomic";
import {useServerInsertedHTML} from "next/navigation";

type ThemeMode = "light" | "dark";
type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_STORAGE_KEY = "life-dots-theme";

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within Providers");
  }
  return context;
}

function createStyletronEngine() {
  if (typeof window === "undefined") {
    return new Server();
  }
  const hydrate = document.getElementsByClassName(
    "_styletron_hydrate_"
  ) as HTMLCollectionOf<HTMLStyleElement>;
  return new Client({hydrate});
}

export default function Providers({children}: {children: ReactNode}) {
  const [styletron] = useState(createStyletronEngine);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const nextTheme =
      stored === "light" || stored === "dark" ? stored : prefersDark ? "dark" : "light";
    setTheme(nextTheme);
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasHydrated) return;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [hasHydrated, theme]);

  useServerInsertedHTML(() => {
    if (styletron instanceof Server) {
      return <style dangerouslySetInnerHTML={{__html: styletron.getCss()}} />;
    }
    return null;
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <StyletronProvider value={styletron}>
      <ThemeContext.Provider value={{theme, setTheme, toggleTheme}}>
        <BaseProvider theme={theme === "dark" ? DarkTheme : LightTheme}>
          {children}
        </BaseProvider>
      </ThemeContext.Provider>
    </StyletronProvider>
  );
}
