import {DotStyle, GRID_AXIS_OFFSET} from "../libs/lifeDotsData";
import type {Theme} from "../libs/themes";

type DotsGridProps = {
  total: number;
  filled: number;
  dotStyle: DotStyle;
  theme: Theme;
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
  theme,
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
  const filledColor = theme.palette.dotFilled;
  const emptyColor = theme.palette.dotEmpty;
  const rainbow = theme.palette.rainbow;

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
                className={`absolute select-none text-[9px] transition-opacity ${axisClass}`}
                style={{
                  top: -GRID_AXIS_OFFSET,
                  left: index * cell + dotSize / 2,
                  transform: "translateX(-50%)",
                  color: theme.palette.axisText
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
                className={`absolute select-none text-[9px] transition-opacity ${axisClass}`}
                style={{
                  left: -GRID_AXIS_OFFSET,
                  top: index * cell + dotSize / 2,
                  transform: "translateY(-50%)",
                  color: theme.palette.axisText
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
              className={dotStyle === "classic" ? "rounded-full" : "rounded-sm"}
              style={{
                height: dotSize,
                width: dotSize,
                backgroundColor:
                  index < filled
                    ? dotStyle === "classic"
                      ? filledColor
                      : rainbow[index % rainbow.length]
                    : emptyColor
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
