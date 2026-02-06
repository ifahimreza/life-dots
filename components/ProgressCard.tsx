import type {RefObject} from "react";
import type {DotStyle} from "../libs/lifeDotsData";
import type {Theme} from "../libs/themes";
import type {UiStrings} from "../libs/i18n";
import DotsGrid from "./DotsGrid";

type ProgressCardProps = {
  viewTitle?: string;
  progressLabel: string;
  percentLabel: string;
  onOpenExport: () => void;
  strings: UiStrings;
  isCompactView: boolean;
  isMonthView: boolean;
  gridContainerRef: RefObject<HTMLDivElement>;
  total: number;
  filled: number;
  dotStyle: DotStyle;
  theme: Theme;
  perRow: number;
  dotSize: number;
  gap: number;
  columnStep: number;
  rowStep: number;
  name?: string;
  footerText?: string;
  axisPadding?: number;
  showAxis?: boolean;
};

export default function ProgressCard({
  progressLabel,
  percentLabel,
  onOpenExport,
  strings,
  isCompactView,
  isMonthView,
  gridContainerRef,
  total,
  filled,
  dotStyle,
  theme,
  perRow,
  dotSize,
  gap,
  columnStep,
  rowStep,
  viewTitle,
  name,
  footerText,
  axisPadding,
  showAxis
}: ProgressCardProps) {
  return (
    <div className="game-panel flex min-h-0 flex-1 flex-col rounded-[24px] surface-card p-4 sm:p-6">
      <div className="game-hud flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-muted sm:text-sm">
        {viewTitle ? (
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-subtle sm:text-xs">
            {viewTitle}
          </div>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-x-3">
          <span>{progressLabel}</span>
          <span>{percentLabel}</span>
          <button
            type="button"
            onClick={onOpenExport}
            aria-label={strings.download}
            title={strings.download}
            data-tip={strings.download}
            className="ui-tooltip inline-flex items-center gap-1.5 rounded-full border border-surface bg-white/90 px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-neutral-300 hover:text-main"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
            <span>{strings.download}</span>
          </button>
        </div>
      </div>
      <div
        ref={gridContainerRef}
        className={`mt-3 flex flex-1 min-h-0 items-center justify-center sm:mt-4 ${
          isMonthView ? "overflow-y-auto" : ""
        }`}
      >
        <DotsGrid
          total={total}
          filled={filled}
          dotStyle={dotStyle}
          theme={theme}
          perRow={perRow}
          dotSize={dotSize}
          gap={gap}
          columnStep={columnStep}
          rowStep={rowStep}
          axisPadding={axisPadding}
          showAxis={showAxis}
        />
      </div>
      {(name || footerText) ? (
        <div className="pt-3 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-subtle sm:pt-4 sm:text-xs">
          {footerText ? <div>{footerText}</div> : null}
          {name ? <div className={footerText ? "mt-2" : ""}>{name}</div> : null}
        </div>
      ) : null}
    </div>
  );
}
