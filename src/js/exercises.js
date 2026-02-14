// Загрузка цитаты
async function loadQuote() {
  try {
    const res = await fetch('https://your-energy.b.goit.study/quote');
    const data = await res.json();
    document.getElementById('daily-quote').textContent = data.quote;
    document.getElementById('quote-author').textContent = data.author;
  } catch (err) {
    console.error('Failed to load quote', err);
  }
}

// Загрузка фильтров (Muscles, Body parts, Equipment)
async function loadFilters() {
  try {
    const res = await fetch('https://your-energy.b.goit.study/filters');
    const filters = await res.json(); // ["Muscles", "Body parts", "Equipment"]
    const container = document.getElementById('filter-tabs');
    container.innerHTML = '';
    filters.forEach(filter => {
      const btn = document.createElement('button');
      btn.className = 'filter-tab';
      if (filter === 'Body parts') btn.classList.add('active');
      btn.dataset.filter = filter;
      btn.textContent = filter;
      btn.addEventListener('click', () => handleFilterClick(filter));
      container.appendChild(btn);
    });
  } catch (err) {
    console.error('Failed to load filters', err);
  }
}

// Загрузка упражнений по категории
async function loadExercises(category = 'Waist') {
  try {
    const res = await fetch(`https://your-energy.b.goit.study/exercises?bodyPart=${encodeURIComponent(category)}`);
    const exercises = await res.json();
    const container = document.getElementById('exercises-container');
    container.innerHTML = '';
    exercises.forEach(ex => {
      const card = createExerciseCard(ex);
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to load exercises', err);
  }
}

// Создание карточки упражнения
function createExerciseCard(ex) {
  const div = document.createElement('div');
  div.className = 'exercise-item';
  div.innerHTML = `
    <div class="exercise-badge">${ex.bodyPart}</div>
    <div class="exercise-rating">
      <span class="rating-value">${ex.rating || '0'}</span>
      <span class="star-rating">★</span>
    </div>
    <div class="exercise-title">
      <div class="title-icon">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="#F4F4F4"><circle cx="12" cy="12" r="10"/></svg>
      </div>
      <h3>${ex.name}</h3>
    </div>
    <div class="exercise-details">
      <div class="detail-row">
        <span class="detail-label">Burned calories:</span>
        <span class="detail-value">${ex.calories} / 3 min</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Body part:</span>
        <span class="detail-value">${ex.bodyPart}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Target:</span>
        <span class="detail-value">${ex.target}</span>
      </div>
    </div>
    <div class="exercise-footer">
      <button class="btn-start" onclick="startExercise('${ex._id}')">Start →</button>
    </div>
  `;
  return div;
}

// Обновление рейтинга
async function submitRating(exerciseId, rating) {
  try {
    await fetch(`https://your-energy.b.goit.study/exercises/${exerciseId}/rating`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating })
    });
  } catch (err) {
    console.error('Failed to update rating', err);
  }
}

// Старт упражнения (пример)
function startExercise(id) {
  alert(`Starting exercise ${id}`);
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  loadQuote();
  loadFilters();
  loadExercises('Waist'); // default category
});

// Обработка фильтров
function handleFilterClick(filterName) {
  // В реальности нужно переключать тип фильтрации (bodyPart, equipment, muscles)
  // Для простоты оставим bodyPart
  document.querySelectorAll('.filter-tab').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  loadExercises('Waist'); // или другая логика
}