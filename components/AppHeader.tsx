import {useEffect} from "react";
import LogoMark from "./LogoMark";
import DownloadMenu from "./DownloadMenu";
import type {UiStrings} from "../libs/i18n";
import {playHoverSound, unlockAudio} from "../libs/hoverSound";

type AppHeaderProps = {
  title: string;
  onProClick?: () => void;
  onOpenSettings: () => void;
  onDownloadPng: () => void;
  onDownloadJpg: () => void;
  onDownloadPdf?: () => void;
  strings: UiStrings;
};

export default function AppHeader({
  title,
  onProClick,
  onOpenSettings,
  onDownloadPng,
  onDownloadJpg,
  onDownloadPdf,
  strings
}: AppHeaderProps) {
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
    <header className="flex flex-col gap-4 rounded-3xl surface-card px-4 py-4 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 overflow-hidden rounded-2xl border border-surface bg-white sm:h-10 sm:w-10">
          <LogoMark className="h-full w-full" />
        </div>
        <div className="flex items-center gap-2 text-base font-semibold sm:gap-3 sm:text-lg">
          <span className="title-main">{title}</span>
        </div>
      </div>
      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
        <div className="group relative">
          <DownloadMenu
            onDownloadPng={onDownloadPng}
            onDownloadJpg={onDownloadJpg}
            onDownloadPdf={onDownloadPdf}
            strings={strings}
            buttonAriaLabel={strings.download}
            buttonClassName="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-surface text-muted transition hover:border-neutral-300 hover:text-neutral-700 hover:shadow-sm focus-visible:outline-none focus-brand sm:h-9 sm:w-9"
            buttonProps={{
              onPointerEnter: playHoverSound,
              onPointerDown: unlockAudio
            }}
            buttonContent={
              <>
                <span className="btn-glow absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100" />
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="relative h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
              </>
            }
          />
        <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 rounded-full border border-surface bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted opacity-0 shadow-soft transition-opacity group-hover:opacity-100">
          {strings.download}
        </span>
        </div>
        <div className="group relative">
          <button
            type="button"
            onClick={onOpenSettings}
            onPointerEnter={playHoverSound}
            onPointerDown={unlockAudio}
            className="focus-brand relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-surface text-muted transition hover:border-neutral-300 hover:text-neutral-900 focus-visible:outline-none sm:h-9 sm:w-9"
            aria-label={strings.settingsAria}
          >
            <span className="btn-glow absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100" />
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="relative h-4 w-4 transition-transform duration-200 group-hover:rotate-6"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 rounded-full border border-surface bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted opacity-0 shadow-soft transition-opacity group-hover:opacity-100">
            Menu
          </span>
        </div>
        {onProClick ? (
          <div className="group relative">
            <button
              type="button"
              onClick={onProClick}
              onPointerEnter={playHoverSound}
              onPointerDown={unlockAudio}
              aria-label="Pro"
              className="focus-brand relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-surface text-muted transition hover:border-neutral-300 hover:text-neutral-700 hover:shadow-sm sm:h-9 sm:w-9"
            >
              <span className="btn-glow-amber absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100" />
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="relative h-4 w-4 transition-transform duration-200 group-hover:rotate-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
            </button>
            <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 rounded-full border border-surface bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted opacity-0 shadow-soft transition-opacity group-hover:opacity-100">
              Pro
            </span>
          </div>
        ) : null}
      </div>
    </header>
  );
}
