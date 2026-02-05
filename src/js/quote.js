import { fetchQuote } from './api.js';

export async function initQuote() {
  try {
    const quote = await fetchQuote();
    const card = document.querySelector('.quote-card');
    if (card) {
      card.innerHTML = `
        <div class="quote-icon">“</div>
        <p class="quote-text">${quote.quote}</p>
        <div class="quote-author">— ${quote.author}</div>
      `;
    }
  } catch (err) {
    console.warn('Quote load failed', err);
  }
}