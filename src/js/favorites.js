// Favorites Page JavaScript
// Manages favorite exercises using localStorage

/**
 * Get favorites from localStorage
 * @returns {Array} Array of favorite exercises
 */
function getFavorites() {
  try {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading favorites from localStorage:', e);
    return [];
  }
}

/**
 * Save favorites to localStorage
 * @param {Array} favorites - Array of favorite exercises
 */
function saveFavorites(favorites) {
  try {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (e) {
    console.error('Error saving favorites to localStorage:', e);
  }
}

/**
 * Create HTML for an exercise card
 * @param {Object} exercise - Exercise data
 * @returns {string} HTML string
 */
function createExerciseCard(exercise) {
  // Calculate time and calories display
  const time = exercise.time || 3;
  const calories = exercise.burnedCalories || 0;
  
  return `
    <div class="exercise-card" data-id="${exercise._id || exercise.id}">
      <div class="exercise-card-header">
        <span class="workout-badge">WORKOUT</span>
        <button class="delete-btn" aria-label="Remove from favorites" data-id="${exercise._id || exercise.id}">
          <i class="far fa-trash-alt"></i>
        </button>
      </div>
      
      <div class="exercise-info">
        <div class="exercise-icon">
          <i class="fas fa-bolt"></i>
        </div>
        <h3 class="exercise-name">${exercise.name}</h3>
      </div>
      
      <div class="exercise-meta">
        <span>Burned calories: <strong>${calories} / ${time} min</strong></span>
        <span>Body part: <strong>${exercise.bodyPart || 'N/A'}</strong></span>
        <span>Target: <strong>${exercise.target || 'N/A'}</strong></span>
      </div>
      
      <div class="exercise-footer">
        <button class="start-btn" data-id="${exercise._id || exercise.id}">
          Start
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `;
}

/**
 * Render favorites on the page
 */
function renderFavorites() {
  const container = document.getElementById('favorites-container');
  const emptyState = document.getElementById('empty-state');
  
  if (!container || !emptyState) {
    console.error('Required DOM elements not found');
    return;
  }
  
  // Get favorites from localStorage
  const favorites = getFavorites();
  
  // Clear existing cards (except empty state)
  Array.from(container.children).forEach(child => {
    if (!child.classList.contains('empty-state')) {
      child.remove();
    }
  });
  
  // Show/hide empty state based on favorites
  if (favorites.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    
    // Render exercise cards
    favorites.forEach(exercise => {
      container.insertAdjacentHTML('beforeend', createExerciseCard(exercise));
    });
    
    // Add event listeners to delete buttons
    container.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const exerciseId = btn.getAttribute('data-id');
        removeFromFavorites(exerciseId);
      });
    });
    
    // Add event listeners to start buttons
    container.querySelectorAll('.start-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const exerciseId = btn.getAttribute('data-id');
        startExercise(exerciseId);
      });
    });
  }
}

/**
 * Remove exercise from favorites
 * @param {string} exerciseId - ID of exercise to remove
 */
function removeFromFavorites(exerciseId) {
  let favorites = getFavorites();
  favorites = favorites.filter(ex => (ex._id || ex.id) !== exerciseId);
  saveFavorites(favorites);
  renderFavorites();
}

/**
 * Start exercise (navigate to exercise page or modal)
 * @param {string} exerciseId - ID of exercise to start
 */
function startExercise(exerciseId) {
  console.log('Starting exercise:', exerciseId);
  // Navigate to exercise detail page or open modal
  // Example: window.location.href = `exercise.html?id=${exerciseId}`;
}

/**
 * Add exercise to favorites (to be called from other pages)
 * @param {Object} exercise - Exercise object to add
 */
function addToFavorites(exercise) {
  const favorites = getFavorites();
  const exerciseId = exercise._id || exercise.id;
  
  // Check if already in favorites
  const exists = favorites.some(ex => (ex._id || ex.id) === exerciseId);
  
  if (!exists) {
    favorites.push(exercise);
    saveFavorites(favorites);
    return true;
  }
  
  return false;
}

/**
 * Check if exercise is in favorites
 * @param {string} exerciseId - ID of exercise to check
 * @returns {boolean}
 */
function isInFavorites(exerciseId) {
  const favorites = getFavorites();
  return favorites.some(ex => (ex._id || ex.id) === exerciseId);
}

/**
 * Initialize page
 */
function initFavoritesPage() {
  // Render favorites
  renderFavorites();
  
  // Handle subscribe form
  const subscribeForm = document.getElementById('subscribe-form');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = subscribeForm.querySelector('input[type="email"]');
      const email = emailInput.value;
      
      if (email) {
        console.log('Subscribe:', email);
        // Add your subscription logic here
        alert('Thank you for subscribing!');
        subscribeForm.reset();
      }
    });
  }
  
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('active');
    });
  }
  
  if (mobileMenuClose && mobileMenu) {
    mobileMenuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initFavoritesPage);

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
  window.favoritesManager = {
    getFavorites,
    saveFavorites,
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
    renderFavorites
  };
}