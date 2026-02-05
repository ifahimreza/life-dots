import type {ViewMode} from "../lifeDotsData";
import {getMonthsViewState} from "./months-view";
import {getWeeksViewState} from "./weeks-view";
import {getYearsViewState} from "./years-view";

export type {ViewState} from "./weeks-view";

export function getViewState(
  mode: ViewMode,
  dob: Date | null,
  expectancy: number
) {
  if (mode === "months") {
    return getMonthsViewState(dob, expectancy);
  }
  if (mode === "years") {
    return getYearsViewState(dob, expectancy);
  }
  return getWeeksViewState(dob, expectancy);
}
