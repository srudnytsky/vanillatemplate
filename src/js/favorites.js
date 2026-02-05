document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('favorites-container');
  if (!container) {
    console.error('Element #favorites-container not found!');
    return;
  }

  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  if (favorites.length === 0) {
    // Показуємо повідомлення "Not Found"
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-text">
          <p>
            It appears that you haven't added any exercises to your favorites yet.  
            To get started, you can add exercises that you like to your favorites for easier access in the future.
          </p>
        </div>
      </div>
    `;
    return;
  }

  // Генеруємо картки
  const workoutsHtml = favorites.map(ex => `
    <div class="workout-card" data-id="${ex.id}">
      <div class="workout-meta">
        <span class="tag workout">WORKOUT</span>
        <button class="btn-delete" title="Remove from favorites">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 6h18M19 6v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
      <h3 class="workout-name">${ex.name}</h3>
      <div class="workout-details">
        <div class="detail-row">
          <svg width="14" height="14"><use href="#icon-runner"/></svg>
          <span>Burned calories: <strong>${ex.burnedCalories} / ${ex.time || 3} min</strong></span>
        </div>
        <div class="detail-row">
          <span>Body part: <strong>${ex.bodyPart || 'N/A'}</strong></span>
          <span>Target: <strong>${ex.target || 'N/A'}</strong></span>
        </div>
      </div>
      <button class="btn-start">Start →</button>
    </div>
  `).join('');

  container.innerHTML = workoutsHtml;

  // Обробники для кнопок Start
  document.querySelectorAll('.btn-start').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.closest('.workout-card').querySelector('.workout-name').textContent;
      alert(`Starting workout: ${name}`);
    });
  });

  // Обробники для кнопок Delete
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.workout-card');
      const id = card.dataset.id;

      let favs = JSON.parse(localStorage.getItem('favorites')) || [];
      favs = favs.filter(item => item.id !== id);
      localStorage.setItem('favorites', JSON.stringify(favs));

      // Оновлюємо UI без перезавантаження
      card.remove();
      
      // Якщо стало порожньо — показуємо "Not Found"
      if (favs.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-text">
              <p>
                It appears that you haven't added any exercises to your favorites yet.  
                To get started, you can add exercises that you like to your favorites for easier access in the future.
              </p>
            </div>
          </div>
        `;
      }
    });
  });
});