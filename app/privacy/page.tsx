import AppFooter from "../../components/AppFooter";
import {getTranslations} from "../../libs/i18n";
import config from "../../config";
import Link from "next/link";

export default function PrivacyPage() {
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
          <h1 className="text-2xl font-semibold text-main">Privacy Policy</h1>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-subtle">
            Last updated: February 6, 2026
          </p>
          <p className="mt-4 text-sm text-muted">
            This policy explains how DotSpan collects, uses, and protects your
            information when you use our website and services.
          </p>

          <div className="mt-6 grid gap-5 text-sm text-main">
            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">1. Information We Collect</h2>
              <p>
                Account data such as name, email, and profile details you enter
                (for example: date of birth, country, profession, preferences).
              </p>
              <p>
                Timeline data you create, including milestones or highlights you
                choose to store.
              </p>
              <p>
                Usage data like device type, browser, and basic log information
                to keep the service reliable and secure.
              </p>
              <p>
                Cookies or local storage for session management and preferences.
              </p>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">2. How We Use Information</h2>
              <p>Provide, personalize, and improve DotSpan.</p>
              <p>Sync your timeline across devices.</p>
              <p>Send reminders you opt into, such as weekly emails.</p>
              <p>Maintain security and prevent abuse.</p>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">3. Sharing</h2>
              <p>
                We do not sell your data. We only share it with service
                providers needed to run DotSpan (for example: authentication,
                email delivery, and payment processing).
              </p>
              <p>
                If you enable a public share link, the content you choose to
                share is visible to anyone with the link.
              </p>
              <p>
                We may disclose information if required by law.
              </p>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">4. Data Retention</h2>
              <p>
                We keep your data while your account is active. You can request
                deletion at any time.
              </p>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">5. Security</h2>
              <p>
                We use industry‑standard safeguards to protect your data, but no
                system can be 100% secure.
              </p>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">6. Your Choices</h2>
              <p>You can opt out of reminders at any time.</p>
              <p>You can disable public sharing links.</p>
              <p>You can update or delete your account data.</p>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">7. Children</h2>
              <p>
                DotSpan is not intended for children under 13. We do not
                knowingly collect data from children.
              </p>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">8. Changes</h2>
              <p>
                We may update this policy from time to time. We will post
                updates here and adjust the date above.
              </p>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold text-main">9. Contact</h2>
              <p>
                Questions or requests? Email us at{" "}
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
