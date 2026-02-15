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
    renderFavorites();
  }

  // === RENDER FAVORITES ===
  function renderFavorites() {
    if (!favoritesContent) return;

    const favorites = getFavorites();

    if (favorites.length === 0) {
      // Show empty state
      favoritesContent.innerHTML = `
        <div class="empty-state">
          It appears that you haven't added any exercises to your favorites yet. To get started, you can add exercises that you like to your favorites for easier access in the future.
        </div>
      `;
      return;
    }

    // Render exercise cards
    favoritesContent.innerHTML = '';
    
    favorites.forEach(exercise => {
      const card = document.createElement('div');
      card.className = 'favorite-exercise-card';
      
      card.innerHTML = `
        <div class="favorite-card-header">
          <span class="favorite-workout-badge">WORKOUT</span>
          <button class="favorite-delete-btn" data-id="${exercise._id}" aria-label="Remove from favorites">
            🗑
          </button>
        </div>
        
        <div class="favorite-exercise-info">
          <div class="favorite-exercise-icon">⚡</div>
          <h3 class="favorite-exercise-name">${exercise.name}</h3>
        </div>
        
        <div class="favorite-exercise-details">
          <span><span class="label">Burned calories:</span> <span class="value">${exercise.burnedCalories || 0} / ${exercise.time || 0} min</span></span>
          <span><span class="label">Body part:</span> <span class="value">${exercise.bodyPart || ''}</span></span>
          <span><span class="label">Target:</span> <span class="value">${exercise.target || ''}</span></span>
        </div>
        
        <div class="favorite-card-footer">
          <button class="favorite-start-btn" data-id="${exercise._id}">
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
    document.querySelectorAll('.favorite-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const exerciseId = btn.getAttribute('data-id');
        if (confirm('Remove this exercise from favorites?')) {
          removeFavorite(exerciseId);
        }
      });
    });

    // Add event listeners to start buttons
    document.querySelectorAll('.favorite-start-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const exerciseId = btn.getAttribute('data-id');
        const exercise = favorites.find(fav => fav._id === exerciseId);
        if (exercise) {
          // Navigate to index page or open modal
          window.location.href = `index.html`;
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
  renderFavorites();
});