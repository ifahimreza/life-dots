"use client";

import Link from "next/link";
import type {FormEvent} from "react";
import {useCallback, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import GoogleButton from "../../components/GoogleButton";
import TurnstileWidget from "../../components/TurnstileWidget";
import {getRedirectUrl} from "../../libs/appUrl";
import {getSupabaseClient} from "../../libs/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [nextPath, setNextPath] = useState<string | null>(null);
  const router = useRouter();
  const supabase = getSupabaseClient();
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const next = new URLSearchParams(window.location.search).get("next") ?? "";
    if (!next.startsWith("/") || next.startsWith("//")) return;
    setNextPath(next);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let isActive = true;
    const checkSession = async () => {
      try {
        const {data} = await supabase.auth.getSession();
        if (!isActive) return;
        if (data.session?.user) {
          router.replace(nextPath ?? "/dashboard");
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
      }
    };
    void checkSession();
    return () => {
      isActive = false;
    };
  }, [nextPath, router, supabase]);

  const redirectTo = getRedirectUrl(nextPath ?? "/onboarding");
  const isCaptchaReady = Boolean(turnstileSiteKey && captchaToken);

  const handleCaptchaTokenChange = useCallback((token: string | null) => {
    setCaptchaToken(token);
  }, []);

  const validateCaptcha = useCallback(() => {
    if (!turnstileSiteKey) {
      setError("Security check is unavailable. Please contact support.");
      return false;
    }
    if (!captchaToken) {
      setError("Please complete the security check to continue.");
      return false;
    }
    return true;
  }, [captchaToken, turnstileSiteKey]);

  const handleGoogle = async () => {
    if (!supabase) return;
    if (!validateCaptcha()) return;
    setError(null);
    setStatus(null);
    setIsGoogleSubmitting(true);
    try {
      const {error: oauthError} = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          ...(redirectTo ? {redirectTo} : {}),
          queryParams: {captcha_token: captchaToken as string}
        }
      });
      if (oauthError) {
        throw oauthError;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to continue with Google.";
      setError(message);
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || !email.trim()) return;
    if (!validateCaptcha()) return;
    setIsSubmitting(true);
    setError(null);
    setStatus(null);
    try {
      const {error: otpError} = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          ...(redirectTo ? {emailRedirectTo: redirectTo} : {}),
          captchaToken: captchaToken as string
        }
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
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-10">
      <section className="w-full max-w-[360px] rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#00c565]/10 text-[#00c565]">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <circle cx="6" cy="6" r="2.2" />
              <circle cx="12" cy="6" r="2.2" />
              <circle cx="18" cy="6" r="2.2" />
              <circle cx="6" cy="12" r="2.2" />
              <circle cx="12" cy="12" r="2.2" />
              <circle cx="18" cy="12" r="2.2" />
              <circle cx="6" cy="18" r="2.2" />
              <circle cx="12" cy="18" r="2.2" />
              <circle cx="18" cy="18" r="2.2" />
            </svg>
          </span>
          <span className="text-sm font-semibold tracking-wide text-main">DotSpan</span>
        </div>
        <h1 className="mt-5 text-[23px] font-semibold leading-tight text-main">
          Welcome back
        </h1>

        <div className="mt-5 grid gap-3">
          <GoogleButton
            onClick={handleGoogle}
            disabled={isGoogleSubmitting || isSubmitting || !isCaptchaReady}
            className="!rounded-xl !border !border-neutral-300 !bg-white !text-neutral-800 !shadow-none hover:!border-neutral-400 hover:!bg-neutral-50"
          />
          {turnstileSiteKey ? (
            <div className="mt-1 overflow-hidden rounded-xl border border-neutral-200 px-2 py-2">
              <TurnstileWidget
                siteKey={turnstileSiteKey}
                onTokenChange={handleCaptchaTokenChange}
              />
            </div>
          ) : (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              Security check unavailable. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY.
            </p>
          )}
        </div>

        <div className="my-6 h-px w-full bg-neutral-200" />

        <form onSubmit={handleEmail} className="grid gap-3">
          <label className="text-sm font-semibold text-main">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8cdf8]"
            required
          />
          <button
            type="submit"
            disabled={!email.trim() || isSubmitting || !isCaptchaReady}
            className="mt-2 w-full rounded-xl bg-[#00c565] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#00ae59] disabled:cursor-not-allowed disabled:bg-neutral-300"
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

        <p className="mt-5 text-xs text-muted">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-2 text-neutral-700">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-2 text-neutral-700">
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
