import {buildProgress, getWeeksBetween} from "./viewMath";

export type ViewState = {
  perRow: number;
  columnStep: number;
  rowStep: number;
  unitsPerYear: number;
  totalUnits: number;
  unitsPassed: number;
  percent: number;
  fit?: "both" | "width";
  maxDotSize?: number;
  gapRatio?: number;
};

export function getWeeksViewState(dob: Date | null, expectancy: number): ViewState {
  const unitsPerYear = 52;
  const totalUnits = Math.round(expectancy) * unitsPerYear;
  const unitsPassed = dob ? getWeeksBetween(dob, new Date()) : 0;
  const progress = buildProgress(totalUnits, unitsPassed);

  return {
    perRow: 52,
    columnStep: 13,
    rowStep: 5,
    unitsPerYear,
    ...progress,
    fit: "both"
  };
}
