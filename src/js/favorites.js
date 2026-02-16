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

  // === API AND STORAGE ===
  const API_BASE = 'https://your-energy.b.goit.study/api';
  const favoritesContent = document.getElementById('favorites-content');
  const quoteText = document.getElementById('fav-quote-text');
  const quoteAuthor = document.getElementById('fav-quote-author');
  const subscribeForm = document.getElementById('subscribe-form');

  let currentExercise = null;

  // === FAVORITES MANAGEMENT ===
  function getFavorites() {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  }

  function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  function removeFavorite(exerciseId) {
    let favorites = getFavorites();
    favorites = favorites.filter(fav => fav._id !== exerciseId);
    saveFavorites(favorites);
    displayFavorites();
  }

  // === RENDER FAVORITES ===
  function displayFavorites() {
    if (!favoritesContent) return;

    const favorites = getFavorites();

    if (favorites.length === 0) {
      // Show empty state
      favoritesContent.innerHTML = `
        <div class="no-favorites">
          <p>It appears that you haven't added any exercises to your favorites yet. To get started, you can add exercises that you like to your favorites for easier access in the future.</p>
        </div>
      `;
      return;
    }

    // Render exercise cards
    favoritesContent.innerHTML = '';
    
    favorites.forEach(exercise => {
      const card = document.createElement('div');
      card.className = 'exercise-card-horizontal';
      
      const rating = exercise.rating || 0;
      
      card.innerHTML = `
        <div class="favorite-card-header">
          <span class="workout-badge">WORKOUT</span>
          <button class="delete-icon" data-id="${exercise._id}" aria-label="Remove from favorites">
            🗑
          </button>
        </div>
        
        <div class="exercise-info-wrapper">
          <div class="exercise-icon">⚡</div>
          <div class="exercise-info">
            <h3>${exercise.name}</h3>
          </div>
        </div>
        
        <div class="exercise-details">
          <span><span class="label">Burned calories:</span> <span class="value">${exercise.burnedCalories || 0} / ${exercise.time || 0} min</span></span>
          <span><span class="label">Body part:</span> <span class="value">${exercise.bodyPart || ''}</span></span>
          <span><span class="label">Target:</span> <span class="value">${exercise.target || ''}</span></span>
        </div>
        
        <div class="favorite-card-footer">
          <button class="start-btn-fav" data-id="${exercise._id}">
            Start
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12.172 7L6.808 1.636L8.222 0.222L16 8L8.222 15.778L6.808 14.364L12.172 9H0V7H12.172Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      `;

      favoritesContent.appendChild(card);
    });

    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-icon').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const exerciseId = btn.getAttribute('data-id');
        if (confirm('Remove this exercise from favorites?')) {
          removeFavorite(exerciseId);
        }
      });
    });

    // Add event listeners to start buttons - opens modal
    document.querySelectorAll('.start-btn-fav').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const exerciseId = btn.getAttribute('data-id');
        const exercise = favorites.find(fav => fav._id === exerciseId);
        if (exercise) {
          openExerciseModal(exercise);
        }
      });
    });
  }

  // === LOAD DAILY QUOTE ===
  async function loadQuote() {
    try {
      const res = await fetch(`${API_BASE}/quote`);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      if (data?.quote && data?.author) {
        if (quoteText) quoteText.textContent = data.quote;
        if (quoteAuthor) quoteAuthor.textContent = data.author;
      } else {
        if (quoteText) quoteText.textContent = "Quote not available";
        if (quoteAuthor) quoteAuthor.textContent = "";
      }
    } catch (err) {
      console.error('Error loading quote:', err);
      if (quoteText) quoteText.textContent = "A lot of times I find that people who are blessed with the most talent don't ever develop that attitude, and the ones who aren't blessed in that way are the most competitive and have the biggest heart.";
      if (quoteAuthor) quoteAuthor.textContent = "Tom Brady";
    }
  }

  // === OPEN EXERCISE MODAL ===
  function openExerciseModal(exercise) {
    const modal = document.getElementById('exercise-modal');
    if (!modal) return;

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

    // Update favorites button state
    updateFavoriteButton(exercise._id);

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // === CLOSE EXERCISE MODAL ===
  function closeExerciseModal() {
    const modal = document.getElementById('exercise-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // === MODAL EVENT LISTENERS ===
  const modalCloseBtn = document.getElementById('modal-close');
  const modalOverlay = document.querySelector('.modal-overlay');
  
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeExerciseModal);
  }
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeExerciseModal();
        closeRatingModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeExerciseModal();
      closeRatingModal();
    }
  });

  // === FAVORITES BUTTON FUNCTIONALITY ===
  function updateFavoriteButton(exerciseId) {
    const addFavoritesBtn = document.getElementById('modal-add-favorites');
    if (!addFavoritesBtn) return;
    
    const favorites = getFavorites();
    const isFavorite = favorites.some(fav => fav._id === exerciseId);
    
    if (isFavorite) {
      addFavoritesBtn.innerHTML = 'Remove from favorites ♥';
      addFavoritesBtn.style.color = '#EEA10C';
      addFavoritesBtn.style.borderColor = '#EEA10C';
    } else {
      addFavoritesBtn.innerHTML = 'Add to favorites ♡';
      addFavoritesBtn.style.color = '#F4F4F4';
      addFavoritesBtn.style.borderColor = 'rgba(244, 244, 244, 0.2)';
    }
  }

  const addFavoritesBtn = document.getElementById('modal-add-favorites');
  if (addFavoritesBtn) {
    addFavoritesBtn.addEventListener('click', () => {
      if (!currentExercise) return;

      const favorites = getFavorites();
      const exerciseId = currentExercise._id;
      const favoriteIndex = favorites.findIndex(fav => fav._id === exerciseId);

      if (favoriteIndex > -1) {
        favorites.splice(favoriteIndex, 1);
        saveFavorites(favorites);
        updateFavoriteButton(exerciseId);
        alert('Removed from favorites!');
        displayFavorites();
      } else {
        favorites.push(currentExercise);
        saveFavorites(favorites);
        updateFavoriteButton(exerciseId);
        alert('Added to favorites!');
        displayFavorites();
      }
    });
  }

  // === RATING MODAL FUNCTIONALITY ===
  const ratingModal = document.getElementById('rating-modal');
  const ratingModalClose = document.getElementById('rating-modal-close');
  const ratingForm = document.getElementById('rating-form');
  const ratingStarsInput = document.querySelectorAll('.star-input');
  const ratingCurrent = document.querySelector('.rating-current');
  const giveRatingBtn = document.getElementById('modal-give-rating');
  
  let selectedRating = 0;

  function openRatingModal() {
    if (!ratingModal) return;
    closeExerciseModal();
    ratingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    selectedRating = 0;
    updateRatingStars(0);
    if (ratingCurrent) ratingCurrent.textContent = '0.0';
    if (ratingForm) ratingForm.reset();
  }

  function closeRatingModal() {
    if (ratingModal) {
      ratingModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function updateRatingStars(rating) {
    ratingStarsInput.forEach((star) => {
      const starValue = parseFloat(star.getAttribute('data-rating'));
      if (starValue <= rating) {
        star.classList.add('active');
        star.textContent = '⭐';
      } else {
        star.classList.remove('active');
        star.textContent = '☆';
      }
    });
  }

  ratingStarsInput.forEach(star => {
    star.addEventListener('click', () => {
      const rating = parseFloat(star.getAttribute('data-rating'));
      selectedRating = rating;
      updateRatingStars(rating);
      if (ratingCurrent) ratingCurrent.textContent = rating.toFixed(1);
    });

    star.addEventListener('mouseenter', () => {
      const rating = parseFloat(star.getAttribute('data-rating'));
      updateRatingStars(rating);
    });
  });

  const ratingStarsContainer = document.querySelector('.rating-stars-input');
  if (ratingStarsContainer) {
    ratingStarsContainer.addEventListener('mouseleave', () => {
      updateRatingStars(selectedRating);
    });
  }

  if (giveRatingBtn) {
    giveRatingBtn.addEventListener('click', () => {
      if (!currentExercise) {
        alert('No exercise selected');
        return;
      }
      openRatingModal();
    });
  }

  if (ratingModalClose) {
    ratingModalClose.addEventListener('click', closeRatingModal);
  }

  if (ratingForm) {
    ratingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!currentExercise) {
        alert('No exercise selected');
        return;
      }

      if (selectedRating === 0) {
        alert('Please select a rating');
        return;
      }

      const email = document.getElementById('rating-email').value.trim();
      const comment = document.getElementById('rating-comment').value.trim();

      if (!email || !comment) {
        alert('Please fill in all fields');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/exercises/${currentExercise._id}/rating`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            rate: selectedRating,
            email: email,
            review: comment
          })
        });

        if (!res.ok) {
          throw new Error('Failed to submit rating');
        }

        const data = await res.json();
        
        const ratings = JSON.parse(localStorage.getItem('ratings') || '[]');
        ratings.push({
          exerciseId: currentExercise._id,
          exerciseName: currentExercise.name,
          rating: selectedRating,
          email: email,
          comment: comment,
          date: new Date().toISOString()
        });
        localStorage.setItem('ratings', JSON.stringify(ratings));

        alert('Rating submitted successfully!');
        closeRatingModal();
      } catch (err) {
        console.error('Error submitting rating:', err);
        alert('Failed to submit rating. Please try again.');
      }
    });
  }

  // === SUBSCRIPTION ===
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

  // === INITIALIZATION ===
  loadQuote();
  displayFavorites();
});