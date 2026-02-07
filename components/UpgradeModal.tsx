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
    icon: "🖨",
    label: "Print-ready export",
    detail: "Open a clean print view and save as PDF."
  },
  {
    id: "editor",
    icon: "🎛",
    label: "Ready-for-print editor",
    detail: "Adjust size, paper, colors, and typography."
  },
  {
    id: "paper",
    icon: "📄",
    label: "Paper presets",
    detail: "Export tuned for Letter and A4."
  },
  {
    id: "restore",
    icon: "♻️",
    label: "Purchase restore",
    detail: "Restore Plus access from billing anytime."
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

  const selectedPrice = selectedPlan === "lifetime" ? lifetimePrice : yearlyPrice;
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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/35 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[410px] overflow-hidden rounded-2xl border border-surface bg-white p-4 shadow-[0_24px_70px_rgba(0,0,0,0.25)] sm:p-5"
        style={{maxHeight: "min(650px, calc(100vh - 24px))"}}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-[#c96a32] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
            DotSpan Plus
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-xl leading-none text-muted transition hover:text-main"
            aria-label="Close upgrade modal"
          >
            ×
          </button>
        </div>

        <div className="mt-2">
          <h2 className="text-center text-[34px] font-semibold leading-tight text-main">
            Unlock everything
          </h2>
          <p className="mt-1 text-center text-sm leading-5 text-muted">
            Build your timeline and export clean print-ready versions.
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setSelectedPlan("yearly")}
              className={`rounded-2xl border p-3 text-left transition ${
                selectedPlan === "yearly"
                  ? "border-[#c96a32] bg-[#fff9f5]"
                  : "border-surface bg-white hover:border-neutral-300"
              }`}
            >
              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 text-[9px]">
                {selectedPlan === "yearly" ? "●" : ""}
              </div>
              <p className="mt-1 text-sm font-semibold text-main">Yearly</p>
              <p className="mt-1 text-[34px] font-semibold leading-none text-main">${yearlyPrice}</p>
              <p className="text-sm text-muted">${yearlyMonthlyPrice}/mo</p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPlan("lifetime")}
              className={`relative rounded-2xl border p-3 text-left transition ${
                selectedPlan === "lifetime"
                  ? "border-[#c96a32] bg-[#fff9f5]"
                  : "border-surface bg-white hover:border-neutral-300"
              }`}
            >
              <span className="absolute -top-2.5 left-3 rounded-full bg-[#c96a32] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-white">
                Best value
              </span>
              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 text-[9px]">
                {selectedPlan === "lifetime" ? "●" : ""}
              </div>
              <p className="mt-1 text-sm font-semibold text-main">Lifetime</p>
              <p className="mt-1 text-[34px] font-semibold leading-none text-main">${lifetimePrice}</p>
              <p className="text-sm text-muted">Pay once</p>
            </button>
          </div>

          <div className="mt-4 divide-y divide-surface border-y border-surface">
            {featureItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#fff5ed] text-sm">
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-sm font-medium leading-5 text-main">{item.label}</p>
                    <p className="text-xs text-muted">{item.detail}</p>
                  </div>
                </div>
                <span className="text-base text-[#16a34a]">✓</span>
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
            className="mt-4 w-full rounded-xl bg-[#c96a32] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#b85e29] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Starting checkout..." : `${ctaLabel} — ${ctaPrice}`}
          </button>

          <div className="mt-3 flex items-center justify-center gap-3 text-sm text-muted">
            <button
              type="button"
              onClick={handleRestore}
              className="transition hover:text-main"
            >
              Restore purchase
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={onClose}
              className="transition hover:text-main"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
