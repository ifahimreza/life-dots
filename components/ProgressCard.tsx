import type {RefObject} from "react";
import type {DotStyle} from "../libs/lifeDotsData";
import type {Theme} from "../libs/themes";
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
  percent,
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
    <div className="flex flex-1 min-h-0 flex-col rounded-2xl surface-card p-4 shadow-soft sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-muted sm:text-sm">
        {viewTitle ? (
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-subtle sm:text-xs">
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
