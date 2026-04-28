export function detectPaymentSystem(cardNumber) {
  const clean = cardNumber.replace(/\D/g, '');
  // Visa: 4
  if (/^4/.test(clean)) return 'visa';
  // MasterCard: 51-55, 2221-2720
  if (/^5[1-5]/.test(clean) || /^(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[0-1][0-9]|2720)/.test(clean.slice(0,4))) return 'mastercard';
  // American Express: 34, 37
  if (/^3[47]/.test(clean)) return 'amex';
  // Discover: 6011, 65, 644-649, 622126-622925
  if (/^6011/.test(clean) || /^65/.test(clean) || /^64[4-9]/.test(clean) || /^622[1-9][0-9]/.test(clean)) return 'discover';
  // JCB: 3528-3589
  if (/^35[2-8][0-9]/.test(clean)) return 'jcb';
  // Diners Club: 300-305, 309, 36, 38, 39
  if (/^3(0[0-5]|09|[68]9)/.test(clean)) return 'diners';
  // Мир: 2, не попавшие в MasterCard
  if (/^2/.test(clean)) return 'mir';
  return null;
}
