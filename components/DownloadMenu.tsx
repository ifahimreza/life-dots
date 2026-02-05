import {useRef} from "react";
import type {HTMLAttributes, ReactNode} from "react";
import type {UiStrings} from "../libs/i18n";

type DownloadMenuProps = {
  onDownloadPng: () => void;
  onDownloadJpg: () => void;
  onDownloadPdf?: () => void;
  strings: UiStrings;
  buttonContent?: ReactNode;
  buttonAriaLabel?: string;
  buttonClassName?: string;
  buttonProps?: HTMLAttributes<HTMLSpanElement>;
};

export default function DownloadMenu({
  onDownloadPng,
  onDownloadJpg,
  onDownloadPdf,
  strings,
  buttonContent,
  buttonAriaLabel,
  buttonClassName,
  buttonProps
}: DownloadMenuProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const {className: buttonPropsClassName, ...restButtonProps} = buttonProps ?? {};
  const mergedButtonClassName = [
    buttonClassName ??
      "inline-flex items-center justify-center rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 transition hover:border-neutral-300 hover:text-neutral-900",
    buttonPropsClassName
  ]
    .filter(Boolean)
    .join(" ");

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
          {...restButtonProps}
          aria-label={buttonAriaLabel ?? strings.download}
          className={mergedButtonClassName}
        >
          {buttonContent ?? strings.download}
        </span>
      </summary>
      <div className="absolute left-0 z-20 mt-2 w-40 rounded-2xl border border-surface bg-white p-3 shadow-soft sm:right-0 sm:left-auto sm:w-48">
        <button
          type="button"
          onClick={() => handleAction(onDownloadPng)}
          className="w-full rounded-lg px-2 py-1.5 text-left text-xs font-semibold text-main transition hover:bg-neutral-100"
        >
          {strings.downloadPng}
        </button>
        <button
          type="button"
          onClick={() => handleAction(onDownloadJpg)}
          className="mt-1 w-full rounded-lg px-2 py-1.5 text-left text-xs font-semibold text-main transition hover:bg-neutral-100"
        >
          {strings.downloadJpg}
        </button>
        {onDownloadPdf ? (
          <button
            type="button"
            onClick={() => handleAction(onDownloadPdf)}
            className="mt-1 w-full rounded-lg px-2 py-1.5 text-left text-xs font-semibold text-main transition hover:bg-neutral-100"
          >
            {strings.downloadPdf}
          </button>
        ) : null}
      </div>
    </details>
  );
}
