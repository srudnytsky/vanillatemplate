document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = 'https://your-energy.b.goit.study/api';

  const grid = document.getElementById('exercises-grid');
  const pagination = document.getElementById('pagination');
  const tabs = document.querySelectorAll('.tab-btn');
  const quoteText = document.querySelector('.quote-text');
  const quoteAuthor = document.querySelector('.quote-author');
  const subscribeForm = document.getElementById('subscribe-form');
  const currentCategoryEl = document.getElementById('current-category');

  let currentFilterType = 'bodyPart'; // по умолчанию — Body parts
  let currentCategory = 'Waist';     // по умолчанию — Waist
  let currentPage = 1;
  const limit = 12;

  /* =========================
     QUOTE OF THE DAY
  ========================== */
  async function loadQuote() {
    try {
      const res = await fetch(`${API_BASE}/quote`);
      const data = await res.json();
      if (data?.quote && data?.author) {
        quoteText.textContent = data.quote;
        quoteAuthor.textContent = data.author;
      }
    } catch (err) {
      console.error('Quote error:', err);
      quoteText.textContent = "Stay consistent. Progress takes time.";
      quoteAuthor.textContent = "— Unknown";
    }
  }

  /* =========================
     LOAD FILTER VALUES (e.g., ["Waist", "Back", ...])
  ========================== */
  async function loadFilterValues(filterType) {
    try {
      const res = await fetch(`${API_BASE}/filters`);
      const filters = await res.json();
      return filters[filterType] || [];
    } catch (err) {
      console.error('Failed to load filter values:', err);
      return [];
    }
  }

  /* =========================
     LOAD EXERCISES BY CATEGORY
  ========================== */
  async function loadExercises() {
    try {
      const url = new URL(`${API_BASE}/exercises`);
      url.searchParams.set(currentFilterType, currentCategory);
      url.searchParams.set('page', currentPage);
      url.searchParams.set('limit', limit);

      grid.innerHTML = '<p>Loading exercises...</p>';

      const res = await fetch(url);
      const data = await res.json();

      if (data?.results?.length > 0) {
        renderExercises(data.results);
        renderPagination(data.totalPages);
        updateCategoryDisplay();
      } else {
        grid.innerHTML = '<p>No exercises found.</p>';
        pagination.innerHTML = '';
      }
    } catch (err) {
      console.error('Exercises error:', err);
      grid.innerHTML = '<p>Failed to load exercises.</p>';
      pagination.innerHTML = '';
    }
  }

  /* =========================
     RENDER EXERCISE CARDS (точно по макету)
  ========================== */
  function renderExercises(exercises) {
    grid.innerHTML = '';

    // Группируем по парам (2 карточки в строке)
    for (let i = 0; i < exercises.length; i += 2) {
      const row = document.createElement('div');
      row.className = 'exercise-row';
      row.style.display = 'flex';
      row.style.gap = '16px';
      row.style.marginBottom = '32px';

      exercises.slice(i, i + 2).forEach(ex => {
        const card = createExerciseCard(ex);
        row.appendChild(card);
      });

      grid.appendChild(row);
    }
  }

  function createExerciseCard(ex) {
    const card = document.createElement('div');
    card.className = 'exercise-card';
    card.style.width = '442px';
    card.style.height = '141px';
    card.style.background = '#FFFFFF';
    card.style.borderRadius = '15px';
    card.style.position = 'relative';
    card.style.cursor = 'pointer';

    // Переход на детальную страницу
    card.addEventListener('click', () => {
      window.location.href = `exercise-detail.html?id=${ex._id}`;
    });

    // Badge
    const badge = document.createElement('div');
    badge.textContent = ex.workoutType || 'WORKOUT';
    Object.assign(badge.style, {
      position: 'absolute',
      left: '16px',
      bottom: '99px',
      padding: '5px 8px',
      border: '1px solid #242424',
      borderRadius: '15px',
      fontWeight: '500',
      fontSize: '12px',
      lineHeight: '16px',
      color: '#242424'
    });

    // Rating
    const rating = document.createElement('div');
    rating.style.position = 'absolute';
    rating.style.left = '108px';
    rating.style.top = '20px';
    rating.style.display = 'flex';
    rating.style.alignItems = 'center';
    rating.style.gap = '2px';

    const ratingText = document.createElement('span');
    ratingText.textContent = ex.rating ? ex.rating.toFixed(1) : '0.0';
    ratingText.style.fontSize = '12px';
    ratingText.style.color = '#242424';

    const star = document.createElement('div');
    star.style.width = '18px';
    star.style.height = '18px';
    star.style.background = '#EEA10C';
    star.style.borderRadius = '1px';

    rating.appendChild(ratingText);
    rating.appendChild(star);

    // Title
    const titleDiv = document.createElement('div');
    titleDiv.style.position = 'absolute';
    titleDiv.style.left = '16px';
    titleDiv.style.top = '67px';
    titleDiv.style.display = 'flex';
    titleDiv.style.alignItems = 'center';
    titleDiv.style.gap = '16px';

    const icon = document.createElement('div');
    icon.style.width = '24px';
    icon.style.height = '24px';
    icon.style.background = '#242424';
    icon.style.borderRadius = '50%';

    const titleText = document.createElement('div');
    titleText.textContent = ex.name || 'Unknown exercise';
    titleText.style.fontSize = '24px';
    titleText.style.lineHeight = '32px';
    titleText.style.color = '#242424';

    titleDiv.appendChild(icon);
    titleDiv.appendChild(titleText);

    // Info block
    const infoBlock = document.createElement('div');
    infoBlock.style.position = 'absolute';
    infoBlock.style.left = '16px';
    infoBlock.style.top = '107px';
    infoBlock.style.display = 'flex';
    infoBlock.style.gap = '16px';

    const addInfo = (label, value) => {
      const span = document.createElement('span');
      span.innerHTML = `<span style="color:rgba(36,36,36,0.4);">${label}:</span> ${value}`;
      span.style.fontSize = '12px';
      span.style.lineHeight = '18px';
      return span;
    };

    infoBlock.appendChild(addInfo('Burned calories', `${ex.calories || 0} / 3 min`));
    infoBlock.appendChild(addInfo('Body part', ex.bodyPart || '—'));
    infoBlock.appendChild(addInfo('Target', ex.target || '—'));

    // Start button
    const startBtn = document.createElement('div');
    startBtn.textContent = 'Start →';
    Object.assign(startBtn.style, {
      position: 'absolute',
      right: '16px',
      top: '16px',
      fontSize: '16px',
      lineHeight: '24px',
      color: '#242424'
    });

    card.appendChild(badge);
    card.appendChild(rating);
    card.appendChild(titleDiv);
    card.appendChild(infoBlock);
    card.appendChild(startBtn);

    return card;
  }

  /* =========================
     PAGINATION
  ========================== */
  function renderPagination(totalPages) {
    pagination.innerHTML = '';
    if (!totalPages || totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = 'page-btn';
      if (i === currentPage) btn.classList.add('active');
      btn.addEventListener('click', () => {
        currentPage = i;
        loadExercises();
      });
      pagination.appendChild(btn);
    }
  }

  /* =========================
     UPDATE CATEGORY DISPLAY (e.g., "/ Waist")
  ========================== */
  function updateCategoryDisplay() {
    if (currentCategoryEl) {
      currentCategoryEl.textContent = ` / ${currentCategory}`;
    }
  }

  /* =========================
     TAB SWITCHING
  ========================== */
  tabs.forEach(tab => {
    tab.addEventListener('click', async () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      currentFilterType = tab.dataset.filter;
      currentPage = 1;

      // Загрузить первую категорию для нового типа
      const categories = await loadFilterValues(currentFilterType);
      if (categories.length > 0) {
        currentCategory = categories[0];
        loadExercises();
      } else {
        grid.innerHTML = '<p>No categories available.</p>';
        pagination.innerHTML = '';
        if (currentCategoryEl) currentCategoryEl.textContent = '';
      }
    });
  });

  /* =========================
     SUBSCRIPTION
  ========================== */
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = subscribeForm.querySelector('input[type="email"]');
      const email = emailInput.value.trim();

      if (!email) return;

      try {
        const res = await fetch(`${API_BASE}/subscription`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        if (res.ok) {
          alert('Thank you for subscribing!');
          subscribeForm.reset();
        } else {
          alert('Subscription failed. Please try again.');
        }
      } catch (err) {
        console.error('Subscription error:', err);
        alert('Network error. Please try again later.');
      }
    });
  }

  /* =========================
     INIT
  ========================== */
  loadQuote();
  loadExercises(); // сразу загружаем упражнения по умолчанию (bodyPart=Waist)

  // Обработка изменения размера окна (если нужно перемещать блоки на мобильных)
  // В вашем макете этого нет, поэтому закомментировано
  // window.addEventListener('resize', moveStaticCardsToBottom);
});