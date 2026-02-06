import AppFooter from "../../components/AppFooter";
import {getTranslations} from "../../libs/i18n";
import config from "../../config";
import Link from "next/link";

export default function TermsPage() {
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
          <h1 className="text-2xl font-semibold text-main">Terms of Service</h1>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-subtle">
            Last updated: February 6, 2026
          </p>
          <p className="mt-4 text-sm text-muted">
            These terms govern your use of DotSpan. By using DotSpan, you agree
            to these terms.
          </p>

          <div className="mt-6 grid gap-5 text-sm text-main">
            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">1. Eligibility</h2>
              <p>You must be at least 13 years old to use DotSpan.</p>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">2. Your Account</h2>
              <p>You are responsible for keeping your account secure.</p>
              <p>Provide accurate information so your timeline works properly.</p>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">3. The Service</h2>
              <p>
                DotSpan provides a timeline view of life, reminders you opt
                into, export tools, and optional public share links.
              </p>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">4. Paid Plans</h2>
              <p>
                Pro features require payment. Prices, billing terms, and taxes
                are shown at checkout.
              </p>
              <p>
                Payments are handled by our payment provider. Please contact
                support if you have billing issues.
              </p>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">5. Your Content</h2>
              <p>You retain ownership of content you create in DotSpan.</p>
              <p>
                You grant DotSpan a limited license to host and display your
                content in order to provide the service.
              </p>
              <p>
                Public share links are read‑only and can be accessed by anyone
                with the link.
              </p>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">6. Acceptable Use</h2>
              <p>Do not misuse or interfere with the service.</p>
              <p>Do not attempt to access data that is not yours.</p>
              <p>Do not use DotSpan for unlawful activities.</p>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">7. Intellectual Property</h2>
              <p>
                DotSpan and its design are protected by intellectual property
                laws. You may not copy or resell the service.
              </p>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">8. Disclaimers</h2>
              <p>
                DotSpan is provided “as is” without warranties of any kind.
              </p>
              <p>
                DotSpan is not a medical or professional advice tool.
              </p>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, DotSpan is not liable
                for indirect, incidental, or consequential damages.
              </p>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">10. Termination</h2>
              <p>
                We may suspend or terminate access if these terms are violated.
              </p>
              <p>You may stop using DotSpan at any time.</p>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">11. Changes</h2>
              <p>
                We may update these terms. Continued use of DotSpan means you
                accept the updated terms.
              </p>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">12. Contact</h2>
              <p>
                Questions about these terms? Email{" "}
                <span className="font-semibold text-main">{supportEmail}</span>.
              </p>
            </div>
          </div>
        </div>
      </section>
      <AppFooter strings={strings} />
    </main>
  );
}
