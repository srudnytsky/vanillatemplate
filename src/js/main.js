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

      // === MAIN APP LOGIC (ваш main.js) ===
      const API_BASE = 'https://your-energy.b.goit.study/api'; // Fixed extra space!

      const grid = document.getElementById('exercises-grid');
      const pagination = document.getElementById('pagination');
      const tabs = document.querySelectorAll('.tab-btn');
      const quoteText = document.querySelector('.quote-text');
      const quoteAuthor = document.querySelector('.quote-author');
      const subscribeForm = document.getElementById('subscribe-form');

      let currentPage = 1;
      const limit = 12;
      let selectedCategory = null;   // Example: "lower-legs"
      let currentFilterType = null;  // Example: "bodyParts"

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

      // === Load category list (Muscles / Body parts / Equipment) ===
      async function loadFilters(filterName = 'Body parts') {
        try {
          grid.innerHTML = 'Loading categories...';
          pagination.innerHTML = '';

          const encodedFilter = encodeURIComponent(filterName);
          const res = await fetch(`${API_BASE}/filters?filter=${encodedFilter}&page=${currentPage}&limit=${limit}`);
          if (!res.ok) throw new Error('Error loading filters');
          
          const data = await res.json();

          if (data?.results?.length > 0) {
            // Mapping tab names to API parameters
            const typeMap = {
              'Body parts': 'bodyParts',
              'Muscles': 'muscles',
              'Equipment': 'equipment'
            };
            currentFilterType = typeMap[filterName] || 'bodyParts';

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

          // Convert "lower legs" → "lower-legs" for API
          const apiValue = item.name.toLowerCase().replace(/\s+/g, '-');

          // Generate image URL (if available)
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
          pagination.innerHTML = '';

          const params = new URLSearchParams({
            [currentFilterType]: selectedCategory,
            page: currentPage,
            limit: limit
          });

          const res = await fetch(`${API_BASE}/exercises?${params.toString()}`);
          if (!res.ok) throw new Error('Error loading exercises');

          const data = await res.json();

          if (data?.results?.length > 0) {
            renderExercises(data.results);
            renderPagination(data.totalPages);
          } else {
            grid.innerHTML = 'Exercises not found';
          }
        } catch (err) {
          console.error('Error loading exercises:', err);
          grid.innerHTML = 'Error loading exercises';
        }
      }

      // === Display exercises ===
   // === Display exercises ===
function renderExercises(exercises) {
  grid.innerHTML = '';

  // "Back" button
  const backBtn = document.createElement('button');
  backBtn.textContent = '← Back to categories';
  backBtn.className = 'back-btn';
  backBtn.addEventListener('click', () => {
    selectedCategory = null;
    currentPage = 1;
    const activeTab = document.querySelector('.tab-btn.active');
    const filterName = activeTab ? activeTab.textContent.trim() : 'Body parts';
    loadFilters(filterName);
  });
  grid.appendChild(backBtn);

  // Exercise cards
  exercises.forEach(ex => {
    const card = document.createElement('div');
    card.className = 'exercise-card';

    card.innerHTML = `
      <img src="${ex.gifUrl || 'https://via.placeholder.com/300x300?text=Exercise'}" 
           alt="${ex.name}" loading="lazy">
      <div class="exercise-overlay">
        <h3>${ex.name}</h3>
        <div class="category">${ex.target || ex.bodyPart || ex.equipment || ''}</div>
      </div>
    `;

    // 🔥 ДОБАВЛЯЕМ ПЕРЕХОД НА ДЕТАЛЬНУЮ СТРАНИЦУ
    card.addEventListener('click', () => {
      window.location.href = `exercise-detail.html?id=${ex._id}`;
    });

    grid.appendChild(card);
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
              // Determine current filter by active tab
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

          const filterName = tab.textContent.trim(); // "Muscles", "Body parts", "Equipment"
          currentPage = 1;
          selectedCategory = null;
          loadFilters(filterName);
        });
      });

      // === Subscription (if form exists) ===
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

      // Activate first tab by default ("Body parts")
      if (tabs.length > 0) {
        tabs[0].classList.add('active');
        loadFilters('Body parts');
      }
    });