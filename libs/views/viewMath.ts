export type Progress = {
  percent: number;
  unitsPassed: number;
  totalUnits: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function toUtcMidnight(date: Date) {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function getDaysBetween(start: Date, end: Date) {
  const diff = toUtcMidnight(end) - toUtcMidnight(start);
  return Math.max(0, Math.floor(diff / DAY_MS));
}

export function getWeeksBetween(start: Date, end: Date) {
  return Math.floor(getDaysBetween(start, end) / 7);
}

export function getMonthsBetween(start: Date, end: Date) {
  const startYear = start.getUTCFullYear();
  const startMonth = start.getUTCMonth();
  const startDay = start.getUTCDate();
  const endYear = end.getUTCFullYear();
  const endMonth = end.getUTCMonth();
  const endDay = end.getUTCDate();

  let months = (endYear - startYear) * 12 + (endMonth - startMonth);
  if (endDay < startDay) {
    months -= 1;
  }
  return Math.max(0, months);
}

export function getYearsBetween(start: Date, end: Date) {
  const startYear = start.getUTCFullYear();
  const startMonth = start.getUTCMonth();
  const startDay = start.getUTCDate();
  const endYear = end.getUTCFullYear();
  const endMonth = end.getUTCMonth();
  const endDay = end.getUTCDate();

  let years = endYear - startYear;
  if (endMonth < startMonth || (endMonth === startMonth && endDay < startDay)) {
    years -= 1;
  }
  return Math.max(0, years);
}

export function buildProgress(totalUnits: number, unitsPassed: number): Progress {
  const safeTotal = Math.max(1, totalUnits);
  const safePassed = clamp(unitsPassed, 0, safeTotal);
  const percent = clamp(Math.round((safePassed / safeTotal) * 100), 0, 100);
  return {
    percent,
    unitsPassed: safePassed,
    totalUnits: safeTotal
  };
}
