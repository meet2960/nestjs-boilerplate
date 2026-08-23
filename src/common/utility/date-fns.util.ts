import { format } from 'date-fns';
import { formatISO } from 'date-fns';
import { toZonedTime, fromZonedTime, format as tzFormat } from 'date-fns-tz';

const conversionTimezone = 'Asia/Kolkata';

export function getCurrentUtcDateTime(): string {
  return formatISO(new Date()); // e.g. 2026-03-31T12:34:56.789Z
}

/**
 * Current timestamp in IST
 */
export function getCurrentTimestamp() {
  const now = new Date();
  const zonedDate = toZonedTime(now, conversionTimezone);

  return tzFormat(zonedDate, 'yyyyMMddHHmmss', {
    timeZone: conversionTimezone,
  });
}

/**
 * Current datetime
 */
export const getCurrentDateTime = (formatStr?: string) => {
  return format(new Date(), formatStr || "yyyy-MM-dd'T'HH:mm:ss");
};

/**
 * Normalize single date to IST day → return UTC range
 */
export function normalizeDateToUtcDayRange(dateInput: string | Date) {
  if (!dateInput) throw new Error('Date input required');

  const zonedDate = toZonedTime(dateInput, conversionTimezone);
  const dateOnly = format(zonedDate, 'yyyy-MM-dd');

  const startOfDay = new Date(`${dateOnly}T00:00:00`);
  const endOfDay = new Date(`${dateOnly}T23:59:59.999`);

  const startUtc = fromZonedTime(startOfDay, conversionTimezone);
  const endUtc = fromZonedTime(endOfDay, conversionTimezone);

  return { from: startUtc, to: endUtc };
}

/**
 * Normalize range
 */
export function getUtcDateRangeForDate(range: {
  date_from: string | Date;
  date_to: string | Date;
}) {
  if (!range?.date_from || !range?.date_to) {
    throw new Error('Both date_from and date_to are required');
  }

  const fromZoned = toZonedTime(range.date_from, conversionTimezone);
  const toZoned = toZonedTime(range.date_to, conversionTimezone);

  const fromDateOnly = format(fromZoned, 'yyyy-MM-dd');
  const toDateOnly = format(toZoned, 'yyyy-MM-dd');

  const startOfDay = new Date(`${fromDateOnly}T00:00:00`);
  const endOfDay = new Date(`${toDateOnly}T23:59:59.999`);

  const startUtc = fromZonedTime(startOfDay, conversionTimezone);
  const endUtc = fromZonedTime(endOfDay, conversionTimezone);

  return { from: startUtc, to: endUtc };
}
