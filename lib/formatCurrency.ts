/**
 * Format a number as SAR currency
 * @param amount - The amount to format
 * @returns Formatted currency string in Saudi Riyal format
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
  }).format(amount);
}
