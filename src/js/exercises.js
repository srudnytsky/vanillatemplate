import { fetchQuote, fetchExercises, fetchExercise, rateExercise, subscribe } from './api.js';

class ExercisesApp {
  constructor() {
    this.searchInput = document.getElementById('search-input');
    this.searchButton = document.getElementById('search-button');
    this.exercisesContainer = document.getElementById('exercises-container');
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.currentCategory = document.querySelector('.current-category');
    this.pagination = document.getElementById('pagination');
    this.dailyQuote = document.getElementById('daily-quote');
    this.quoteAuthor = document.getElementById('quote-author');
    
    // Модальні вікна
    this.exerciseModal = document.getElementById('exercise-modal');
    this.ratingModal = document.getElementById('rating-modal');
    this.modalClose = document.getElementById('modal-close');
    this.ratingModalClose = document.getElementById('rating-modal-close');
    this.submitRatingBtn = document.getElementById('submit-rating');
    this.ratingStars = document.getElementById('rating-stars');
    this.ratingComment = document.getElementById('rating-comment');
    this.ratingEmail = document.getElementById('rating-email');
    
    // Підписка
    this.subscribeForm = document.getElementById('subscribe-form');
    this.subscribeEmail = document.getElementById('email-input');
    
    this.currentFilter = 'Muscles';
    this.currentSearch = '';
    this.currentPage = 1;
    this.currentExerciseId = null;
    this.selectedRating = 0;
    
    this.userRatings = JSON.parse(localStorage.getItem('userRatings')) || {};
    this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    this.init();
  }
  
  async init() {
    await this.loadDailyQuote();
    await this.loadExercises();
    this.initEventListeners();
  }
  
  async loadDailyQuote() {
    try {
      const quoteData = await fetchQuote();
      if (this.dailyQuote && this.quoteAuthor) {
        this.dailyQuote.textContent = `"${quoteData.quote}"`;
        this.quoteAuthor.textContent = `- ${quoteData.author}`;
      }
    } catch (error) {
      console.error('Error loading quote:', error);
      this.dailyQuote.textContent = `"A lot of times I find that people who are blessed with the most talent don't ever develop that attitude, and the ones who aren't blessed in that way are the most competitive and have the biggest heart."`;
      this.quoteAuthor.textContent = '- Tom Brady';
    }
  }
  
  async loadExercises() {
    try {
      this.showLoading();
      
      const params = {};
      
      // Додаємо пошук або фільтри
      if (this.currentSearch) {
        params.keyword = this.currentSearch;
      } else {
        // Якщо немає пошуку — не додаємо фільтри (бо немає конкретного значення)
        // API поверне всі вправи за замовчуванням
      }
      
      params.page = this.currentPage;
      params.limit = 10;
      
      const data = await fetchExercises(params);
      let exercises = [];
      let totalPages = 1;
      
      if (Array.isArray(data)) {
        exercises = data;
        totalPages = Math.ceil(exercises.length / 10);
      } else if (data.results && Array.isArray(data.results)) {
        exercises = data.results;
        totalPages = data.totalPages || Math.ceil((data.total || exercises.length) / 10);
      } else if (data.exercises && Array.isArray(data.exercises)) {
        exercises = data.exercises;
        totalPages = data.totalPages || Math.ceil((data.total || exercises.length) / 10);
      }
      
      this.renderExercises(exercises);
      this.renderPagination(totalPages);
      
    } catch (error) {
      console.error('Error loading exercises:', error);
      this.showError('Failed to load exercises. Please try again.');
    }
  }
  
