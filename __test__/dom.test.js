/**
 * @jest-environment jsdom
 */
import { isValidLuhn } from '../src/js/luhn';
import { detectPaymentSystem } from '../src/js/paymentSystem';

// Настраиваем DOM перед каждым тестом
let container;
let input;
let button;
let errorDiv;

beforeEach(() => {
  // Создаём HTML-структуру, аналогичную реальной
  document.body.innerHTML = `
    <div class="cards-row">
      <img data-card="visa" class="card-img" src="./img/visa.png">
      <img data-card="mastercard" class="card-img" src="./img/mastercard.png">
      <img data-card="amex" class="card-img" src="./img/amex.png">
      <img data-card="discover" class="card-img" src="./img/discover.png">
      <img data-card="jcb" class="card-img" src="./img/jcb.png">
      <img data-card="diners" class="card-img" src="./img/diners.png">
    </div>
    <div class="input-row">
      <input id="cardNumber" placeholder="Введите номер карты">
      <button id="checkBtn">Проверить</button>
    </div>
    <div id="errorMsg"></div>
  `;

  container = document.querySelector('.cards-row');
  input = document.getElementById('cardNumber');
  button = document.getElementById('checkBtn');
  errorDiv = document.getElementById('errorMsg');

  // Импортируем функции UI (если они используют DOM)
  // Для простоты продублируем логику подсветки и ошибок прямо в тесте,
  // но можно импортировать настоящие функции из ui.js
  // Однако ui.js зависит от реальных картинок? Лучше использовать ту же логику, что в app.js.
  // Напишем локальные обработчики.
});

// Вспомогательная функция для сброса подсветки
function resetHighlights() {
  const allCards = document.querySelectorAll('.card-img');
  allCards.forEach(img => img.classList.remove('active'));
}

function highlightCard(system) {
  resetHighlights();
  const target = document.querySelector(`.card-img[data-card="${system}"]`);
  if (target) target.classList.add('active');
}

function validateAndShowError() {
  resetHighlights();
  const raw = input.value.trim();
  const clean = raw.replace(/\D/g, '');
  if (!clean) {
    errorDiv.textContent = 'Введите номер карты';
    return;
  }
  if (clean.length < 12) {
    errorDiv.textContent = 'Номер карты слишком короткий';
    return;
  }
  const system = detectPaymentSystem(clean);
  if (!system) {
    errorDiv.textContent = 'Неизвестная платёжная система';
    return;
  }
  if (!isValidLuhn(clean)) {
    errorDiv.textContent = 'Невалидный номер карты (ошибка контрольной суммы)';
    return;
  }
  highlightCard(system);
  errorDiv.textContent = '';
}

// Параметризованные тесты на взаимодействие с DOM
describe('DOM interaction with jest.each', () => {
  test.each([
    ['4111111111111111', 'visa', ''],                                   // валидная Visa
    ['5111111111111118', 'mastercard', ''],                             // валидная MasterCard
    ['378282246310005', 'amex', ''],                                    // валидная Amex
    ['6011111111111117', 'discover', ''],                               // валидная Discover
    ['3530111333300000', 'jcb', ''],                                    // валидная JCB
    ['30569309025904', 'diners', ''],                                   // валидная Diners
    ['1234567890123456', null, 'Неизвестная платёжная система'],        // неизвестная система
    ['4111111111111112', null, 'Невалидный номер карты (ошибка контрольной суммы)'], // невалидная Visa
  ])('для номера %s ожидаем платежную систему %s и сообщение "%s"', (cardNumber, expectedSystem, expectedError) => {
    input.value = cardNumber;
    validateAndShowError();

    if (expectedError) {
      expect(errorDiv.textContent).toBe(expectedError);
    } else {
      expect(errorDiv.textContent).toBe('');
    }

    // Проверяем подсветку карты
    const activeCard = document.querySelector('.card-img.active');
    if (expectedSystem) {
      expect(activeCard).not.toBeNull();
      expect(activeCard.dataset.card).toBe(expectedSystem);
    } else {
      expect(activeCard).toBeNull();
    }
  });
});
