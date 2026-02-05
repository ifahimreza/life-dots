import DownloadMenu from "./DownloadMenu";
import FlagIcon from "./FlagIcon";
import type {PrintSize} from "../lib/dotExport";
import type {UiStrings} from "../lib/i18n";

type TopBarProps = {
  lifeExpectancyLine: string;
  flagCode?: string;
  onOpenSettings: () => void;
  onDownloadPng: () => void;
  onDownloadJpg: () => void;
  onPrintPdf: () => void;
  printSize: PrintSize;
  onPrintSizeChange: (size: PrintSize) => void;
  strings: UiStrings;
};

export default function TopBar({
  lifeExpectancyLine,
  flagCode,
  onOpenSettings,
  onDownloadPng,
  onDownloadJpg,
  onPrintPdf,
  printSize,
  onPrintSizeChange,
  strings
}: TopBarProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
        {flagCode ? <FlagIcon code={flagCode} size={14} className="rounded-sm" /> : null}
        <span>{lifeExpectancyLine}</span>
      </p>
      <div className="flex items-center gap-2">
        <DownloadMenu
          onDownloadPng={onDownloadPng}
          onDownloadJpg={onDownloadJpg}
          onPrintPdf={onPrintPdf}
          printSize={printSize}
          onPrintSizeChange={onPrintSizeChange}
          strings={strings}
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
      </div>
    </div>
  );
}
