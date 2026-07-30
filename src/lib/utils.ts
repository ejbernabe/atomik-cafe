export function convertPriceToString(price: number | string): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) {
    return "₱0.00";
  }

  return "₱" + numericPrice.toFixed(2);
}

export function convertStringToPrice(priceString: string): number {
  // Remove the currency symbol and any commas, then parse to float
  const numericString = priceString.replace(/[^0-9.]/g, '');
  return parseFloat(numericString);
}
