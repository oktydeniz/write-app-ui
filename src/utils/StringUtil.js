export function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

export const convertToNumber = (priceInput) => {
  const normalizedInput = priceInput.replace(",", ".");
  const price = Number(normalizedInput);
  return isNaN(price) ? null : price;
};
