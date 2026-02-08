"use client";

import Link from "next/link";
import type {FormEvent} from "react";
import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import AppFooter from "../../components/AppFooter";
import GoogleButton from "../../components/GoogleButton";
import {LanguageId} from "../../libs/lifeDotsData";
import {UiStrings, getTranslations} from "../../libs/i18n";
import {loadStoredProfile} from "../../libs/profile";
import {useSupabaseAuth} from "../../libs/useSupabaseAuth";

type PortalSubscription = {
  planTitle?: string;
  billingCycle?: string | null;
  renewalAmount?: number;
  currency?: string;
  renewalDate?: string | null;
  isActive?: boolean;
  isTrial?: boolean;
  trialEnds?: string | null;
  paymentMethod?: string | null;
  cancelRenewalUrl?: string | null;
};

type PortalPayment = {
  invoiceUrl?: string;
  planTitle?: string;
  createdAt?: string;
  paymentMethod?: string | null;
  total_gross?: number;
  currency?: string;
};

type PortalBilling = {
  updateUrl?: string;
};

type PortalData = {
  subscriptions?: {
    primary?: PortalSubscription | null;
  };
  payments?: PortalPayment[] | null;
  billing?: PortalBilling | null;
};

const EMPTY_BILLING_FORM = {
  business_name: "",
  tax_id: "",
  phone: "",
  address_apt: "",
  address_street: "",
  address_city: "",
  address_state: "",
  address_country_code: "",
  address_zip: ""
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  const normalized = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString();
}

