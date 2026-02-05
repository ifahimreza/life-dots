import DownloadMenu from "./DownloadMenu";
import type {PrintSize} from "../lib/dotExport";
import type {UiStrings} from "../lib/i18n";

type AppHeaderProps = {
  title: string;
  onProClick?: () => void;
  onOpenSettings: () => void;
  onDownloadPng: () => void;
  onDownloadJpg: () => void;
  onPrintPdf: () => void;
  printSize: PrintSize;
  onPrintSizeChange: (size: PrintSize) => void;
  strings: UiStrings;
};

export default function AppHeader({
  title,
  onProClick,
  onOpenSettings,
  onDownloadPng,
  onDownloadJpg,
  onPrintPdf,
  printSize,
  onPrintSizeChange,
  strings
}: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between rounded-3xl border border-neutral-200 bg-white px-6 py-4 shadow-soft dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3c-2.6 2.8-2.6 6.2 0 9" />
          <path d="M12 3c2.6 2.8 2.6 6.2 0 9" />
          <path d="M12 12v7" />
          <path d="M8 19h8" />
        </svg>
      </div>
      <div className="flex-1 text-center text-lg font-semibold text-neutral-800 dark:text-neutral-100">
        {title}
      </div>
      <div className="flex items-center gap-2">
        <DownloadMenu
          onDownloadPng={onDownloadPng}
          onDownloadJpg={onDownloadJpg}
          onPrintPdf={onPrintPdf}
          printSize={printSize}
          onPrintSizeChange={onPrintSizeChange}
          strings={strings}
          buttonAriaLabel={strings.download}
          buttonClassName="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:border-neutral-300 hover:text-neutral-700 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-neutral-100"
          buttonContent={
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3v10" />
              <path d="M8 9l4 4 4-4" />
              <path d="M5 21h14" />
            </svg>
          }
        />
        <button
          type="button"
          onClick={onOpenSettings}
          className="inline-flex items-center justify-center rounded-full border border-neutral-200 p-2 text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white"
          aria-label={strings.settingsAria}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h3m-7.5 4h11m-7.5 4h3m-8 4h10M4 4h16v16H4z"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={onProClick}
          aria-label="Pro"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition hover:border-neutral-300 hover:text-neutral-600 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-neutral-200"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 6h4l2 4 2-4h4l-3 8H7L4 6Z" />
            <path d="M7 14h10" />
          </svg>
        </button>
      </div>
    </header>
  );
}
