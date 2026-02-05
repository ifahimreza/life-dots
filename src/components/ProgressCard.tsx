import type {RefObject} from "react";
import type {DotStyle} from "../lib/lifeDotsData";
import DotsGrid from "./DotsGrid";

type ProgressCardProps = {
  viewTitle?: string;
  progressLabel: string;
  percent: number;
  isCompactView: boolean;
  isMonthView: boolean;
  gridContainerRef: RefObject<HTMLDivElement>;
  total: number;
  filled: number;
  dotStyle: DotStyle;
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
  percent,
  isCompactView,
  isMonthView,
  gridContainerRef,
  total,
  filled,
  dotStyle,
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
    <div className="flex flex-1 min-h-0 flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
        {viewTitle ? (
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            {viewTitle}
          </div>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-x-3">
          <span>{progressLabel}</span>
          <span>{percent}%</span>
        </div>
      </div>
      <div
        ref={gridContainerRef}
        className={`mt-4 flex-1 min-h-0 ${
          isCompactView ? "flex items-start justify-center" : ""
        } ${isMonthView ? "overflow-y-auto" : ""}`}
      >
        <DotsGrid
          total={total}
          filled={filled}
          dotStyle={dotStyle}
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
        <div className="pt-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
          {footerText ? <div>{footerText}</div> : null}
          {name ? <div className={footerText ? "mt-2" : ""}>{name}</div> : null}
        </div>
      ) : null}
    </div>
  );
}
