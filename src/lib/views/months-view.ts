import {buildProgress, getMonthsBetween} from "./viewMath";
import type {ViewState} from "./weeks-view";

export function getMonthsViewState(dob: Date | null, expectancy: number): ViewState {
  const unitsPerYear = 12;
  const totalUnits = Math.round(expectancy) * unitsPerYear;
  const unitsPassed = dob ? getMonthsBetween(dob, new Date()) : 0;
  const progress = buildProgress(totalUnits, unitsPassed);

  return {
    perRow: 12,
    columnStep: 3,
    rowStep: 5,
    unitsPerYear,
    ...progress,
    fit: "width",
    maxDotSize: 60,
    gapRatio: 0.1
  };
}
