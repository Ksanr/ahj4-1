export function highlightCard(paymentSystem) {
  const allCards = document.querySelectorAll('.card-img');
  allCards.forEach(img => img.classList.remove('active'));
  const targetCard = document.querySelector(`.card-img[data-card="${paymentSystem}"]`);
  if (targetCard) targetCard.classList.add('active');
}

export function resetHighlights() {
  const allCards = document.querySelectorAll('.card-img');
  allCards.forEach(img => img.classList.remove('active'));
}