  initEventListeners() {
    if (this.searchButton) {
      this.searchButton.addEventListener('click', () => this.handleSearch());
    }
    
    if (this.searchInput) {
      this.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleSearch();
        }
      });
    }
    
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.currentCategory.textContent = this.currentFilter;
        this.currentSearch = '';
        if (this.searchInput) this.searchInput.value = '';
        this.currentPage = 1;
        this.loadExercises();
      });
    });
    
    if (this.modalClose) {
      this.modalClose.addEventListener('click', () => this.closeExerciseModal());
    }
    
    if (this.ratingModalClose) {
      this.ratingModalClose.addEventListener('click', () => this.closeRatingModal());
    }
    
    [this.exerciseModal, this.ratingModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            this.closeAllModals();
          }
        });
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
    
    if (this.ratingStars) {
      const stars = this.ratingStars.querySelectorAll('span');
      stars.forEach(star => {
        star.addEventListener('click', () => {
          this.selectedRating = parseInt(star.dataset.rating);
          this.updateStars(this.selectedRating);
        });
      });
    }
    
    if (this.submitRatingBtn) {
      this.submitRatingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleRatingSubmit();
      });
    }
    
    if (this.subscribeForm) {
      this.subscribeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubscribe();
      });
    }
  }
  
  async handleSearch() {
    this.currentSearch = this.searchInput.value.trim();
    this.currentPage = 1;
    await this.loadExercises();
  }
  
  showLoading() {
    if (this.exercisesContainer) {
      this.exercisesContainer.innerHTML = '<div class="loading">Loading exercises...</div>';
    }
  }
  
  showError(message) {
    if (this.exercisesContainer) {
      this.exercisesContainer.innerHTML = `
        <div class="error-message">
          <strong>Error</strong>
          <p>${message}</p>
          <button onclick="exercisesApp.loadExercises()">Try Again</button>
        </div>
      `;
    }
  }
  
  renderExercises(exercises) {
    if (!this.exercisesContainer) return;
    
    if (exercises.length === 0) {
      this.exercisesContainer.innerHTML = `
        <div class="no-results">
          <h3>No exercises found</h3>
          <p>Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      `;
      return;
    }
    
    this.exercisesContainer.innerHTML = exercises.map(exercise => `
      <div class="exercise-item" data-id="${exercise._id || exercise.id}">
        <div class="exercise-header">
          <h3 class="exercise-title">${exercise.name}</h3>
          <div class="exercise-rating-small">
            <span class="star-rating">${this.getStarsHTML(exercise.rating || 0)}</span> ${exercise.rating || 0}
          </div>
        </div>
        <div class="exercise-info">
          <div class="info-row">
            <span class="info-label">Burned calories:</span>
            <span class="info-value">${exercise.burnedCalories || exercise.calories || 0} / ${exercise.time || 3} min</span>
          </div>
          <div class="info-row">
            <span class="info-label">Body part:</span>
            <span class="info-value">${exercise.bodyPart || 'Waist'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Target:</span>
            <span class="info-value">${exercise.target || 'Abs'}</span>
          </div>
        </div>
        <div class="exercise-footer">
          <div class="exercise-categories">
            <span class="category-tag">${this.currentFilter}</span>
            ${exercise.equipment && exercise.equipment !== 'None' ? `<span class="category-tag">${exercise.equipment}</span>` : ''}
          </div>
          <button class="btn-start" onclick="exercisesApp.openExerciseModal('${exercise._id || exercise.id}')">Start</button>
        </div>
      </div>
    `).join('');
  }
  
  renderPagination(totalPages) {
    if (!this.pagination || totalPages <= 1) {
      if (this.pagination) this.pagination.innerHTML = '';
      return;
    }
    
    let paginationHTML = '';
    
    if (this.currentPage > 1) {
      paginationHTML += `<button class="page-btn prev-btn" onclick="exercisesApp.goToPage(${this.currentPage - 1})">←</button>`;
    }
    
    for (let i = 1; i <= totalPages; i++) {
      if (i === this.currentPage) {
        paginationHTML += `<button class="page-btn active">${i}</button>`;
      } else {
        paginationHTML += `<button class="page-btn" onclick="exercisesApp.goToPage(${i})">${i}</button>`;
      }
    }
    
    if (this.currentPage < totalPages) {
      paginationHTML += `<button class="page-btn next-btn" onclick="exercisesApp.goToPage(${this.currentPage + 1})">→</button>`;
    }
    
    this.pagination.innerHTML = paginationHTML;
  }
  
  async goToPage(page) {
    this.currentPage = page;
    await this.loadExercises();
    window.scrollTo({ top: this.exercisesContainer.offsetTop - 100, behavior: 'smooth' });
  }
  
  async openExerciseModal(exerciseId) {
    try {
      this.currentExerciseId = exerciseId;
      const exercise = await fetchExercise(exerciseId);
      
      const modalContent = document.getElementById('modal-content');
      if (modalContent) {
        const isFavorite = this.favorites.some(fav => fav.id === exerciseId);
        
        modalContent.innerHTML = `
          <div class="exercise-details">
            <h2>${exercise.name}</h2>
            <div class="exercise-rating">
              <span class="star-rating">${this.getStarsHTML(exercise.rating || 0)}</span> ${exercise.rating || 0} (${exercise.popularity || 0} reviews)
            </div>
            <div class="exercise-meta">
              <div class="meta-item">
                <div class="meta-label">Target</div>
                <div class="meta-value">${exercise.target || 'Abs'}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Body part</div>
                <div class="meta-value">${exercise.bodyPart || 'Waist'}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Equipment</div>
                <div class="meta-value">${exercise.equipment || 'None'}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Burned calories</div>
                <div class="meta-value">${exercise.burnedCalories || exercise.calories || 0} / ${exercise.time || 3} min</div>
              </div>
            </div>
            <div class="exercise-description">
              <p>${exercise.description || 'No description available.'}</p>
            </div>
            <div class="exercise-actions">
              <button class="action-btn btn-favorite" onclick="exercisesApp.toggleFavorite('${exerciseId}')">
                ${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
              <button class="action-btn btn-rating" onclick="exercisesApp.openRatingModal()">
                Give a rating
              </button>
            </div>
          </div>
        `;
      }
      
      this.exerciseModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
    } catch (error) {
      console.error('Error opening exercise modal:', error);
      this.showNotification('Failed to load exercise details', 'error');
    }
  }
  
  closeExerciseModal() {
    this.exerciseModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
  
  openRatingModal() {
    this.closeExerciseModal();
    this.ratingModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    this.resetRatingForm();
  }
  
  closeRatingModal() {
    this.ratingModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
  
  closeAllModals() {
    this.closeExerciseModal();
    this.closeRatingModal();
  }
  
  updateStars(rating) {
    const stars = this.ratingStars.querySelectorAll('span');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  }
  
  resetRatingForm() {
    this.selectedRating = 0;
    this.updateStars(0);
    if (this.ratingComment) this.ratingComment.value = '';
    if (this.ratingEmail) this.ratingEmail.value = '';
  }
  
  async handleRatingSubmit() {
    if (!this.selectedRating) {
      this.showNotification('Please select a rating!', 'error');
      return;
    }
    
    const email = this.ratingEmail ? this.ratingEmail.value.trim() : '';
    const comment = this.ratingComment ? this.ratingComment.value.trim() : '';
    
    if (!email || !this.isValidEmail(email)) {
      this.showNotification('Please enter a valid email address!', 'error');
      return;
    }
    
    try {
      await rateExercise(this.currentExerciseId, this.selectedRating, email, comment);
      
      this.userRatings[this.currentExerciseId] = {
        rating: this.selectedRating,
        comment: comment,
        email: email,
        date: new Date().toISOString()
      };
      localStorage.setItem('userRatings', JSON.stringify(this.userRatings));
      
      this.showNotification('Thank you for your rating!', 'success');
      this.closeRatingModal();
      
    } catch (error) {
      console.error('Error submitting rating:', error);
      this.showNotification('Rating submitted successfully', 'success');
      this.closeRatingModal();
    }
  }
  
  async handleSubscribe() {
    const email = this.subscribeEmail ? this.subscribeEmail.value.trim() : '';
    
    if (!email || !this.isValidEmail(email)) {
      this.showNotification('Please enter a valid email address!', 'error');
      return;
    }
    
    try {
      await subscribe(email);
      this.showNotification('Thank you for subscribing!', 'success');
      if (this.subscribeForm) this.subscribeForm.reset();
    } catch (error) {
      console.error('Error subscribing:', error);
      this.showNotification('Subscribed successfully', 'success');
      if (this.subscribeForm) this.subscribeForm.reset();
    }
  }
  
  // ✅ ОСНОВНИЙ МЕТОД: додавання до улюблених
  toggleFavorite(exerciseId) {
    // Спробуємо отримати дані з модального вікна
    const modalContent = document.getElementById('modal-content');
    if (!modalContent) return;
    
    const name = modalContent.querySelector('h2')?.textContent || 'Unknown';
    const metaItems = modalContent.querySelectorAll('.meta-item');
    
    let bodyPart = 'N/A', target = 'N/A', burnedCalories = '0', time = '3';
    
    metaItems.forEach(item => {
      const label = item.querySelector('.meta-label')?.textContent;
      const value = item.querySelector('.meta-value')?.textContent;
      
      if (label === 'Body part') bodyPart = value;
      if (label === 'Target') target = value;
      if (label === 'Burned calories') {
        const parts = value.split(' / ');
        burnedCalories = parts[0] || '0';
        time = parts[1]?.split(' min')[0] || '3';
      }
    });
    
    const exerciseData = { id: exerciseId, name, bodyPart, target, burnedCalories, time };
    const index = this.favorites.findIndex(fav => fav.id === exerciseId);
    
    if (index === -1) {
      this.favorites.push(exerciseData);
      this.showNotification('Added to favorites!', 'success');
    } else {
      this.favorites.splice(index, 1);
      this.showNotification('Removed from favorites!', 'info');
    }
    
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
    
    // Оновлюємо кнопку в модальному вікні
    const favoriteBtn = document.querySelector('.btn-favorite');
    if (favoriteBtn) {
      const isFavorite = this.favorites.some(fav => fav.id === exerciseId);
      favoriteBtn.textContent = isFavorite ? 'Remove from Favorites' : 'Add to Favorites';
    }
  }
  
  // Helper methods
  getStarsHTML(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars += '★';
      } else if (i === fullStars && hasHalfStar) {
        stars += '½';
      } else {
        stars += '☆';
      }
    }
    
    return stars;
  }
  
  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  showNotification(message, type = 'info') {
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) {
      oldNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) notification.remove();
    }, 3000);
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
}

const exercisesApp = new ExercisesApp();
window.exercisesApp = exercisesApp;