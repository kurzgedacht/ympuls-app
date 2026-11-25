import { addDays } from "./dates";

export const INTERVALS = [1, 3, 7, 16, 35];
export const DAILY_REVIEW_CAP = 10;
export interface SrsItem { box: number; due: string }

/** Simplified SM-2: correct climbs one box, wrong falls back to 1 day. */
export function schedule(prev: SrsItem | undefined, correct: boolean, today: string): SrsItem {
  const box = correct ? (prev ? Math.min(prev.box + 1, INTERVALS.length - 1) : 0) : 0;
  return { box, due: addDays(today, INTERVALS[box]) };
}

export const dueIds = (srs: Record<string, SrsItem>, today: string, cap = DAILY_REVIEW_CAP) =>
  Object.entries(srs).filter(([, v]) => v.due <= today).sort((a, b) => a[1].due.localeCompare(b[1].due)).slice(0, cap).map(([k]) => k);
