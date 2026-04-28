import '../css/style.css';
import { detectPaymentSystem } from './paymentSystem';
import { isValidLuhn } from './luhn';
import { highlightCard, resetHighlights } from './ui';

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('cardNumber');
  const button = document.getElementById('checkBtn');
  const errorDiv = document.getElementById('errorMsg');

  function showError(message) {
    errorDiv.textContent = message;
  }

  function clearError() {
    errorDiv.textContent = '';
  }

  function validateAndHighlight() {
    clearError();
    resetHighlights();

    const rawNumber = input.value.trim();
    if (rawNumber === '') {
      showError('Введите номер карты');
      return;
    }

    const cleanNumber = rawNumber.replace(/\D/g, '');
    if (cleanNumber.length < 12) {
      showError('Номер карты слишком короткий (минимум 12 цифр)');
      return;
    }

    const system = detectPaymentSystem(cleanNumber);
    if (!system) {
      showError('Неизвестная платёжная система');
      return;
    }

    if (!isValidLuhn(cleanNumber)) {
      showError('Невалидный номер карты (ошибка контрольной суммы)');
      return;
    }

    highlightCard(system);
    showError('');
    // Можно добавить зелёное сообщение об успехе
    // errorDiv.style.color = '#4caf50';
    // errorDiv.textContent = 'Карта валидна';
    // setTimeout(() => { errorDiv.textContent = ''; }, 2000);
  }

  button.addEventListener('click', validateAndHighlight);
});
