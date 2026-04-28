import { detectPaymentSystem } from '../src/js/paymentSystem';

describe('detectPaymentSystem', () => {
    test.each([
        ['4111111111111111', 'visa'],
        ['4012888888881881', 'visa'],
        ['2221000000000009', 'mastercard'],
        ['5111111111111118', 'mastercard'],
        ['378282246310005', 'amex'],
        ['371449635398431', 'amex'],
        ['6011111111111117', 'discover'],
        ['6441111111111111', 'discover'],
        ['3528000000000000', 'jcb'],
        ['3589000000000000', 'jcb'],
        ['3000000000000004', 'diners'],
        ['30569309025904', 'diners'],
        ['2200000000000000', 'mir'],
        ['1234567890123456', null],
        ['', null],
    ])('для номера %s должна вернуть %s', (cardNumber, expected) => {
        expect(detectPaymentSystem(cardNumber)).toBe(expected);
    });
});
