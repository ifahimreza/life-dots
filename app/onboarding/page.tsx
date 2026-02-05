"use client";

import Link from "next/link";
import type {FormEvent} from "react";
import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import AppFooter from "../../components/AppFooter";
import LogoMark from "../../components/LogoMark";
import {LanguageId, Profile, STORAGE_KEY} from "../../libs/lifeDotsData";
import {UiStrings, getTranslations, resolveLocale} from "../../libs/i18n";
import {DEFAULT_THEME_ID} from "../../libs/themes";
import {loadStoredProfile} from "../../libs/profile";
import {useSupabaseAuth} from "../../libs/useSupabaseAuth";
import {countryCodes, lifeExpectancyByCountry} from "../../data/countries";

const PROFESSION_OPTIONS = [
  "Founder",
  "Designer",
  "Engineer",
  "Product",
  "Creator",
  "Student",
  "Other"
];

const DISCOVERY_OPTIONS = [
  "Friend",
  "Twitter/X",
  "Product Hunt",
  "Search",
  "Newsletter",
  "Podcast",
  "Other"
];

const ONBOARDING_KEY = "life-dots-onboarded";
const ONBOARDING_DATA_KEY = "life-dots-onboarding";

export default function OnboardingPage() {
  const [language, setLanguage] = useState<LanguageId>("default");
  const [storedProfile, setStoredProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [dob, setDob] = useState("");
  const [profession, setProfession] = useState("");
  const [discovery, setDiscovery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const {userId, email, session, supabase, isLoading} = useSupabaseAuth({
    redirectPath: "/onboarding"
  });

  const navigatorLanguage = typeof navigator !== "undefined" ? navigator.language : "en";
  const resolvedLocale = useMemo(
    () => resolveLocale(language, navigatorLanguage),
    [language, navigatorLanguage]
  );
  const strings = useMemo<UiStrings>(
    () => getTranslations(language, navigatorLanguage),
    [language, navigatorLanguage]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const parsed = loadStoredProfile(window.localStorage);
    setStoredProfile(parsed);
    setLanguage((parsed?.language ?? "default") as LanguageId);
    if (parsed?.name) setName(parsed.name);
    if (parsed?.country) setCountry(parsed.country);
    if (parsed?.dob) {
      const dateValue = parsed.dob.split("T")[0] ?? "";
      setDob(dateValue);
    }
    if (parsed?.profession) setProfession(parsed.profession);
    if (parsed?.discovery) setDiscovery(parsed.discovery);
  }, []);

  useEffect(() => {
    const nameFromAuth =
      (session?.user?.user_metadata?.full_name as string | undefined) ??
      (session?.user?.user_metadata?.name as string | undefined);
    if (!name && nameFromAuth) setName(nameFromAuth);
  }, [name, session]);

  useEffect(() => {
    if (isLoading) return;
    if (!userId) {
      router.replace("/login");
      return;
    }
    if (typeof window === "undefined") return;
    const onboarded = window.localStorage.getItem(ONBOARDING_KEY);
    if (onboarded) {
      router.replace("/dashboard");
    }
  }, [isLoading, router, userId]);

  const countryOptions = useMemo(() => {
    const formatter = new Intl.DisplayNames([resolvedLocale], {type: "region"});
    return countryCodes.map((code) => ({
      id: code.toLowerCase(),
      label: formatter.of(code) ?? code.toUpperCase()
    }));
  }, [resolvedLocale]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId || !email) {
      setError("Please sign in before continuing.");
      return;
    }
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }
    setIsSaving(true);
    setError(null);

    const trimmedName = name.trim();
    const trimmedProfession = profession.trim();
    const trimmedDiscovery = discovery.trim();
    const nextCountry = country;

    const storedHasCustom = storedProfile?.hasCustomExpectancy ?? false;
    const storedExpectancy =
      typeof storedProfile?.lifeExpectancy === "number" ? storedProfile.lifeExpectancy : undefined;
    const derivedExpectancy = nextCountry
      ? lifeExpectancyByCountry[nextCountry] ?? 80
      : 80;
    const nextLifeExpectancy =
      storedHasCustom && storedExpectancy ? storedExpectancy : derivedExpectancy;

    const dobIso = dob ? new Date(`${dob}T00:00:00Z`).toISOString() : "";

    const nextProfile: Profile = {
      name: trimmedName,
      country: nextCountry,
      dob: dobIso,
      profession: trimmedProfession,
      discovery: trimmedDiscovery,
      lifeExpectancy: nextLifeExpectancy,
      hasCustomExpectancy: storedHasCustom,
      dotStyle: storedProfile?.dotStyle ?? "classic",
      themeId: storedProfile?.themeId ?? DEFAULT_THEME_ID,
      language: (storedProfile?.language ?? "default") as LanguageId,
      viewMode: storedProfile?.viewMode ?? "weeks"
    };

    if (typeof window !== "undefined") {
      window.localStorage.setItem(ONBOARDING_KEY, "1");
      window.localStorage.setItem(ONBOARDING_DATA_KEY, "1");
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfile));
    }

    const payload = {
      id: userId,
      name: trimmedName || null,
      email,
      profile: nextProfile
    };

    try {
      const {error: upsertError} = await supabase
        .from("profiles")
        .upsert(payload, {onConflict: "id"});
      if (upsertError) throw upsertError;
      router.replace("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save profile.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col py-10">
      <section className="mx-auto flex w-full max-w-[520px] flex-1 flex-col gap-6 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-muted transition hover:text-neutral-800"
          >
            ← Back to Life in Dots
          </Link>
        </div>

        <div className="rounded-[32px] surface-card p-6 shadow-soft sm:p-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-2xl border border-surface bg-white">
              <LogoMark className="h-full w-full" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
              Life in Dots
            </span>
          </div>

          <h1 className="mt-6 text-3xl font-semibold text-main">
            Welcome
          </h1>
          <p className="mt-2 text-sm text-muted">
            We want to make Life in Dots work for you.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-main">
                Full name
              </label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm focus-visible:outline-none focus-brand"
                placeholder="Your name"
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-main">
                Country
              </label>
              <select
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm focus-visible:outline-none focus-brand"
                required
              >
                <option value="" disabled>
                  Select country
                </option>
                {countryOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-main">
                Date of birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(event) => setDob(event.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm focus-visible:outline-none focus-brand"
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-main">
                Profession
              </label>
              <select
                value={profession}
                onChange={(event) => setProfession(event.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm focus-visible:outline-none focus-brand"
                required
              >
                <option value="" disabled>
                  Select one
                </option>
                {PROFESSION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-main">
                Where did you find us?
              </label>
              <select
                value={discovery}
                onChange={(event) => setDiscovery(event.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm focus-visible:outline-none focus-brand"
                required
              >
                <option value="" disabled>
                  Select one
                </option>
                {DISCOVERY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="mt-2 w-full rounded-full bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              {isSaving ? "Saving..." : "Take me to Life in Dots"}
            </button>
          </form>

          {error ? (
            <p className="mt-3 text-sm text-rose-700">{error}</p>
          ) : null}
        </div>
      </section>
      <AppFooter strings={strings} />
    </main>
  );
}
