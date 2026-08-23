export function getCurrentTimestampInString() {
  const now = new Date();

  const year = now.getFullYear(); // YYYY
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export function getCurrentDateTime() {
  return new Date();
}

export function getStartAndEndDates(year: number, month: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
}

export function getMonthName(monthNumber: number) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  if (monthNumber < 1 || monthNumber > 12) {
    return '';
  }

  return monthNames[monthNumber - 1];
}

//#region // * Conversion Functions
//#endregion

/**
 * Converts a given number of hours into seconds.
 *
 * @param {number} hours - The number of hours to convert. Must be a non-negative number.
 * @returns {number} The equivalent number of seconds.
 */
export function hoursToSeconds(hours: number): number {
  return hours * 60 * 60;
}

/**
 * Converts a given number of hours into milliseconds.
 *
 * @param {number} hours - The number of hours to convert. Must be a non-negative number.
 * @returns {number} The equivalent number of milliseconds.
 */
export function hoursToMilliseconds(hours: number): number {
  return hours * 60 * 60 * 1000;
}

export function getCurrentDateFormatted() {
  const date = getCurrentDateTime();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