export default function SettingsPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<LanguageId>("default");
  const [activeTab, setActiveTab] = useState<"account" | "billing">("account");
  const [portalData, setPortalData] = useState<PortalData | null>(null);
  const [portalError, setPortalError] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [billingForm, setBillingForm] = useState(EMPTY_BILLING_FORM);
  const [billingSaving, setBillingSaving] = useState(false);
  const [billingMessage, setBillingMessage] = useState<string | null>(null);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  const {
    supabase,
    userId,
    email,
    hasAccess,
    isLoading: isAuthLoading,
    signInWithGoogle,
    signOut
  } = useSupabaseAuth({redirectPath: "/settings"});

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
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "billing") {
      setActiveTab("billing");
      return;
    }
    setActiveTab("account");
  }, []);

  const loadPortalData = async () => {
    if (!supabase) return;
    const {data: sessionData} = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) return;
    setPortalLoading(true);
    setPortalError(null);
    try {
      const response = await fetch(
        `/api/freemius/portal?action=portal_data`,
        {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to load billing portal.");
      }
      const data = (await response.json()) as PortalData | null;
      setPortalData(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load billing data.";
      setPortalError(message);
      setPortalData(null);
    } finally {
      setPortalLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "billing") return;
    if (!userId) return;
    void loadPortalData();
  }, [activeTab, userId]);

  const primarySubscription = portalData?.subscriptions?.primary ?? null;

  const handleBillingSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!portalData?.billing?.updateUrl) return;
    setBillingSaving(true);
    setBillingMessage(null);
    try {
      const payload = Object.fromEntries(
        Object.entries(billingForm).filter(([, value]) => value.trim().length > 0)
      );
      const response = await fetch(portalData.billing.updateUrl, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Billing update failed.");
      }
      setBillingMessage("Billing info updated.");
      setBillingForm(EMPTY_BILLING_FORM);
      await loadPortalData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Billing update failed.";
      setBillingMessage(message);
    } finally {
      setBillingSaving(false);
    }
  };

  const handleCancelRenewal = async () => {
    if (!primarySubscription?.cancelRenewalUrl || isCancelling) return;
    const confirmed = window.confirm("Cancel your subscription renewal?");
    if (!confirmed) return;
    setIsCancelling(true);
    setCancelMessage(null);
    try {
      const response = await fetch(primarySubscription.cancelRenewalUrl, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({})
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Cancellation failed.");
      }
      setCancelMessage("Subscription cancellation requested.");
      await loadPortalData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Cancellation failed.";
      setCancelMessage(message);
    } finally {
      setIsCancelling(false);
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
    <main className="flex min-h-screen flex-col py-4 sm:py-6">
      <section className="mx-auto flex w-full max-w-[980px] flex-1 flex-col gap-6 px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-muted transition hover:text-neutral-800"
          >
            ← Back to DotSpan
          </Link>
          <div className="text-base font-semibold sm:text-lg text-main">
            <span className="title-main">Settings</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("account")}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
              activeTab === "account"
                ? "bg-neutral-900 text-white"
                : "border border-surface text-muted hover:border-neutral-300 hover:text-neutral-700"
            }`}
          >
            My account
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("billing")}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
              activeTab === "billing"
                ? "bg-neutral-900 text-white"
                : "border border-surface text-muted hover:border-neutral-300 hover:text-neutral-700"
            }`}
          >
            Billing
          </button>
        </div>

        {activeTab === "account" ? (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl surface-card p-5 shadow-soft sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
                Account
              </p>
              <h1 className="mt-3 text-2xl font-semibold text-main sm:text-3xl">
                Your profile and access.
              </h1>
              <p className="mt-3 text-sm text-muted">
                Manage your login and view your Plus access status.
              </p>
            </div>

            <div className="rounded-3xl surface-card p-5 shadow-soft sm:p-6">
              {isAuthLoading ? (
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
                  Checking account status...
                </div>
              ) : userId ? (
                <div className="grid gap-4 text-sm text-main">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
                      Email
                    </p>
                    <p className="mt-1 text-sm font-semibold text-main">{email ?? "—"}</p>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
                    {hasAccess ? "Plus access is active." : "Basic plan. Upgrade for Plus features."}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={signOut}
                      className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-700 transition hover:border-neutral-400"
                    >
                      Sign out
                    </button>
                    <Link
                      href="/?upgrade=1"
                      className="rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
                    >
                      Go Plus
                    </Link>
                  </div>
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
                      Danger zone
                    </p>
                    <p className="mt-2 text-xs text-rose-700">
                      Delete your account and profile data in one click.
                    </p>
                    <button
                      type="button"
                      onClick={() => void handleDeleteAccount()}
                      disabled={isDeleting}
                      className="mt-3 inline-flex items-center justify-center rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isDeleting ? "Deleting..." : "Delete account"}
                    </button>
                    {deleteMessage ? (
                      <p className="mt-2 text-xs text-rose-700">{deleteMessage}</p>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
                  <p className="font-semibold">Sign in to manage your account.</p>
                  <div className="mt-3">
                    <GoogleButton onClick={signInWithGoogle} size="sm" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {activeTab === "billing" ? (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl surface-card p-5 shadow-soft sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
                Billing
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-main sm:text-3xl">
                Manage your subscription.
              </h2>
              <p className="mt-3 text-sm text-muted">
                Update billing details, view invoices, and cancel renewals.
              </p>
            </div>

            <div className="rounded-3xl surface-card p-5 shadow-soft sm:p-6">
              {isAuthLoading ? (
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
                  Checking account status...
                </div>
              ) : !userId ? (
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
                  <p className="font-semibold">Sign in to access billing.</p>
                  <div className="mt-3">
                    <GoogleButton onClick={signInWithGoogle} size="sm" />
                  </div>
                </div>
              ) : portalLoading ? (
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
                  Loading billing portal...
                </div>
              ) : portalError ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  {portalError}
                </div>
              ) : (
                <div className="grid gap-4 text-sm text-main">
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
                      Subscription
                    </p>
                    {primarySubscription ? (
                      <div className="mt-3 grid gap-2">
                        <div className="text-lg font-semibold text-main">
                          {primarySubscription.planTitle ?? "Plus"}
                        </div>
                        <div className="text-sm text-muted">
                          {primarySubscription.billingCycle
                            ? `${primarySubscription.billingCycle} billing`
                            : "One-time access"}
                        </div>
                        <div className="text-sm text-muted">
                          Renewal: {formatDate(primarySubscription.renewalDate)}
                        </div>
                        <div className="text-sm text-muted">
                          Amount:{" "}
                          {primarySubscription.renewalAmount ?? "—"}{" "}
                          {primarySubscription.currency ?? ""}
                        </div>
                        <div className="text-sm text-muted">
                          Payment method: {primarySubscription.paymentMethod ?? "—"}
                        </div>
                        {primarySubscription.isTrial ? (
                          <div className="text-sm text-amber-700">
                            Trial ends: {formatDate(primarySubscription.trialEnds)}
                          </div>
                        ) : null}
                        <div className="text-sm font-semibold">
                          Status: {primarySubscription.isActive ? "Active" : "Inactive"}
                        </div>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-muted">No active subscription found.</p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
                      Cancellation
                    </p>
                    <button
                      type="button"
                      onClick={handleCancelRenewal}
                      disabled={isCancelling || !primarySubscription?.cancelRenewalUrl}
                      className="mt-3 inline-flex items-center justify-center rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-700 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isCancelling ? "Processing..." : "Cancel renewal"}
                    </button>
                    {!primarySubscription?.cancelRenewalUrl ? (
                      <p className="mt-2 text-xs text-muted">
                        No cancellable renewal is available for this plan.
                      </p>
                    ) : null}
                    {cancelMessage ? (
                      <p className="mt-2 text-xs text-muted">{cancelMessage}</p>
                    ) : null}
                  </div>

                  {portalData?.billing?.updateUrl ? (
                    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
                        Billing info
                      </p>
                      <form onSubmit={handleBillingSubmit} className="mt-3 grid gap-3">
                        <input
                          className="w-full rounded-2xl border border-neutral-200 px-4 py-2 text-sm"
                          placeholder="Business name"
                          value={billingForm.business_name}
                          onChange={(event) =>
                            setBillingForm((prev) => ({
                              ...prev,
                              business_name: event.target.value
                            }))
                          }
                        />
                        <input
                          className="w-full rounded-2xl border border-neutral-200 px-4 py-2 text-sm"
                          placeholder="Tax ID"
                          value={billingForm.tax_id}
                          onChange={(event) =>
                            setBillingForm((prev) => ({
                              ...prev,
                              tax_id: event.target.value
                            }))
                          }
                        />
                        <input
                          className="w-full rounded-2xl border border-neutral-200 px-4 py-2 text-sm"
                          placeholder="Phone"
                          value={billingForm.phone}
                          onChange={(event) =>
                            setBillingForm((prev) => ({
                              ...prev,
                              phone: event.target.value
                            }))
                          }
                        />
                        <input
                          className="w-full rounded-2xl border border-neutral-200 px-4 py-2 text-sm"
                          placeholder="Address"
                          value={billingForm.address_street}
                          onChange={(event) =>
                            setBillingForm((prev) => ({
                              ...prev,
                              address_street: event.target.value
                            }))
                          }
                        />
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            className="w-full rounded-2xl border border-neutral-200 px-4 py-2 text-sm"
                            placeholder="City"
                            value={billingForm.address_city}
                            onChange={(event) =>
                              setBillingForm((prev) => ({
                                ...prev,
                                address_city: event.target.value
                              }))
                            }
                          />
                          <input
                            className="w-full rounded-2xl border border-neutral-200 px-4 py-2 text-sm"
                            placeholder="State"
                            value={billingForm.address_state}
                            onChange={(event) =>
                              setBillingForm((prev) => ({
                                ...prev,
                                address_state: event.target.value
                              }))
                            }
                          />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            className="w-full rounded-2xl border border-neutral-200 px-4 py-2 text-sm"
                            placeholder="Country code"
                            value={billingForm.address_country_code}
                            onChange={(event) =>
                              setBillingForm((prev) => ({
                                ...prev,
                                address_country_code: event.target.value
                              }))
                            }
                          />
                          <input
                            className="w-full rounded-2xl border border-neutral-200 px-4 py-2 text-sm"
                            placeholder="Postal code"
                            value={billingForm.address_zip}
                            onChange={(event) =>
                              setBillingForm((prev) => ({
                                ...prev,
                                address_zip: event.target.value
                              }))
                            }
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={billingSaving}
                          className="mt-2 inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:cursor-not-allowed disabled:bg-neutral-300"
                        >
                          {billingSaving ? "Saving..." : "Update billing"}
                        </button>
                        {billingMessage ? (
                          <p className="text-xs text-muted">{billingMessage}</p>
                        ) : null}
                      </form>
                    </div>
                  ) : null}

                  <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
                      Invoices
                    </p>
                    {portalData?.payments?.length ? (
                      <ul className="mt-3 grid gap-2 text-sm text-muted">
                        {portalData.payments.map((payment, index) => (
                          <li
                            key={`${payment.invoiceUrl ?? "invoice"}-${index}`}
                            className="flex flex-wrap items-center justify-between gap-2"
                          >
                            <div>
                              <div className="text-sm font-semibold text-main">
                                {payment.planTitle ?? "Payment"}
                              </div>
                              <div className="text-xs text-muted">
                                {formatDate(payment.createdAt)}
                              </div>
                            </div>
                            {payment.invoiceUrl ? (
                              <a
                                href={payment.invoiceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full border border-neutral-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-700 transition hover:border-neutral-400"
                              >
                                Download
                              </a>
                            ) : (
                              <span className="text-xs text-muted">No invoice</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm text-muted">No invoices yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </section>
      <AppFooter strings={strings} />
    </main>
  );
}
