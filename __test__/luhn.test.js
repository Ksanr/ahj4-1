import { isValidLuhn } from '../src/js/luhn';

test('valid card passes Luhn', () => {
  expect(isValidLuhn('4111111111111111')).toBe(true);
});

test('invalid card fails Luhn', () => {
  expect(isValidLuhn('4111111111111112')).toBe(false);
});
