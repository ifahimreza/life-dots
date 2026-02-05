import {useEffect, useMemo, useState} from "react";
import type {RefObject} from "react";
import {GRID_GAP_RATIO} from "./lifeDotsData";

type Size = {
  width: number;
  height: number;
};

type Metrics = {
  dotSize: number;
  gap: number;
};

const FALLBACK_METRICS: Metrics = {dotSize: 10.38, gap: 5};
type FitMode = "both" | "width";

export default function useDotMetrics(
  container: RefObject<HTMLElement>,
  perRow: number,
  rows: number,
  sizeScale = 1,
  fit: FitMode = "both",
  maxDotSize?: number,
  gapRatio = GRID_GAP_RATIO
) {
  const [size, setSize] = useState<Size>({width: 0, height: 0});

  useEffect(() => {
    if (!container.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const {width, height} = entry.contentRect;
      setSize({width, height});
    });

    observer.observe(container.current);
    return () => observer.disconnect();
  }, [container]);

  return useMemo<Metrics>(() => {
    if (!perRow || !rows) return FALLBACK_METRICS;

    if (!size.width || !size.height) {
      let dotSize = Math.max(1, FALLBACK_METRICS.dotSize * sizeScale);
      if (typeof maxDotSize === "number") {
        dotSize = Math.min(dotSize, maxDotSize);
      }
      const gap = dotSize * gapRatio;
      return {
        dotSize: Number(dotSize.toFixed(2)),
        gap: Number(gap.toFixed(2))
      };
    }

    const availableWidth = Math.max(size.width, 0);
    const availableHeight = Math.max(size.height, 0);
    const widthDot =
      availableWidth / (perRow + gapRatio * Math.max(perRow - 1, 0));
    const heightDot =
      availableHeight / (rows + gapRatio * Math.max(rows - 1, 0));
    const baseDot = fit === "width" ? widthDot : Math.min(widthDot, heightDot);
    let dotSize = Math.max(1, baseDot * sizeScale);
    if (typeof maxDotSize === "number") {
      dotSize = Math.min(dotSize, maxDotSize);
    }
    const gap = dotSize * gapRatio;

    return {
      dotSize: Number(dotSize.toFixed(2)),
      gap: Number(gap.toFixed(2))
    };
  }, [size.height, size.width, perRow, rows, sizeScale, fit, maxDotSize, gapRatio]);
}
