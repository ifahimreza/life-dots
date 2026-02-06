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
  {id: "creation", label: "Unlimited creation"},
  {id: "styles", label: "Custom style & font options"},
  {id: "prints", label: "High-resolution print exports"},
  {id: "backup", label: "Auto backups for your timelines"}
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
        className="w-full max-w-[860px] rounded-[28px] border border-surface bg-white p-5 shadow-[0_30px_100px_rgba(0,0,0,0.25)] sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-xl leading-none text-muted transition hover:text-main"
            aria-label="Close upgrade modal"
          >
            ×
          </button>
        </div>

        <div className="mx-auto max-w-[720px]">
          <div className="mx-auto inline-flex items-center rounded-full bg-[#c96a32] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white">
            DotSpan Plus
          </div>
          <h2 className="mt-4 text-center text-4xl font-semibold leading-tight text-main">
            Unlock everything
          </h2>
          <p className="mt-3 text-center text-lg text-muted">
            Create, export, and keep your timelines forever.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setSelectedPlan("yearly")}
              className={`rounded-3xl border p-5 text-left transition ${
                selectedPlan === "yearly"
                  ? "border-[#c96a32] bg-[#fff9f5]"
                  : "border-surface bg-white hover:border-neutral-300"
              }`}
            >
              <div className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-[10px]">
                {selectedPlan === "yearly" ? "●" : ""}
              </div>
              <p className="mt-3 text-3xl font-semibold text-main">${yearlyPrice}</p>
              <p className="text-lg text-muted">/ year</p>
              <p className="mt-3 text-sm text-muted">${yearlyMonthlyPrice} / mo</p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPlan("lifetime")}
              className={`relative rounded-3xl border p-5 text-left transition ${
                selectedPlan === "lifetime"
                  ? "border-[#c96a32] bg-[#fff9f5]"
                  : "border-surface bg-white hover:border-neutral-300"
              }`}
            >
              <span className="absolute -top-3 left-4 rounded-full bg-[#c96a32] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                Best value
              </span>
              <div className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-[10px]">
                {selectedPlan === "lifetime" ? "●" : ""}
              </div>
              <p className="mt-3 text-3xl font-semibold text-main">${lifetimePrice}</p>
              <p className="text-lg text-muted">once</p>
              <p className="mt-3 text-sm text-muted">Pay once, yours forever</p>
            </button>
          </div>

          <div className="mt-7 divide-y divide-surface border-y border-surface">
            {featureItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff5ed] text-[#c96a32]">
                    ✦
                  </span>
                  <span className="text-lg text-main">{item.label}</span>
                </div>
                <span className="text-lg text-[#16a34a]">✓</span>
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
            className="mt-6 w-full rounded-2xl bg-[#c96a32] px-6 py-4 text-lg font-semibold text-white transition hover:bg-[#b85e29] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Starting checkout..." : `${ctaLabel} — ${ctaPrice}`}
          </button>

          <div className="mt-4 flex items-center justify-center gap-3 text-base text-muted">
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

