import { addDays, format } from 'date-fns';

/**
 * Returns an array of date strings for the next two weeks (including today)
 * in the format 'YYYY-MM-DD'
 */
export function getDatesForNextTwoWeeks(): string[] {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const date = addDays(today, i);
    dates.push(formatDate(date));
  }

  return dates;
}

/**
 * Formats a date object to 'YYYY-MM-DD' string
 */
export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
