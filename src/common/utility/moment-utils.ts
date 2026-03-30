import moment from 'moment-timezone';

const conversionTimezone = 'Asia/Kolkata';

export function getCurrentTimestampFromMoment() {
  return moment().tz('Asia/Kolkata').format('YYYYMMDDHHmmss');
}

export const getCurrentDateTimeFromMoment = (format?: string) =>
  moment().format(format);

export function normalizeDateToUtcDayRange(dateString: string | Date) {
  if (!dateString) throw new Error('Date input required');

  // Extract only the YYYY-MM-DD portion (ignores time zone + time)
  const dateOnly = moment(dateString).tz('Asia/Kolkata').format('YYYY-MM-DD');

  // Build IST day boundaries and convert to UTC
  const startUtc = moment
    .tz(dateOnly, 'Asia/Kolkata')
    .startOf('day')
    .utc()
    .toDate();
  const endUtc = moment
    .tz(dateOnly, 'Asia/Kolkata')
    .endOf('day')
    .utc()
    .toDate();

  return { from: startUtc, to: endUtc };
}
export function getUtcDateRangeForDate(range: {
  date_from: string | Date;
  date_to: string | Date;
}) {
  if (!range?.date_from || !range?.date_to) {
    throw new Error('Both date_from and date_to are required');
  }

  const fromDateOnly = moment(range.date_from)
    .tz(conversionTimezone)
    .format('YYYY-MM-DD');
  const toDateOnly = moment(range.date_to)
    .tz(conversionTimezone)
    .format('YYYY-MM-DD');

  const startUtc = moment
    .tz(fromDateOnly, conversionTimezone)
    .startOf('day')
    .utc()
    .toDate();

  const endUtc = moment
    .tz(toDateOnly, conversionTimezone)
    .endOf('day')
    .utc()
    .toDate();

  return { from: startUtc, to: endUtc };
}
