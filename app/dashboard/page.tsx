"use client";

import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import AppFooter from "../../components/AppFooter";
import {LanguageId} from "../../libs/lifeDotsData";
import {UiStrings, getTranslations} from "../../libs/i18n";
import {loadStoredProfile} from "../../libs/profile";
import {useSupabaseAuth} from "../../libs/useSupabaseAuth";

export default function DashboardPage() {
  const [language, setLanguage] = useState<LanguageId>("default");
  const router = useRouter();
  const {
    userId,
    email,
    hasAccess,
    profile,
    isLoading,
    signOut
  } = useSupabaseAuth({redirectPath: "/dashboard", fetchProfile: true});

  const navigatorLanguage = typeof navigator !== "undefined" ? navigator.language : "en";
  const strings = useMemo<UiStrings>(
    () => getTranslations(language, navigatorLanguage),
    [language, navigatorLanguage]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const parsed = loadStoredProfile(window.localStorage);
    setLanguage((parsed?.language ?? "default") as LanguageId);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!userId) {
      router.replace("/login");
    }
  }, [isLoading, router, userId]);

  const displayName =
    profile?.name?.trim() ||
    email?.split("@")[0] ||
    "there";

  return (
    <main className="flex min-h-screen flex-col py-6">
      <section className="mx-auto flex w-full max-w-[860px] flex-1 flex-col gap-6 px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/app"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-muted transition hover:text-neutral-800"
          >
            ← Open Life in Dots
          </Link>
          <div className="text-base font-semibold sm:text-lg text-main">
            <span className="title-main">Dashboard</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl surface-card p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
              Welcome
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-main sm:text-3xl">
              Hi {displayName}
            </h1>
            <p className="mt-3 text-sm text-muted">
              Keep your timeline updated and your Pro access in sync.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                href="/app"
                className="rounded-2xl border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-900 transition hover:border-neutral-400"
              >
                Open Life Dots
              </Link>
              <Link
                href="/settings"
                className="rounded-2xl border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-900 transition hover:border-neutral-400"
              >
                Account & Billing
              </Link>
              {!hasAccess ? (
                <Link
                  href="/pro"
                  className="rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  Upgrade to Pro
                </Link>
              ) : (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
                  Pro active
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl surface-card p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
              Account
            </p>
            {isLoading ? (
              <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
                Checking account status...
              </div>
            ) : (
              <div className="mt-4 grid gap-3 text-sm text-main">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
                    Email
                  </p>
                  <p className="mt-1 font-semibold">{email ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
                    Country
                  </p>
                  <p className="mt-1 font-semibold">{profile?.country || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
                    Profession
                  </p>
                  <p className="mt-1 font-semibold">{profile?.profession || "—"}</p>
                </div>
                <button
                  type="button"
                  onClick={signOut}
                  className="mt-2 rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-700 transition hover:border-neutral-400"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      <AppFooter strings={strings} />
    </main>
  );
}
