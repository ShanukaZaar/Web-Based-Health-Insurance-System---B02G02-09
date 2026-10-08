/**
 * Currency utility helper for formatting monetary values in Sri Lankan Rupees (LKR / Rs).
 */
export const formatCurrency = (amt) => {
  const num = Number(amt) || 0;
  return `Rs. ${num.toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatCurrencyCompact = (amt) => {
  const num = Number(amt) || 0;
  return `Rs. ${num.toLocaleString('en-LK')}`;
};

export default formatCurrency;
