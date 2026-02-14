// Конфігурація API
const API_BASE_URL = 'https://your-energy.b.goit.study/api';
let currentExerciseId = null;
let currentExerciseData = null;

// DOM елементи
const quoteText = document.getElementById('daily-quote');
const quoteAuthor = document.getElementById('quote-author');
const exerciseName = document.getElementById('exercise-name');
const exerciseBadge = document.getElementById('exercise-badge');
const ratingValue = document.getElementById('rating-value');
const caloriesSpan = document.getElementById('calories');
const bodyPartSpan = document.getElementById('body-part');
const targetSpan = document.getElementById('target');
const timeSpan = document.getElementById('time');
const gifContainer = document.getElementById('gif-container');
const gifLabel = document.getElementById('gif-label');
const instructionsList = document.getElementById('instructions-list');
const similarGrid = document.getElementById('similar-grid');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const ratingContainer = document.getElementById('rating-container');
const startButton = document.getElementById('start-workout');
const playButton = document.getElementById('play-button');
const subscribeForm = document.getElementById('subscribe-form');

// Отримання ID з URL
function getExerciseIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Завантаження цитати дня
async function loadQuote() {
  try {
    const response = await fetch(`${API_BASE_URL}/quote`);
    if (!response.ok) throw new Error('Failed to load quote');
    const data = await response.json();
    
    quoteText.textContent = data.quote || 'A lot of times I find that people who are blessed with the most talent don\'t ever develop that attitude, and the ones who aren\'t blessed in that way are the most competitive and have the biggest heart.';
    quoteAuthor.textContent = data.author || 'Tom Brady';
  } catch (error) {
    console.error('Error loading quote:', error);
    // Використовуємо значення за замовчуванням
    quoteText.textContent = 'A lot of times I find that people who are blessed with the most talent don\'t ever develop that attitude, and the ones who aren\'t blessed in that way are the most competitive and have the biggest heart.';
    quoteAuthor.textContent = 'Tom Brady';
  }
}

// Завантаження даних вправи
async function loadExerciseDetails(exerciseId) {
  try {
    const response = await fetch(`${API_BASE_URL}/exercises/${exerciseId}`);
    if (!response.ok) throw new Error('Failed to load exercise');
    const data = await response.json();
    
    currentExerciseData = data;
    displayExerciseDetails(data);
    return data;
  } catch (error) {
    console.error('Error loading exercise:', error);
    // Показуємо повідомлення про помилку
    exerciseName.textContent = 'Failed to load exercise';
    return null;
  }
}

// Відображення деталей вправи
function displayExerciseDetails(exercise) {
  if (!exercise) return;
  
  // Оновлюємо заголовок
  document.getElementById('exercise-category').textContent = exercise.bodyPart || 'Waist';
  
  // Основна інформація
  exerciseName.textContent = exercise.name || 'Unknown';
  exerciseBadge.textContent = exercise.equipment || 'WORKOUT';
  ratingValue.textContent = exercise.rating?.toFixed(1) || '4.0';
  
  // Статистика
  caloriesSpan.textContent = exercise.burnedCalories ? `${exercise.burnedCalories} / ${exercise.time || 3} min` : '—';
  bodyPartSpan.textContent = exercise.bodyPart || '—';
  targetSpan.textContent = exercise.target || '—';
  timeSpan.textContent = exercise.time ? `${exercise.time} min` : '—';
  
  // GIF
  if (exercise.gifUrl) {
    gifContainer.innerHTML = `
      <img src="${exercise.gifUrl}" alt="${exercise.name}" style="width:100%; height:100%; object-fit:cover; border-radius:15px;" />
      <div class="gif-overlay" style="position:absolute; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.3s;">
        <button class="play-button" style="width:60px; height:60px; border-radius:50%; background:white; border:none; font-size:24px; cursor:pointer;">▶</button>
      </div>
    `;
    
    // Додаємо обробник для нової кнопки
    const newPlayButton = gifContainer.querySelector('.play-button');
    if (newPlayButton) {
      newPlayButton.addEventListener('click', () => {
        alert('Video demo would play here');
      });
    }
  } else {
    gifLabel.textContent = 'Demo not available';
  }
  
  // Інструкції
  if (exercise.description) {
    const steps = exercise.description.split('. ').filter(s => s.trim());
    if (steps.length > 0) {
      instructionsList.innerHTML = steps.map(step => `<li>${step}</li>`).join('');
    } else {
      instructionsList.innerHTML = `<li>${exercise.description}</li>`;
    }
  } else {
    instructionsList.innerHTML = '<li>No instructions available</li>';
  }
}

