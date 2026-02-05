import {useRef} from "react";
import type {ReactNode} from "react";
import type {PrintSize} from "../lib/dotExport";
import type {UiStrings} from "../lib/i18n";

type DownloadMenuProps = {
  onDownloadPng: () => void;
  onDownloadJpg: () => void;
  onPrintPdf: () => void;
  printSize: PrintSize;
  onPrintSizeChange: (value: PrintSize) => void;
  strings: UiStrings;
  buttonContent?: ReactNode;
  buttonAriaLabel?: string;
  buttonClassName?: string;
};

export default function DownloadMenu({
  onDownloadPng,
  onDownloadJpg,
  onPrintPdf,
  printSize,
  onPrintSizeChange,
  strings,
  buttonContent,
  buttonAriaLabel,
  buttonClassName
}: DownloadMenuProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const handleAction = (action: () => void) => {
    action();
    if (detailsRef.current) {
      detailsRef.current.removeAttribute("open");
    }
  };

  return (
    <details ref={detailsRef} className="relative">
      <summary className="list-none">
        <span
          aria-label={buttonAriaLabel ?? strings.download}
          className={
            buttonClassName ??
            "inline-flex items-center justify-center rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 transition hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white"
          }
        >
          {buttonContent ?? strings.download}
        </span>
      </summary>
      <div className="absolute right-0 z-20 mt-2 w-48 rounded-2xl border border-neutral-200 bg-white p-3 shadow-soft dark:border-neutral-800 dark:bg-neutral-900">
        <button
          type="button"
          onClick={() => handleAction(onDownloadPng)}
          className="w-full rounded-lg px-2 py-1.5 text-left text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          {strings.downloadPng}
        </button>
        <button
          type="button"
          onClick={() => handleAction(onDownloadJpg)}
          className="mt-1 w-full rounded-lg px-2 py-1.5 text-left text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          {strings.downloadJpg}
        </button>
        <button
          type="button"
          onClick={() => handleAction(onPrintPdf)}
          className="mt-1 w-full rounded-lg px-2 py-1.5 text-left text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          {strings.printPdf}
        </button>
        <div className="mt-3 border-t border-neutral-200 pt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 dark:border-neutral-800">
          {strings.standardPrintSize}
        </div>
        <select
          value={printSize}
          onChange={(event) => onPrintSizeChange(event.target.value as PrintSize)}
          className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-xs font-semibold text-neutral-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
        >
          <option value="letter">{strings.usLetter}</option>
          <option value="a4">{strings.a4}</option>
        </select>
      </div>
    </details>
  );
}
