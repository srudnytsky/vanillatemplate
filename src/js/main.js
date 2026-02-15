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

  const grid = document.getElementById('exercises-grid');
  const pagination = document.getElementById('pagination');
  const tabs = document.querySelectorAll('.tab-btn');
  const quoteText = document.querySelector('.quote-text');
  const quoteAuthor = document.querySelector('.quote-author');
  const subscribeForm = document.getElementById('subscribe-form');
  const categoryTitle = document.getElementById('current-category');
  const searchInput = document.getElementById('exercise-search');
  const searchBtn = document.getElementById('search-btn');

  let currentPage = 1;
  const limit = 12;
  let selectedCategory = null;
  let currentFilterType = null;
  let searchQuery = '';

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

  // === Load category list ===
  async function loadFilters(filterName = 'Body parts') {
    try {
      grid.innerHTML = 'Loading categories...';
      grid.classList.add('category-grid');
      pagination.innerHTML = '';
      if (categoryTitle) categoryTitle.textContent = '';

      const encodedFilter = encodeURIComponent(filterName);
      const res = await fetch(`${API_BASE}/filters?filter=${encodedFilter}&page=${currentPage}&limit=${limit}`);
      if (!res.ok) throw new Error('Error loading filters');
      
      const data = await res.json();

      if (data?.results?.length > 0) {
        const typeMap = {
          'Body parts': 'bodyPart',
          'Muscles': 'muscles',
          'Equipment': 'equipment'
        };
        currentFilterType = typeMap[filterName] || 'bodyPart';
        renderCategories(data.results, filterName);
        renderPagination(data.totalPages);
      } else {
        grid.innerHTML = 'Categories not found';
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      grid.innerHTML = 'Error loading categories';
    }
  }

  // === Display category cards ===
  function renderCategories(items, filterName) {
    grid.innerHTML = '';
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'exercise-card';

      const apiValue = item.name.toLowerCase().replace(/\s+/g, '-');
      const imgURL = item.imgURL || '';

      card.innerHTML = `
        <img src="${imgURL}" alt="${item.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">
        <div class="exercise-overlay">
          <h3>${item.name}</h3>
          <div class="category">${filterName}</div>
        </div>
      `;

      card.addEventListener('click', () => {
        selectedCategory = apiValue;
        currentPage = 1;
        if (categoryTitle) categoryTitle.textContent = item.name;
        loadExercises();
      });

      grid.appendChild(card);
    });
  }

  // === Load exercises by selected category ===
  async function loadExercises() {
    if (!selectedCategory || !currentFilterType) return;

    try {
      grid.innerHTML = 'Loading exercises...';
      grid.classList.remove('category-grid');
      pagination.innerHTML = '';

      const params = new URLSearchParams({
        [currentFilterType]: selectedCategory,
        page: currentPage,
        limit: limit
      });

      // Add search query if exists
      if (searchQuery) {
        params.append('keyword', searchQuery);
      }

      const res = await fetch(`${API_BASE}/exercises?${params.toString()}`);
      if (!res.ok) throw new Error('Error loading exercises');

      const data = await res.json();

      if (data?.results?.length > 0) {
        renderExercises(data.results);
        renderPagination(data.totalPages);
      } else {
        grid.innerHTML = '<p style="text-align: center; padding: 40px;">No exercises found</p>';
      }
    } catch (err) {
      console.error('Error loading exercises:', err);
      grid.innerHTML = 'Error loading exercises';
    }
  }

  // === Display exercises in horizontal card format ===
  function renderExercises(exercises) {
    grid.innerHTML = '';

    // "Back" button
    const backBtn = document.createElement('button');
    backBtn.textContent = '← Back to categories';
    backBtn.className = 'back-btn';
    backBtn.addEventListener('click', () => {
      selectedCategory = null;
      currentPage = 1;
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      if (categoryTitle) categoryTitle.textContent = '';
      const activeTab = document.querySelector('.tab-btn.active');
      const filterName = activeTab ? activeTab.textContent.trim() : 'Body parts';
      loadFilters(filterName);
    });
    grid.appendChild(backBtn);

    // Exercise cards in horizontal format
    exercises.forEach(ex => {
      const card = document.createElement('div');
      card.className = 'exercise-card-horizontal';

      // Calculate rating display
      const rating = ex.rating || 0;
      const fullStars = Math.floor(rating);
      const halfStar = rating % 1 >= 0.5;
      let starsHtml = '';
      for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
          starsHtml += '⭐';
        } else if (i === fullStars && halfStar) {
          starsHtml += '⭐';
        }
      }

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
        <button class="start-btn">
          Start
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12.172 7L6.808 1.636L8.222 0.222L16 8L8.222 15.778L6.808 14.364L12.172 9H0V7H12.172Z" fill="currentColor"/>
          </svg>
        </button>
      `;

      // Start button click handler - opens modal
      const startBtn = card.querySelector('.start-btn');
      startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openExerciseModal(ex);
      });

      grid.appendChild(card);
    });
  }

  // === Open Exercise Modal ===
  function openExerciseModal(exercise) {
    const modal = document.getElementById('exercise-modal');
    if (!modal) return;

    // Fill modal with exercise data
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
    
    // Rating stars
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

    // Show modal
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

  // Modal event listeners
  const modalCloseBtn = document.getElementById('modal-close');
  const modalOverlay = document.querySelector('.modal-overlay');
  
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeExerciseModal);
  }
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeExerciseModal);
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeExerciseModal();
    }
  });

  // Modal action buttons (placeholder functionality)
  const addFavoritesBtn = document.getElementById('modal-add-favorites');
  const giveRatingBtn = document.getElementById('modal-give-rating');
  
  if (addFavoritesBtn) {
    addFavoritesBtn.addEventListener('click', () => {
      alert('Add to favorites functionality - to be implemented');
      // You can implement favorite functionality here
    });
  }
  
  if (giveRatingBtn) {
    giveRatingBtn.addEventListener('click', () => {
      alert('Give rating functionality - to be implemented');
      // You can implement rating functionality here
    });
  }

  // === Pagination ===
  function renderPagination(totalPages) {
    pagination.innerHTML = '';
    if (!totalPages || totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = 'page-btn';
      btn.textContent = i;
      if (i === currentPage) btn.classList.add('active');

      btn.addEventListener('click', () => {
        currentPage = i;
        if (selectedCategory) {
          loadExercises();
        } else {
          const activeTab = document.querySelector('.tab-btn.active');
          const filterName = activeTab ? activeTab.textContent.trim() : 'Body parts';
          loadFilters(filterName);
        }
      });

      pagination.appendChild(btn);
    }
  }

  // === Tab handling ===
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterName = tab.getAttribute('data-filter') || tab.textContent.trim();
      currentPage = 1;
      selectedCategory = null;
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      if (categoryTitle) categoryTitle.textContent = '';
      loadFilters(filterName);
    });
  });

  // === Search functionality ===
  if (searchBtn && searchInput) {
    const performSearch = () => {
      searchQuery = searchInput.value.trim();
      if (selectedCategory) {
        currentPage = 1;
        loadExercises();
      }
    };

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch();
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

  // Set default category
  if (categoryTitle) categoryTitle.textContent = '';

  // Activate first tab by default ("Body parts")
  const defaultTab = Array.from(tabs).find(t => t.getAttribute('data-filter') === 'Body parts' || t.textContent.trim() === 'Body parts');
  if (defaultTab) {
    defaultTab.classList.add('active');
    loadFilters('Body parts');
  } else if (tabs.length > 0) {
    tabs[0].classList.add('active');
    const filterName = tabs[0].getAttribute('data-filter') || tabs[0].textContent.trim();
    loadFilters(filterName);
  }
});