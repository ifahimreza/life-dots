import {useEffect} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import LogoMark from "./LogoMark";
import type {UiStrings} from "../libs/i18n";
import {
  playHoverSound,
  playMenuSoundFromGesture,
  unlockAudio
} from "../libs/hoverSound";

type AppHeaderProps = {
  title: string;
  onOpenSettings: () => void;
  onOpenUpgrade: () => void;
  isSignedIn: boolean;
  hasAccess: boolean;
  authEmail?: string | null;
  strings: UiStrings;
};

type NavItem = {
  href: string;
  label: string;
  kind: "home" | "dashboard" | "billing" | "login" | "plus";
};

function isItemActive(pathname: string, item: NavItem) {
  if (item.kind === "home") return pathname === "/" || pathname === "/app";
  if (item.kind === "dashboard") return pathname.startsWith("/dashboard");
  if (item.kind === "billing") return pathname.startsWith("/settings");
  if (item.kind === "login") return pathname.startsWith("/login");
  if (item.kind === "plus") return false;
  return false;
}

function getItemIcon(kind: NavItem["kind"]) {
  if (kind === "home") {
    return (
      <path
        d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5.5a.5.5 0 0 1-.5-.5V15a2 2 0 0 0-4 0v6.5a.5.5 0 0 1-.5.5H4a1 1 0 0 1-1-1v-10.5Z"
        fill="currentColor"
      />
    );
  }
  if (kind === "dashboard") {
    return (
      <path
        d="M4 4h7v7H4V4Zm9 0h7v4h-7V4Zm0 6h7v10h-7V10ZM4 13h7v7H4v-7Z"
        fill="currentColor"
      />
    );
  }
  if (kind === "billing") {
    return (
      <>
        <path d="M3.75 8.25A2.25 2.25 0 0 1 6 6h12a2.25 2.25 0 0 1 2.25 2.25v7.5A2.25 2.25 0 0 1 18 18H6a2.25 2.25 0 0 1-2.25-2.25v-7.5Z" />
        <path d="M3.75 10.5h16.5" />
      </>
    );
  }
  if (kind === "login") {
    return (
      <>
        <path d="M13 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" />
        <path d="M10 17 15 12 10 7" />
        <path d="M15 12H4" />
      </>
    );
  }
  return (
    <>
      <path d="m12 2.5 2.6 5.4 6 .9-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6L3.4 8.8l6-.9L12 2.5Z" />
    </>
  );
}

export default function AppHeader({
  title,
  onOpenSettings,
  onOpenUpgrade,
  isSignedIn,
  hasAccess,
  authEmail,
  strings
}: AppHeaderProps) {
  const pathname = usePathname();
  const avatarLetter = (authEmail?.trim()?.charAt(0) || "U").toUpperCase();
  const navItems: NavItem[] = !isSignedIn
    ? [
        {href: "/", label: "Home", kind: "home"},
        {href: "/login", label: "Login", kind: "login"},
        {href: "#", label: "Plus", kind: "plus"}
      ]
    : hasAccess
    ? [
        {href: "/", label: "Home", kind: "home"},
        {href: "/dashboard", label: "Dashboard", kind: "dashboard"},
        {href: "/settings?tab=billing", label: "Billing", kind: "billing"}
      ]
    : [
        {href: "/", label: "Home", kind: "home"},
        {href: "/dashboard", label: "Dashboard", kind: "dashboard"},
        {href: "/settings?tab=billing", label: "Billing", kind: "billing"},
        {href: "#", label: "Plus", kind: "plus"}
      ];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleUnlock = () => unlockAudio();
    window.addEventListener("pointerdown", handleUnlock, {once: true});
    window.addEventListener("keydown", handleUnlock, {once: true});
    return () => {
      window.removeEventListener("pointerdown", handleUnlock);
      window.removeEventListener("keydown", handleUnlock);
    };
  }, []);

  return (
    <header
      className="mb-8 flex flex-col gap-4 rounded-[30px] border border-surface bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 overflow-hidden rounded-2xl border border-surface bg-white/90">
          <LogoMark className="h-full w-full" />
        </div>
        <div className="flex items-center gap-2 text-base font-semibold sm:gap-3 sm:text-lg">
          <span className="title-main">{title}</span>
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const active = isItemActive(pathname, item);
            const isPlusItem = item.kind === "plus";
            const nextHref = item.href;
            const nextLabel = item.label;
            const showAvatar = item.kind === "dashboard" && isSignedIn && hasAccess;
            const iconNode = showAvatar ? (
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-semibold text-white">
                {avatarLetter}
              </span>
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill={item.kind === "home" || item.kind === "dashboard" ? "currentColor" : "none"}
                stroke={item.kind === "home" || item.kind === "dashboard" ? "none" : "currentColor"}
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {getItemIcon(item.kind)}
              </svg>
            );
            const itemClassName = `hud-icon-btn ui-tooltip inline-flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold transition ${
              isPlusItem && active
                ? "is-active border-[#7c3aed]/45 bg-[#7c3aed]/14 text-[#6d28d9]"
                : active
                ? "is-active border-neutral-300 bg-neutral-100 text-neutral-900"
                : isPlusItem && !hasAccess
                ? "is-pro border-[#7c3aed]/35 bg-[#7c3aed]/8 text-[#7c3aed]"
                : isPlusItem
                ? "border-[#7c3aed]/30 bg-[#7c3aed]/6 text-[#7c3aed] hover:border-[#7c3aed]/45 hover:bg-[#7c3aed]/12"
                : "border-surface bg-white/92 text-muted hover:border-neutral-300 hover:bg-neutral-100 hover:text-main"
            }`;

            if (item.kind === "plus") {
              return (
                <button
                  key={item.kind}
                  type="button"
                  className={itemClassName}
                  onClick={onOpenUpgrade}
                  onPointerEnter={playHoverSound}
                  onPointerDown={playMenuSoundFromGesture}
                  aria-label={nextLabel}
                  title={nextLabel}
                  data-tip={nextLabel}
                >
                  {iconNode}
                  <span className="sr-only">{nextLabel}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.kind}
                href={nextHref}
                className={itemClassName}
                onPointerEnter={playHoverSound}
                onPointerDown={playMenuSoundFromGesture}
                aria-label={nextLabel}
                title={nextLabel}
                data-tip={nextLabel}
              >
                {iconNode}
                <span className="sr-only">{nextLabel}</span>
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={onOpenSettings}
          onPointerEnter={playHoverSound}
          onPointerDown={playMenuSoundFromGesture}
          className="focus-brand hud-icon-btn ui-tooltip relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-surface bg-white/92 text-muted transition hover:border-neutral-300 hover:text-neutral-900 focus-visible:outline-none"
          aria-label={strings.settingsAria}
          title={strings.settingsAria}
          data-tip={strings.settingsAria}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
