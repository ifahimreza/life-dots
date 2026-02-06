import AppFooter from "../../components/AppFooter";
import {getTranslations} from "../../libs/i18n";
import config from "../../config";
import Link from "next/link";

export default function RefundPage() {
  const strings = getTranslations("default", "en");
  const supportEmail = config.supportEmail || "support@dotspan.life";

  return (
    <main className="flex min-h-screen flex-col py-6">
      <section className="mx-auto flex w-full max-w-[860px] flex-1 flex-col gap-6 px-4 sm:px-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-surface px-3 py-1.5 text-xs font-semibold text-main transition hover:bg-neutral-50"
          >
            <span aria-hidden="true">←</span>
            <span>Back</span>
          </Link>
        </div>
        <div className="rounded-3xl surface-card p-6 shadow-soft">
          <h1 className="text-2xl font-semibold text-main">Refund Policy</h1>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-subtle">
            Last updated: February 6, 2026
          </p>
          <p className="mt-4 text-sm text-muted">
            DotSpan offers a 7-day refund window for new paid purchases.
          </p>

          <div className="mt-6 grid gap-5 text-sm text-main">
            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">1. 7-Day Refund Window</h2>
              <p>
                You can request a full refund within 7 calendar days from the
                original purchase time.
              </p>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">2. Eligibility</h2>
              <p>
                This applies to first-time purchases of DotSpan paid plans
                (monthly, yearly, or lifetime), unless required otherwise by
                local law.
              </p>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">3. After 7 Days</h2>
              <p>
                After 7 days, payments are non-refundable.
              </p>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">4. How to Request</h2>
              <p>
                Email{" "}
                <span className="font-semibold text-main">{supportEmail}</span>{" "}
                with:
              </p>
              <p>Your account email used for purchase.</p>
              <p>Purchase date and plan (monthly/yearly/lifetime).</p>
              <p>Reason for refund (optional but helpful).</p>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">5. Processing</h2>
              <p>
                Approved refunds are processed to the original payment method.
                Processing times depend on your payment provider and bank.
              </p>
            </div>
          </div>
        </div>
      </section>
      <AppFooter strings={strings} />
    </main>
  );
}
