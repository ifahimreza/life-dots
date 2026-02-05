import {buildProgress, getYearsBetween} from "./viewMath";
import type {ViewState} from "./weeks-view";

export function getYearsViewState(dob: Date | null, expectancy: number): ViewState {
  const unitsPerYear = 1;
  const totalUnits = Math.round(expectancy) * unitsPerYear;
  const unitsPassed = dob ? getYearsBetween(dob, new Date()) : 0;
  const progress = buildProgress(totalUnits, unitsPassed);

  return {
    perRow: 8,
    columnStep: 5,
    rowStep: 1,
    unitsPerYear,
    ...progress,
    fit: "width",
    gapRatio: 0.1
  };
}
