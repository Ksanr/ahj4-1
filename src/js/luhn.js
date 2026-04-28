export function isValidLuhn(cardNumber) {
  const digits = cardNumber.replace(/\D/g, '').split('').map(Number);
  if (digits.length === 0) return false;

  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}
