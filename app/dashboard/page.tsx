"use client";

import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import AppFooter from "../../components/AppFooter";
import {LanguageId} from "../../libs/lifeDotsData";
import {UiStrings, getTranslations} from "../../libs/i18n";
import {hasCompletedOnboarding, loadStoredProfile} from "../../libs/profile";
import {useSupabaseAuth} from "../../libs/useSupabaseAuth";

type ProfileForm = {
  name: string;
  profession: string;
  country: string;
  lifeExpectancy: number;
};

export default function DashboardPage() {
  const [language, setLanguage] = useState<LanguageId>("default");
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    profession: "",
    country: "",
    lifeExpectancy: 80
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const router = useRouter();
  const {
    supabase,
    userId,
    email,
    hasAccess,
    profile,
    isLoading,
    profileLoaded,
    refreshProfile,
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

  const onboardingComplete = hasCompletedOnboarding(profile);

  useEffect(() => {
    if (isLoading) return;
    if (!userId) {
      router.replace("/login");
      return;
    }
    if (!profileLoaded) return;
    if (!onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [isLoading, onboardingComplete, profileLoaded, router, userId]);

  useEffect(() => {
    if (!profileLoaded) return;
    setForm({
      name: profile?.name ?? "",
      profession: profile?.profession ?? "",
      country: profile?.country ?? "",
      lifeExpectancy: profile?.lifeExpectancy ?? 80
    });
  }, [profile, profileLoaded]);

  const displayName = profile?.name?.trim() || email?.split("@")[0] || "there";

  const handleSave = async () => {
    if (!supabase || !userId) return;
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const mergedProfile = {
        ...(profile ?? {}),
        ...form
      };
      const {error} = await supabase.from("profiles").upsert(
        {
          id: userId,
          email: email ?? null,
          name: form.name.trim() || null,
          profile: mergedProfile
        },
        {onConflict: "id"}
      );
      if (error) {
        throw error;
      }
      await refreshProfile(userId);
      setSaveMessage("Changes saved.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save changes.";
      setSaveMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!supabase || !userId || isDeleting) return;
    setIsDeleting(true);
    setDeleteMessage(null);
    try {
      const {data: sessionData} = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) {
        throw new Error("Please sign in again.");
      }
      const response = await fetch("/api/account/delete", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const payload = (await response.json().catch(() => null)) as {error?: string} | null;
      if (!response.ok) {
        throw new Error(payload?.error || "Could not delete account.");
      }
      await signOut();
      router.replace("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not delete account.";
      setDeleteMessage(message);
      setIsDeleting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col py-6">
      <section className="mx-auto flex w-full max-w-[880px] flex-1 flex-col gap-6 px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/app"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-muted transition hover:text-neutral-800"
          >
            ← Open DotSpan
          </Link>
          <div className="text-base font-semibold sm:text-lg text-main">
            <span className="title-main">Dashboard</span>
          </div>
        </div>

        <div className="rounded-3xl surface-card p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
            Welcome
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-main sm:text-3xl">
            Hi {displayName}
          </h1>
          <p className="mt-2 text-sm text-muted">
            Manage your profile and account in one place.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/app"
              className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-700 transition hover:border-neutral-400"
            >
              Open app
            </Link>
            <Link
              href="/settings?tab=billing"
              className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-700 transition hover:border-neutral-400"
            >
              Billing
            </Link>
            {!hasAccess ? (
              <Link
                href="/?upgrade=1"
                className="rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white"
              >
                Go Plus
              </Link>
            ) : (
              <div className="rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
                Plus active
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-3xl surface-card p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
              Editable profile
            </p>
            <div className="mt-4 grid gap-3">
              <input
                className="w-full rounded-2xl border border-neutral-200 px-4 py-2.5 text-sm text-main"
                placeholder="Name"
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({...prev, name: event.target.value}))
                }
              />
              <input
                className="w-full rounded-2xl border border-neutral-200 px-4 py-2.5 text-sm text-main"
                placeholder="Profession"
                value={form.profession}
                onChange={(event) =>
                  setForm((prev) => ({...prev, profession: event.target.value}))
                }
              />
              <input
                className="w-full rounded-2xl border border-neutral-200 px-4 py-2.5 text-sm text-main"
                placeholder="Country code (e.g. us)"
                value={form.country}
                onChange={(event) =>
                  setForm((prev) => ({...prev, country: event.target.value.toLowerCase()}))
                }
              />
              <input
                type="number"
                min={1}
                max={120}
                className="w-full rounded-2xl border border-neutral-200 px-4 py-2.5 text-sm text-main"
                placeholder="Life expectancy"
                value={form.lifeExpectancy}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    lifeExpectancy: Number(event.target.value || 80)
                  }))
                }
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || isLoading || !userId}
                className="rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? "Saving..." : "Save changes"}
              </button>
              {saveMessage ? (
                <p className="text-xs text-muted">{saveMessage}</p>
              ) : null}
            </div>
          </div>

          <div className="rounded-3xl surface-card p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
              Account
            </p>
            {isLoading ? (
              <p className="mt-3 text-sm text-muted">Checking account status...</p>
            ) : (
              <div className="mt-3 space-y-3 text-sm text-main">
                <p>
                  <span className="text-subtle">Email:</span> {email ?? "—"}
                </p>
                <button
                  type="button"
                  onClick={signOut}
                  className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-700 transition hover:border-neutral-400"
                >
                  Sign out
                </button>
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
                Danger zone
              </p>
              <p className="mt-2 text-xs text-rose-700">
                Delete account and all profile data with one click.
              </p>
              <button
                type="button"
                onClick={() => void handleDeleteAccount()}
                disabled={isDeleting || !userId}
                className="mt-3 rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isDeleting ? "Deleting..." : "Delete account"}
              </button>
              {deleteMessage ? (
                <p className="mt-2 text-xs text-rose-700">{deleteMessage}</p>
              ) : null}
            </div>
          </div>
        </div>
      </section>
      <AppFooter strings={strings} />
    </main>
  );
}
