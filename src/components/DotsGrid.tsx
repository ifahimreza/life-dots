import {DotStyle, GRID_AXIS_OFFSET, rainbowColors} from "../lib/lifeDotsData";

type DotsGridProps = {
  total: number;
  filled: number;
  dotStyle: DotStyle;
  perRow: number;
  dotSize: number;
  gap: number;
  columnStep?: number;
  rowStep?: number;
  axisPadding?: number;
  showAxis?: boolean;
};

export default function DotsGrid({
  total,
  filled,
  dotStyle,
  perRow,
  dotSize,
  gap,
  columnStep = 13,
  rowStep = 5,
  axisPadding = 0,
  showAxis = false
}: DotsGridProps) {
  const rows = Math.ceil(total / perRow);
  const cell = dotSize + gap;
  const axisClass = showAxis
    ? "opacity-100"
    : "opacity-0 group-hover:opacity-100";

  return (
    <div className="relative w-fit">
      <div className="relative group" style={{paddingTop: axisPadding, paddingLeft: axisPadding}}>
        <div className="pointer-events-none absolute left-0 top-0 h-full w-full">
          {Array.from({length: perRow}).map((_, index) =>
            index === 0 ||
            (index + 1) % columnStep === 0 ||
            index === perRow - 1 ? (
              <span
                key={`col-${index}`}
                className={`absolute select-none text-[9px] text-neutral-400 transition-opacity dark:text-neutral-500 ${axisClass}`}
                style={{
                  top: -GRID_AXIS_OFFSET,
                  left: index * cell + dotSize / 2,
                  transform: "translateX(-50%)"
                }}
              >
                {index + 1}
              </span>
            ) : null
          )}
          {Array.from({length: rows}).map((_, index) =>
            index === 0 ||
            (index + 1) % rowStep === 0 ||
            index === rows - 1 ? (
              <span
                key={`row-${index}`}
                className={`absolute select-none text-[9px] text-neutral-400 transition-opacity dark:text-neutral-500 ${axisClass}`}
                style={{
                  left: -GRID_AXIS_OFFSET,
                  top: index * cell + dotSize / 2,
                  transform: "translateY(-50%)"
                }}
              >
                {index + 1}
              </span>
            ) : null
          )}
        </div>
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${perRow}, ${dotSize}px)`,
            gap: `${gap}px`
          }}
        >
          {Array.from({length: total}).map((_, index) => (
            <span
              key={index}
              style={{height: dotSize, width: dotSize}}
              className={`${
                dotStyle === "classic" ? "rounded-full" : "rounded-sm"
              } ${
                index < filled
                  ? dotStyle === "classic"
                    ? "bg-neutral-900 dark:bg-white"
                    : rainbowColors[index % rainbowColors.length]
                  : "bg-neutral-200 dark:bg-neutral-800"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
