"use client";

import {useEffect, useMemo, useState} from "react";
import type {FormEvent} from "react";
import DotsGrid from "../components/DotsGrid";
import ProfileDrawer from "../components/ProfileDrawer";
import {
  CountryOption,
  DotStyle,
  LanguageId,
  Profile,
  STORAGE_KEY,
  countryCodes,
  lifeExpectancyByCountry
} from "../lib/lifeDotsData";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function Home() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState<string>("");
  const [dob, setDob] = useState<Date | null>(null);
  const [lifeExpectancy, setLifeExpectancy] = useState(80);
  const [hasCustomExpectancy, setHasCustomExpectancy] = useState(false);
  const [dotStyle, setDotStyle] = useState<DotStyle>("classic");
  const [language, setLanguage] = useState<LanguageId>("default");
  const [draftName, setDraftName] = useState("");
  const [draftCountry, setDraftCountry] = useState<string>("");
  const [draftDob, setDraftDob] = useState<Date | null>(null);
  const [draftLifeExpectancy, setDraftLifeExpectancy] = useState(80);
  const [draftHasCustomExpectancy, setDraftHasCustomExpectancy] = useState(false);
  const [draftDotStyle, setDraftDotStyle] = useState<DotStyle>("classic");
  const [draftLanguage, setDraftLanguage] = useState<LanguageId>("default");
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gridMetrics] = useState({dotSize: 10.38, gap: 5});

  const resolvedLanguage = useMemo(() => {
    if (language !== "default") return language;
    if (typeof navigator !== "undefined" && navigator.language) return navigator.language;
    return "en";
  }, [language]);

  const countryOptions = useMemo<CountryOption[]>(() => {
    const formatter = new Intl.DisplayNames([resolvedLanguage], {type: "region"});
    return countryCodes.map((code) => {
      const id = code.toLowerCase();
      const flag = String.fromCodePoint(
        ...code.toUpperCase().split("").map((char) => 127397 + char.charCodeAt(0))
      );
      return {
        label: `${flag} ${formatter.of(code) ?? code}`,
        id,
        expectancy: lifeExpectancyByCountry[id] ?? 80
      };
    });
  }, [resolvedLanguage]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    const profile = JSON.parse(stored) as Profile;
    const storedCountry = profile.country || "";
    const storedLanguage = (profile.language ?? "default") as LanguageId;
    const storedExpectancy =
      typeof profile.lifeExpectancy === "number" ? profile.lifeExpectancy : undefined;
    const defaultExpectancy = storedCountry ? (lifeExpectancyByCountry[storedCountry] ?? 80) : 80;
    const inferredHasCustom =
      storedExpectancy !== undefined && storedExpectancy !== defaultExpectancy;
    const nextHasCustom =
      typeof profile.hasCustomExpectancy === "boolean"
        ? profile.hasCustomExpectancy
        : inferredHasCustom;
    setName(profile.name || "");
    setCountry(storedCountry);
    setDob(profile.dob ? new Date(profile.dob) : null);
    if (storedExpectancy !== undefined) {
      setLifeExpectancy(storedExpectancy);
    }
    setHasCustomExpectancy(nextHasCustom);
    if (profile.dotStyle) {
      setDotStyle(profile.dotStyle);
    }
    setLanguage(storedLanguage);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const profile: Profile = {
      name,
      country,
      dob: dob ? dob.toISOString() : "",
      lifeExpectancy,
      hasCustomExpectancy,
      dotStyle,
      language
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [name, country, dob, lifeExpectancy, dotStyle, hasCustomExpectancy, language]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const nextLanguage =
      language === "default"
        ? typeof navigator !== "undefined" && navigator.language
          ? navigator.language
          : "en"
        : language;
    document.documentElement.setAttribute("lang", nextLanguage);
  }, [language]);

  const countryOption = countryOptions.find((option) => option.id === country);
  useEffect(() => {
    if (!hasCustomExpectancy) {
      setLifeExpectancy(countryOption?.expectancy ?? 80);
    }
  }, [countryOption?.expectancy, hasCustomExpectancy]);

  const draftCountryOption = countryOptions.find((option) => option.id === draftCountry);
  useEffect(() => {
    if (!draftHasCustomExpectancy) {
      setDraftLifeExpectancy(draftCountryOption?.expectancy ?? 80);
    }
  }, [draftCountryOption?.expectancy, draftHasCustomExpectancy]);

  useEffect(() => {
    if (!isModalOpen) return;
    setDraftName(name);
    setDraftCountry(country);
    setDraftDob(dob);
    setDraftLifeExpectancy(lifeExpectancy);
    setDraftHasCustomExpectancy(hasCustomExpectancy);
    setDraftDotStyle(dotStyle);
    setDraftLanguage(language);
  }, [
    isModalOpen,
    name,
    country,
    dob,
    lifeExpectancy,
    hasCustomExpectancy,
    dotStyle,
    language
  ]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setName(draftName.trim());
    setCountry(draftCountry);
    setDob(draftDob);
    setLifeExpectancy(draftLifeExpectancy);
    setHasCustomExpectancy(draftHasCustomExpectancy);
    setDotStyle(draftDotStyle);
    setLanguage(draftLanguage);
    setIsModalOpen(false);
  };

  const expectancy = clamp(lifeExpectancy, 1, 120);

  const progress = useMemo(() => {
    if (!dob) {
      return {
        percent: 0,
        weeksPassed: 0,
        totalWeeks: expectancy * 52
      };
    }
    const now = new Date();
    const ageMs = now.getTime() - dob.getTime();
    const ageYears = ageMs / (1000 * 60 * 60 * 24 * 365.25);
    const totalWeeks = expectancy * 52;
    const ageWeeks = ageYears * 52;
    const percent = clamp(Math.round((ageWeeks / totalWeeks) * 100), 0, 100);
    const weeksPassed = clamp(Math.floor(ageWeeks), 0, totalWeeks);
    return {
      percent,
      weeksPassed,
      totalWeeks
    };
  }, [dob, expectancy]);

  const handleDraftCountryChange = (value: string) => {
    setDraftHasCustomExpectancy(false);
    setDraftCountry(value);
  };

  const handleDraftLifeExpectancyChange = (value: number) => {
    setDraftHasCustomExpectancy(true);
    setDraftLifeExpectancy(value);
  };

  return (
    <main className="min-h-screen py-6">
      <section className="mx-auto flex w-full max-w-[860px] flex-col gap-4 px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Life in Weeks
          </p>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-sm">Life Dots</h1>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-full border border-neutral-200 p-2 text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white"
            aria-label="Open profile settings"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h3m-7.5 4h11m-7.5 4h3m-8 4h10M4 4h16v16H4z"
              />
            </svg>
          </button>
        </div>

        <div className="flex min-h-[60vh] max-h-[calc(100vh-220px)] flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Life in Weeks
            </span>
            <div className="flex items-center gap-x-3">
              <span>
                Weeks: {progress.weeksPassed}/{progress.totalWeeks}
              </span>
              <span>{progress.percent}%</span>
            </div>
          </div>
          <div className="mt-4 flex-1 overflow-auto">
            <DotsGrid
              total={progress.totalWeeks}
              filled={progress.weeksPassed}
              dotStyle={dotStyle}
              perRow={52}
              dotSize={gridMetrics.dotSize}
              gap={gridMetrics.gap}
            />
          </div>
          {name ? (
            <div className="pt-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              {name}
            </div>
          ) : null}
        </div>
      </section>
      <footer className="mx-auto w-full max-w-[860px] px-6 pb-6 pt-4">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>Credits: Built by Fahim Reza</span>
          <a
            href="https://x.com/ifahimreza"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-neutral-400 transition hover:text-neutral-600 dark:hover:text-neutral-200"
            aria-label="Fahim Reza on X"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="currentColor"
            >
              <path d="M17.53 2.25h3.88l-8.48 9.7 9.97 9.8h-4.7l-7.37-7.2-6.3 7.2H.6l9.05-10.35L.08 2.25h4.82l6.66 6.62 6-6.62Zm-1.36 16.9h2.15L6.92 4.7H4.6l11.57 14.45Z" />
            </svg>
            <span>@ifahimreza</span>
          </a>
        </div>
      </footer>

      <ProfileDrawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mounted={mounted}
        onSubmit={handleSubmit}
        draftName={draftName}
        onDraftNameChange={setDraftName}
        draftCountry={draftCountry}
        onDraftCountryChange={handleDraftCountryChange}
        draftDob={draftDob}
        onDraftDobChange={setDraftDob}
        draftLifeExpectancy={draftLifeExpectancy}
        onDraftLifeExpectancyChange={handleDraftLifeExpectancyChange}
        draftDotStyle={draftDotStyle}
        onDraftDotStyleChange={setDraftDotStyle}
        draftLanguage={draftLanguage}
        onDraftLanguageChange={setDraftLanguage}
        countryOptions={countryOptions}
      />
    </main>
  );
}
