"use client";

import {useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import type {SupabaseClient} from "@supabase/supabase-js";
import config from "../config";

type PlanId = "yearly" | "lifetime";

type UpgradeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  supabase: SupabaseClient | null;
  userId: string | null;
  email: string | null;
  name?: string;
  hasAccess: boolean;
  onSignIn: () => Promise<void>;
};

const featureItems = [
  {
    id: "pdf",
    icon: "✦",
    label: "Print-ready export",
    detail: "Save clean timeline output as PDF."
  },
  {
    id: "editor",
    icon: "◌",
    label: "Ready-for-print editor",
    detail: "Adjust paper size, color, and typography."
  },
  {
    id: "paper",
    icon: "▣",
    label: "Paper presets",
    detail: "Letter and A4 presets built in."
  },
  {
    id: "restore",
    icon: "↺",
    label: "Purchase restore",
    detail: "Restore access from billing anytime."
  }
] as const;

export default function UpgradeModal({
  isOpen,
  onClose,
  supabase,
  userId,
  email,
  name,
  hasAccess,
  onSignIn
}: UpgradeModalProps) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("lifetime");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const yearlyPrice = Number(config.freemius?.plans?.yearly?.price ?? 18);
  const lifetimePrice = Number(config.freemius?.plans?.lifetime?.price ?? 48);
  const yearlyMonthlyPrice = useMemo(() => (yearlyPrice / 12).toFixed(2), [yearlyPrice]);

  const ctaLabel = selectedPlan === "lifetime" ? "Get Lifetime Access" : "Get Yearly Access";
  const ctaPrice = selectedPlan === "lifetime" ? `$${lifetimePrice}` : `$${yearlyPrice}`;

  const handleCheckout = async () => {
    if (isLoading) return;
    if (hasAccess) {
      onClose();
      router.push("/settings?tab=billing");
      return;
    }
    if (!userId || !email) {
      await onSignIn();
      return;
    }
    if (!supabase) {
      setError("Authentication is not ready. Try again.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const {data: sessionData} = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch("/api/freemius/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          plan: selectedPlan,
          userId,
          name: name?.trim() || undefined,
          email: email || undefined
        })
      });

      const data = (await response.json().catch(() => null)) as
        | {url?: string; error?: string}
        | null;

      if (!response.ok || !data?.url) {
        throw new Error(data?.error || "Unable to start checkout.");
      }

      window.location.href = data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to start checkout.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = () => {
    if (!userId) {
      void onSignIn();
      return;
    }
    onClose();
    router.push("/settings?tab=billing");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-3 py-4 sm:px-4 sm:py-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] overflow-hidden rounded-[28px] border border-[#ece8e2] bg-[#fbfaf8] p-4 shadow-[0_28px_80px_rgba(15,23,42,0.32)] sm:p-5"
        style={{
          maxHeight: "min(650px, calc(100vh - 20px))",
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(201,106,50,0.09) 1px, transparent 0)",
          backgroundSize: "16px 16px"
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-[#c96a32] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_6px_16px_rgba(201,106,50,0.3)]">
            DotSpan Plus
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-[26px] leading-none text-[#8b8278] transition hover:text-[#221f1b]"
            aria-label="Close upgrade modal"
          >
            ×
          </button>
        </div>

        <div className="mt-2">
          <h2 className="text-center text-[52px] font-semibold leading-[0.95] text-[#201b18]">
            Unlock everything
          </h2>
          <p className="mt-2 text-center text-[15px] leading-6 text-[#746d66]">
            Create, export, and keep your timeline forever.
          </p>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setSelectedPlan("yearly")}
              className={`rounded-3xl border p-3 text-left transition ${
                selectedPlan === "yearly"
                  ? "border-[#c96a32] bg-[#fff8f2]"
                  : "border-[#e6e1da] bg-[#fffdfb] hover:border-[#d8d1c7]"
              }`}
            >
              <div
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-[9px] ${
                  selectedPlan === "yearly"
                    ? "border-[#c96a32] text-[#c96a32]"
                    : "border-[#d8d1c7] text-transparent"
                }`}
              >
                ●
              </div>
              <p className="mt-1 text-sm font-semibold text-[#211d19]">Yearly</p>
              <p className="mt-1 text-[33px] font-medium leading-none text-[#1f1b18]">${yearlyPrice}</p>
              <p className="mt-1 text-[13px] text-[#80786f]">/ year</p>
              <p className="mt-2 text-[13px] text-[#80786f]">${yearlyMonthlyPrice}/mo</p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPlan("lifetime")}
              className={`relative rounded-3xl border p-3 text-left transition ${
                selectedPlan === "lifetime"
                  ? "border-[#c96a32] bg-[#fff8f2]"
                  : "border-[#e6e1da] bg-[#fffdfb] hover:border-[#d8d1c7]"
              }`}
            >
              <span className="absolute -top-2.5 right-3 rounded-full bg-[#c96a32] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-white">
                Best value
              </span>
              <div
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-[9px] ${
                  selectedPlan === "lifetime"
                    ? "border-[#c96a32] text-[#c96a32]"
                    : "border-[#d8d1c7] text-transparent"
                }`}
              >
                ●
              </div>
              <p className="mt-1 text-sm font-semibold text-[#211d19]">Lifetime</p>
              <p className="mt-1 text-[33px] font-medium leading-none text-[#1f1b18]">${lifetimePrice}</p>
              <p className="mt-1 text-[13px] text-[#80786f]">once</p>
              <p className="mt-2 text-[13px] text-[#80786f]">Pay once, yours forever</p>
            </button>
          </div>

          <div className="mt-4 divide-y divide-[#ece8e2] border-y border-[#ece8e2] bg-[#fbfaf8]">
            {featureItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#fff1e7] text-sm text-[#c96a32]">
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-sm font-medium leading-5 text-[#211d19]">{item.label}</p>
                    <p className="text-xs text-[#80786f]">{item.detail}</p>
                  </div>
                </div>
                <span className="text-base text-[#0f9f49]">✓</span>
              </div>
            ))}
          </div>

          {error ? (
            <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => void handleCheckout()}
            disabled={isLoading}
            className="mt-4 w-full rounded-2xl bg-[#c96a32] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#b85e29] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Starting checkout..." : `${ctaLabel} - ${ctaPrice}`}
          </button>

          <div className="mt-3 flex items-center justify-center gap-3 text-sm text-[#80786f]">
            <button
              type="button"
              onClick={handleRestore}
              className="transition hover:text-[#201b18]"
            >
              Restore purchase
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={onClose}
              className="transition hover:text-[#201b18]"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
