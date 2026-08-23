/** Formats a number according to the Indian numbering system.
 * Example: 1188144 => "11,88,144"
 */
export function formatIndianAmount(amount: number): string {
  if (Number.isNaN(amount)) return '';
  return amount.toLocaleString('en-IN');
}

/** Formats a number into a short form according to the Indian numbering system.
 * Example: 1188144 => "11.88 Lakh"
 */
export function formatIndianShort(amount: number): string {
  if (amount >= 10000000) {
    return (amount / 10000000).toFixed(2) + ' Cr';
  } else if (amount >= 100000) {
    return (amount / 100000).toFixed(2) + ' Lakh';
  } else if (amount >= 1000) {
    return (amount / 1000).toFixed(2) + ' K';
  }
  return amount.toString();
}