// Пошук схожих вправ
async function searchSimilarExercises(keyword) {
  if (!keyword || keyword.length < 3) return [];
  
  try {
    const response = await fetch(`${API_BASE_URL}/exercises?keyword=${encodeURIComponent(keyword)}&limit=5`);
    if (!response.ok) throw new Error('Search failed');
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching exercises:', error);
    return [];
  }
}

// Відображення результатів пошуку
function displaySearchResults(results) {
  if (!results || results.length === 0) {
    similarGrid.innerHTML = '<div class="similar-item placeholder">No exercises found</div>';
    return;
  }
  
  // Фільтруємо поточну вправу
  const filteredResults = results.filter(ex => ex._id !== currentExerciseId);
  
  if (filteredResults.length === 0) {
    similarGrid.innerHTML = '<div class="similar-item placeholder">No similar exercises found</div>';
    return;
  }
  
  similarGrid.innerHTML = filteredResults.map(ex => `
    <div class="similar-item" data-id="${ex._id}">
      <span class="similar-name">${ex.name}</span>
      <span class="similar-target">${ex.target || ex.bodyPart}</span>
    </div>
  `).join('');
  
  // Додаємо обробники кліку
  document.querySelectorAll('.similar-item[data-id]').forEach(item => {
    item.addEventListener('click', () => {
      window.location.href = `exercise-detail.html?id=${item.dataset.id}`;
    });
  });
}

// Оновлення рейтингу
async function updateExerciseRating(exerciseId, rating) {
  try {
    const response = await fetch(`${API_BASE_URL}/exercises/${exerciseId}/rating`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating rating:', error);
    return false;
  }
}

// Підписка на email
async function subscribeEmail(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error subscribing:', error);
    return false;
  }
}

// Ініціалізація
document.addEventListener('DOMContentLoaded', async function() {
  // Отримуємо ID з URL
  currentExerciseId = getExerciseIdFromUrl();
  
  if (!currentExerciseId) {
    alert('No exercise ID provided');
    return;
  }
  
  // Завантажуємо цитату
  await loadQuote();
  
  // Завантажуємо деталі вправи
  const exercise = await loadExerciseDetails(currentExerciseId);
  
  // Якщо вправа завантажилась, робимо пошук за її назвою
  if (exercise && exercise.name) {
    setTimeout(async () => {
      searchInput.value = exercise.name;
      const results = await searchSimilarExercises(exercise.name);
      displaySearchResults(results);
    }, 500);
  }
  
  // === Бургер-меню ===
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeBtn = document.querySelector('.mobile-menu-close');
  
  if (menuToggle && mobileMenu && closeBtn) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('active');
    });
    
    closeBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });
    
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        mobileMenu.classList.remove('active');
      }
    });
  }
  
  // === Пошук ===
  async function performSearch() {
    const keyword = searchInput.value.trim();
    if (keyword.length < 3) {
      alert('Please enter at least 3 characters');
      return;
    }
    
    searchButton.textContent = 'Searching...';
    searchButton.disabled = true;
    
    const results = await searchSimilarExercises(keyword);
    displaySearchResults(results);
    
    searchButton.textContent = 'Search';
    searchButton.disabled = false;
  }
  
  if (searchButton) {
    searchButton.addEventListener('click', performSearch);
  }
  
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }
  
  // === Оновлення рейтингу ===
  if (ratingContainer) {
    ratingContainer.addEventListener('click', async () => {
      const newRating = prompt('Rate this exercise (1-5):', '4');
      if (newRating && !isNaN(newRating) && newRating >= 1 && newRating <= 5) {
        const success = await updateExerciseRating(currentExerciseId, parseFloat(newRating));
        if (success) {
          ratingValue.textContent = parseFloat(newRating).toFixed(1);
          alert('Rating updated!');
        } else {
          alert('Failed to update rating');
        }
      }
    });
  }
  
  // === Кнопка Start Workout ===
  if (startButton) {
    startButton.addEventListener('click', () => {
      alert('Starting workout... Get ready!');
    });
  }
  
  // === Play button для GIF ===
  if (playButton) {
    playButton.addEventListener('click', () => {
      alert('Video demo would play here');
    });
  }
  
  // === Підписка ===
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = e.target.querySelector('input[type="email"]').value;
      const button = e.target.querySelector('button');
      const originalText = button.textContent;
      
      button.textContent = 'Sending...';
      button.disabled = true;
      
      const success = await subscribeEmail(email);
      
      if (success) {
        alert('Thank you for subscribing!');
        e.target.reset();
      } else {
        alert('Subscription failed. Please try again.');
      }
      
      button.textContent = originalText;
      button.disabled = false;
    });
  }
});