export function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

export const convertToNumber = (priceInput) => {
  if (typeof priceInput !== 'string') {
    return isNaN(priceInput) ? null : Number(priceInput);
  }
  
  const normalizedInput = priceInput.replace(",", ".");
  const price = Number(normalizedInput);
  
  return isNaN(price) ? 0 : price;
};
