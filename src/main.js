document.addEventListener('DOMContentLoaded', () => {
  // Filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filter exercise cards
      document.querySelectorAll('.exercise-card').forEach(card => {
        const cardFilter = card.getAttribute('data-filter');
        if (filter === 'Muscles' && cardFilter === 'Muscles') {
          card.style.display = 'block';
        } else if (filter === 'Body parts' && cardFilter === 'Body parts') {
          card.style.display = 'block';
        } else if (filter === 'Equipment' && cardFilter === 'Equipment') {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Pagination
  document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Subscription
  const form = document.getElementById('subscribe-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = form.querySelector('input').value;
      alert(`Thank you! We've sent info to: ${email}`);
      form.reset();
    });
  }
});