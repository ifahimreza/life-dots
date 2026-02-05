"use client";

import Link from "next/link";
import type {FormEvent} from "react";
import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import AppFooter from "../../components/AppFooter";
import LogoMark from "../../components/LogoMark";
import {LanguageId} from "../../libs/lifeDotsData";
import {UiStrings, getTranslations} from "../../libs/i18n";
import {loadStoredProfile} from "../../libs/profile";
import {getSupabaseClient} from "../../libs/supabaseClient";

export default function LoginPage() {
  const [language, setLanguage] = useState<LanguageId>("default");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseClient();

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
    if (!supabase) return;
    supabase.auth.getSession().then(({data}) => {
      if (data.session?.user) {
        router.replace("/dashboard");
      }
    });
  }, [router, supabase]);

  const redirectTo =
    typeof window !== "undefined" ? `${window.location.origin}/onboarding` : undefined;

  const handleGoogle = async () => {
    if (!supabase) return;
    setError(null);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: redirectTo ? {redirectTo} : undefined
    });
  };

  const handleEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || !email.trim()) return;
    setIsSubmitting(true);
    setError(null);
    setStatus(null);
    try {
      const {error: otpError} = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: redirectTo ? {emailRedirectTo: redirectTo} : undefined
      });
      if (otpError) {
        throw otpError;
      }
      setStatus("Check your email for a login link.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to send magic link.";
      setError(message);
    } finally {
      setIsSubmitting(false);
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
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to keep your timeline in sync across devices.
          </p>

          <div className="mt-6 grid gap-3">
            <button
              type="button"
              onClick={handleGoogle}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-800 transition hover:border-neutral-400"
            >
              <span className="h-4 w-4 rounded-full bg-white text-center text-[10px] font-bold text-neutral-800">
                G
              </span>
              Continue with Google
            </button>
            <button
              type="button"
              disabled
              className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-400"
            >
              Continue with Apple
            </button>
          </div>

          <div className="my-6 h-px w-full bg-neutral-200" />

          <form onSubmit={handleEmail} className="grid gap-3">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 shadow-sm focus-visible:outline-none focus-brand"
              required
            />
            <button
              type="submit"
              disabled={!email.trim() || isSubmitting}
              className="mt-2 w-full rounded-full bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              {isSubmitting ? "Sending..." : "Continue"}
            </button>
          </form>

          {status ? (
            <p className="mt-3 text-sm text-emerald-700">{status}</p>
          ) : null}
          {error ? (
            <p className="mt-3 text-sm text-rose-700">{error}</p>
          ) : null}

          <p className="mt-6 text-xs text-muted">
            By signing in, you agree to our Terms &amp; Privacy.
            <br />
            New here?{" "}
            <Link href="/signup" className="font-semibold text-neutral-700">
              Create an account
            </Link>
            .
          </p>
        </div>
      </section>
      <AppFooter strings={strings} />
    </main>
  );
}
