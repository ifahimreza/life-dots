"use client";

import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import AppFooter from "../../components/AppFooter";
import {Profile, LanguageId} from "../../libs/lifeDotsData";
import {UiStrings, getTranslations} from "../../libs/i18n";
import {loadStoredProfile} from "../../libs/profile";
import {useSupabaseAuth} from "../../libs/useSupabaseAuth";

export default function ProPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [language, setLanguage] = useState<LanguageId>("default");
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"yearly" | "lifetime">("yearly");
  const {
    userId,
    email,
    hasAccess,
    isLoading: isAuthLoading,
    signInWithGoogle
  } = useSupabaseAuth({redirectPath: "/pro"});

  const navigatorLanguage = typeof navigator !== "undefined" ? navigator.language : "en";
  const strings = useMemo<UiStrings>(
    () => getTranslations(language, navigatorLanguage),
    [language, navigatorLanguage]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const parsed = loadStoredProfile(window.localStorage);
    setProfile(parsed);
    setLanguage((parsed?.language ?? "default") as LanguageId);

    const missing: string[] = [];
    if (!parsed?.name?.trim()) missing.push("name");
    if (!parsed?.country) missing.push("country");
    if (!parsed?.dob) missing.push("date of birth");
    setMissingFields(missing);
  }, []);

  const canCheckout = missingFields.length === 0 && Boolean(userId) && Boolean(email);

  const handleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleCheckout = async () => {
    if (!canCheckout || isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/freemius/checkout", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          plan: selectedPlan,
          userId,
          name: profile?.name?.trim() || undefined,
          email: email ?? undefined
        })
      });
      const data = await response.json();
      if (response.ok && data?.url) {
        window.location.href = data.url as string;
        return;
      }
      console.error(data?.error ?? "Unable to start checkout.");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col py-4 sm:py-6">
      <section className="mx-auto flex w-full max-w-[980px] flex-1 flex-col gap-6 px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-muted transition hover:text-neutral-800"
          >
            ← Back to Life in Dots
          </Link>
          <div className="text-base font-semibold sm:text-lg text-main">
            <span className="title-main">{strings.appTitle} Pro</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl surface-card p-5 shadow-soft sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
              Pro features
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-main sm:text-3xl">
              Unlock deeper insights and more control.
            </h1>
            <p className="mt-3 text-sm text-muted">
              Pro keeps your timeline organized, sharable, and ready for long-term planning.
            </p>
            <ul className="mt-5 grid gap-3 text-sm text-main">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-neutral-900" />
                Export PDFs and high-resolution visuals, plus keep multiple timelines.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-neutral-900" />
                Track milestones, reminders, and key life events in one place.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-neutral-900" />
                Unlock the full theme pack and early access to new visual themes.
              </li>
            </ul>
          </div>

          <div className="rounded-3xl surface-card p-5 shadow-soft sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
                  Simple pricing
                </p>
                <p className="mt-2 text-2xl font-semibold text-main">Pro Access</p>
              </div>
              <span className="rounded-full border border-surface px-3 py-1 text-xs font-semibold text-muted">
                Freemius
              </span>
            </div>
            <p className="mt-3 text-sm text-muted">
              One plan. All Pro features. Checkout handled securely.
            </p>

            {isAuthLoading ? (
              <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
                Checking account status...
              </div>
            ) : hasAccess ? (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                You already have Pro access. Thank you!
              </div>
            ) : !userId ? (
              <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
                <p className="font-semibold">Sign in to continue.</p>
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="mt-3 inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
                >
                  Sign in with Google
                </button>
              </div>
            ) : !canCheckout ? (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-semibold">Complete your profile before upgrading.</p>
                <p className="mt-2">
                  Missing: {missingFields.join(", ")}
                </p>
                <Link
                  href="/?settings=1"
                  className="mt-3 inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
                >
                  Update profile
                </Link>
              </div>
            ) : null}

            {!hasAccess ? (
              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPlan("yearly")}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    selectedPlan === "yearly"
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400"
                  }`}
                >
                  <span>
                    <span className="block font-semibold">Pro Yearly</span>
                    <span className="block text-xs opacity-70">$29 / year</span>
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Yearly
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPlan("lifetime")}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    selectedPlan === "lifetime"
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400"
                  }`}
                >
                  <span>
                    <span className="block font-semibold">Pro Lifetime</span>
                    <span className="block text-xs opacity-70">$49 one-time</span>
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Lifetime
                  </span>
                </button>
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={!canCheckout || isLoading || hasAccess}
              className="mt-5 w-full rounded-full bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              {isLoading ? "Starting checkout..." : "Unlock Pro"}
            </button>
            <p className="mt-3 text-xs text-muted">
              By continuing, you’ll be redirected to Freemius.
            </p>
          </div>
        </div>
      </section>
      <AppFooter strings={strings} />
    </main>
  );
}
