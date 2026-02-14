// === Константы ===
const API_BASE_URL = 'https://your-energy.b.goit.study/api';
const FAVORITES_KEY = 'favorites';

// === DOM элементы ===
const container = document.querySelector('.container');

// === Функция: получить цитату дня ===
async function fetchDailyQuote() {
    try {
        const res = await fetch(`${API_BASE_URL}/quote`);
        if (!res.ok) throw new Error('Failed to fetch quote');
        const data = await res.json();
        // Обновляем текст цитаты на странице
        const quoteText = document.querySelector('.quote-text');
        const quoteAuthor = document.querySelector('.quote-author');
        if (quoteText) quoteText.textContent = data.quote || 'Stay strong. Every rep counts.';
        if (quoteAuthor) quoteAuthor.textContent = data.author ? `— ${data.author}` : '— Tom Brady';
    } catch (err) {
        console.warn('Using fallback quote:', err);
    }
}

// === Функция: получить упражнение по ID ===
async function fetchExercise(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/exercises/${id}`);
        if (!res.ok) throw new Error(`Exercise ${id} not found`);
        return await res.json();
    } catch {
        return null;
    }
}

// === Управление избранным ===
function getFavorites() {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveFavorites(favs) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

function removeFavorite(id) {
    const favs = getFavorites().filter(x => x !== id);
    saveFavorites(favs);
    renderPage(); // Перерисовать всю страницу
}

// === Создание карточки упражнения ===
function createExerciseCard(ex) {
    if (!ex) return null;

    const card = document.createElement('div');
    card.className = 'exercise-card';

    const duration = ex.time || 3;
    const caloriesText = `${ex.calories} / ${duration} min`;

    card.innerHTML = `
        <div class="card-header">
            <div class="workout-tag">WORKOUT</div>
            <button class="remove-btn" data-id="${ex.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <h3 class="exercise-title">${ex.name}</h3>
        <div class="exercise-info">
            <div class="info-item">
                <i class="fas fa-fire"></i>
                <span class="info-value">Burned calories: ${caloriesText}</span>
            </div>
            <div class="info-item">
                <i class="fas fa-user"></i>
                <span class="info-value">Body part: ${ex.bodyPart}</span>
            </div>
            <div class="info-item">
                <i class="fas fa-bullseye"></i>
                <span class="info-value">Target: ${ex.target}</span>
            </div>
        </div>
        <div class="rating">
            <span>${ex.rating || 4.5}</span>
            <i class="fas fa-star"></i>
        </div>
        <div class="badge">
            <span>WORKOUT</span>
        </div>
        <button class="start-btn">
            <span>Start</span>
            <i class="fas fa-arrow-right"></i>
        </button>
    `;

    card.querySelector('.remove-btn')?.addEventListener('click', () => {
        removeFavorite(ex.id);
    });

    return card;
}

// === Рендер пустого состояния (как в макете) ===
function renderEmptyState() {
    document.querySelector('.main-content').innerHTML = `
        <h1 class="page-title">Favorites</h1>

        <!-- Quote block -->
        <section class="quote-section empty">
            <div class="quote-card empty" style="width: 494px; height: 230px; background: #242424; border-radius: 20px; padding: 40px; position: relative;">
                <div class="quote-icon" style="position: absolute; top: 40px; left: 40px; width: 34px; height: 32px;">
                    <i class="fas fa-running" style="color: #F4F4F4;"></i>
                </div>
                <h3 class="quote-title" style="font-weight: 500; font-size: 24px; line-height: 32px; margin-bottom: 16px; color: #F4F4F4;">Quote of the day</h3>
                <p class="quote-text" style="font-size: 14px; line-height: 18px; color: rgba(244,244,244,0.6); margin-bottom: 16px;">
                    A lot of times I find that people who are blessed with the most talent don't ever develop that attitude, and the ones who aren't blessed in that way are the most competitive and have the biggest heart.
                </p>
                <p class="quote-author" style="font-size: 16px; line-height: 24px; color: #F4F4F4;">Tom Brady</p>
            </div>
        </section>

        <!-- Daily norm block -->
        <section class="daily-norm empty" style="position: absolute; left: 32px; top: 496px; width: 239px; height: 141px;">
            <div class="norm-card empty" style="background: #FFFFFF; border-radius: 20px; padding: 25px; display: flex; align-items: center; gap: 32px;">
                <div class="norm-icon" style="width: 20px; height: 20px; position: relative;">
                    <div style="width: 20px; height: 20px; background: #242424; border-radius: 50%;"></div>
                </div>
                <div class="norm-content">
                    <h3 class="norm-title" style="font-weight: 500; font-size: 24px; line-height: 32px; color: #242424;">110 min</h3>
                    <p class="norm-subtitle" style="font-size: 14px; line-height: 18px; color: rgba(36,36,36,0.6);">Daily norm of sports</p>
                </div>
            </div>
        </section>

        <!-- Empty text -->
        <div style="
            position: absolute;
            width: 554px;
            height: 72px;
            left: 706px;
            top: 364px;
            font-family: 'DM Sans';
            font-weight: 400;
            font-size: 18px;
            line-height: 24px;
            text-align: center;
            color: #242424;
        ">
            It appears that you haven't added any exercises to your favorites yet. To get started, you can add exercises that you like to your favorites for easier access in the future.
        </div>
    `;
    
    // Загрузить актуальную цитату
    fetchDailyQuote();
}

// === Рендер основного состояния (с упражнениями) ===
async function renderWithExercises() {
    const favoriteIds = getFavorites();
    const exercises = await Promise.all(favoriteIds.map(id => fetchExercise(id)));
    const validExercises = exercises.filter(ex => ex !== null);

    document.querySelector('.main-content').innerHTML = `
        <h1 class="page-title">Favorites</h1>
        <div class="left-column">
            <div class="quote-card">
                <div class="quote-icon"><i class="fas fa-running"></i></div>
                <h3 class="quote-title">Quote of the day</h3>
                <p class="quote-text">Loading...</p>
                <p class="quote-author">—</p>
            </div>
            <div class="norm-card">
                <div class="norm-icon"><i class="fas fa-fire"></i></div>
                <div class="norm-content">
                    <h3 class="norm-title">110 min</h3>
                    <p class="norm-subtitle">Daily norm of sports</p>
                </div>
                <div class="norm-image" style="background-image: url('https://your-energy.b.goit.study/images/young-women-doing-fitness-outdoors-together.jpg');"></div>
            </div>
        </div>
        <div class="right-column">
            <div class="favorites-grid" id="favorites-grid"></div>
        </div>
    `;

    // Загрузить цитату
    fetchDailyQuote();

    // Вставить карточки
    const grid = document.getElementById('favorites-grid');
    validExercises.forEach(ex => {
        const card = createExerciseCard(ex);
        if (card) grid.appendChild(card);
    });
}

// === Основная функция рендера ===
async function renderPage() {
    const favorites = getFavorites();
    if (favorites.length === 0) {
        renderEmptyState();
    } else {
        await renderWithExercises();
    }
}

// === Подписка на рассылку ===
async function handleSubscription(e) {
    e.preventDefault();
    const emailInput = document.querySelector('.footer-email');
    const email = emailInput?.value.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/subscription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (res.ok) {
            alert('Thank you for subscribing!');
            emailInput.value = '';
        } else {
            alert('Failed to subscribe. Please try again.');
        }
    } catch {
        alert('Network error. Please check your connection.');
    }
}

// === Инициализация ===
document.addEventListener('DOMContentLoaded', () => {
    // Настроить подписку
    const subscribeBtn = document.querySelector('.footer-btn');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', handleSubscription);
    }

    // Навигация по табам
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Отобразить страницу
    renderPage();
});