// favorites.js
document.addEventListener('DOMContentLoaded', () => {
  // === MOBILE MENU ===
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuClose = document.querySelector('.mobile-menu-close');
  
  if (menuToggle && mobileMenu && menuClose) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    
    menuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
    
    mobileMenu.querySelectorAll('.mobile-menu-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // === MAIN APP LOGIC ===
  const API_BASE = 'https://your-energy.b.goit.study/api';

  const favoritesContent = document.getElementById('favorites-content');
  const quoteText = document.getElementById('fav-quote-text');
  const quoteAuthor = document.getElementById('fav-quote-author');
  const subscribeForm = document.getElementById('subscribe-form');

  let currentExercise = null;

  // === FAVORITES FUNCTIONS ===
  function getFavorites() {
    try {
      return JSON.parse(localStorage.getItem('favorites')) || [];
    } catch {
      return [];
    }
  }

  function removeFromFavorites(exerciseId) {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(fav => fav._id !== exerciseId);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    displayFavorites(); // Перерисовываем список
  }

  // === ОТОБРАЖЕНИЕ ИЗБРАННОГО ===
  function displayFavorites() {
    const favorites = getFavorites();
    
    if (!favoritesContent) return;
    
    if (favorites.length === 0) {
      favoritesContent.innerHTML = `
        <div class="no-favorites">
          <p>You haven't added any exercises to favorites yet.</p>
          <p>Go to the <a href="index.html" style="color: #EEA10C;">home page</a> to find exercises!</p>
        </div>
      `;
      return;
    }

    favoritesContent.innerHTML = '';
    
    favorites.forEach(ex => {
      const card = document.createElement('div');
      card.className = 'exercise-card-horizontal';

      const rating = ex.rating || 0;

      card.innerHTML = `
        <div class="exercise-card-left">
          <div class="workout-badge">
            WORKOUT ${rating.toFixed(1)} ⭐
          </div>
          <div class="exercise-info">
            <h3>${ex.name}</h3>
            <div class="exercise-details">
              <span><span class="label">Burned calories:</span> ${ex.burnedCalories || 0} / ${ex.time || 0} min</span>
              <span><span class="label">Body part:</span> ${ex.bodyPart || ''}</span>
              <span><span class="label">Target:</span> ${ex.target || ''}</span>
            </div>
          </div>
        </div>
        <button class="remove-favorite-btn" data-id="${ex._id}">Remove</button>
      `;

      // Кнопка удаления
      const removeBtn = card.querySelector('.remove-favorite-btn');
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeFromFavorites(ex._id);
      });

      // Открытие модального окна при клике на карточку
      card.addEventListener('click', () => {
        openExerciseModal(ex);
      });

      favoritesContent.appendChild(card);
    });
  }

  // === Load daily quote ===
  async function loadQuote() {
    try {
      const res = await fetch(`${API_BASE}/quote`);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      if (data?.quote && data?.author) {
        quoteText.textContent = data.quote;
        quoteAuthor.textContent = data.author;
      } else {
        quoteText.textContent = "Quote not available";
        quoteAuthor.textContent = "";
      }
    } catch (err) {
      console.error('Error loading quote:', err);
      quoteText.textContent = "Failed to load quote";
    }
  }

  // === Open Exercise Modal ===
  function openExerciseModal(exercise) {
    const modal = document.getElementById('exercise-modal');
    if (!modal) {
      // Если модального окна нет на странице, создаем его
      createModalAndOpen(exercise);
      return;
    }

    currentExercise = exercise;

    const modalImg = document.getElementById('modal-exercise-img');
    const modalName = document.getElementById('modal-exercise-name');
    const modalRating = document.getElementById('modal-rating-stars');
    const modalTarget = document.getElementById('modal-target');
    const modalBodyPart = document.getElementById('modal-body-part');
    const modalEquipment = document.getElementById('modal-equipment');
    const modalPopularity = document.getElementById('modal-popularity');
    const modalCalories = document.getElementById('modal-calories');
    const modalDescription = document.getElementById('modal-description-text');

    if (modalImg) modalImg.src = exercise.gifUrl || 'https://via.placeholder.com/300x300?text=Exercise';
    if (modalName) modalName.textContent = exercise.name || '';
    
    const rating = exercise.rating || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsDisplay = `${rating.toFixed(1)} `;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        starsDisplay += '⭐';
      } else if (i === fullStars && hasHalfStar) {
        starsDisplay += '⭐';
      } else {
        starsDisplay += '☆';
      }
    }
    if (modalRating) modalRating.textContent = starsDisplay;
    
    if (modalTarget) modalTarget.textContent = exercise.target || '';
    if (modalBodyPart) modalBodyPart.textContent = exercise.bodyPart || '';
    if (modalEquipment) modalEquipment.textContent = exercise.equipment || '';
    if (modalPopularity) modalPopularity.textContent = exercise.popularity || '0';
    if (modalCalories) modalCalories.textContent = `${exercise.burnedCalories || 0}/${exercise.time || 0} min`;
    if (modalDescription) modalDescription.textContent = exercise.description || 'No description available.';

    // Обновляем кнопку избранного
    const addFavoritesBtn = document.getElementById('modal-add-favorites');
    if (addFavoritesBtn) {
      const isFav = getFavorites().some(fav => fav._id === exercise._id);
      if (isFav) {
        addFavoritesBtn.innerHTML = 'Remove from favorites ♥';
        addFavoritesBtn.style.color = '#EEA10C';
        addFavoritesBtn.style.borderColor = '#EEA10C';
      } else {
        addFavoritesBtn.innerHTML = 'Add to favorites ♡';
        addFavoritesBtn.style.color = '#F4F4F4';
        addFavoritesBtn.style.borderColor = 'rgba(244, 244, 244, 0.2)';
      }
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // === Close Exercise Modal ===
  function closeExerciseModal() {
    const modal = document.getElementById('exercise-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // === Modal event listeners ===
  const modalCloseBtn = document.getElementById('modal-close');
  const modalOverlay = document.querySelector('.modal-overlay');
  
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeExerciseModal);
  }
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeExerciseModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeExerciseModal();
    }
  });

  // === Favorites button functionality in modal ===
  const addFavoritesBtn = document.getElementById('modal-add-favorites');
  if (addFavoritesBtn) {
    addFavoritesBtn.addEventListener('click', () => {
      if (!currentExercise) {
        alert('No exercise selected');
        return;
      }

      const favorites = getFavorites();
      const exerciseId = currentExercise._id;
      const favoriteIndex = favorites.findIndex(fav => fav._id === exerciseId);

      if (favoriteIndex > -1) {
        favorites.splice(favoriteIndex, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        addFavoritesBtn.innerHTML = 'Add to favorites ♡';
        addFavoritesBtn.style.color = '#F4F4F4';
        addFavoritesBtn.style.borderColor = 'rgba(244, 244, 244, 0.2)';
        alert('Removed from favorites!');
        displayFavorites(); // Обновляем список избранного
      } else {
        favorites.push(currentExercise);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        addFavoritesBtn.innerHTML = 'Remove from favorites ♥';
        addFavoritesBtn.style.color = '#EEA10C';
        addFavoritesBtn.style.borderColor = '#EEA10C';
        alert('Added to favorites!');
        displayFavorites(); // Обновляем список избранного
      }
    });
  }

  // === Subscription ===
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = subscribeForm.querySelector('input[type="email"]');
      const email = emailInput?.value.trim();

      if (!email) {
        alert('Please enter your email');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/subscription`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        const data = await res.json();
        alert(data.message || 'Successfully subscribed!');
        subscribeForm.reset();
      } catch (err) {
        console.error('Subscription error:', err);
        alert('Failed to subscribe. Please try again later.');
      }
    });
  }

  // === Initialization ===
  loadQuote();
  displayFavorites(); // Отображаем избранное при загрузке страницы
});