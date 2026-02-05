document.addEventListener('DOMContentLoaded', () => {
  // Filters
  const filterButtons = document.querySelectorAll('.filter-btn');
  const exerciseCards = document.querySelectorAll('.exercise-card');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Show/hide cards based on filter
      exerciseCards.forEach(card => {
        const cardFilter = card.getAttribute('data-filter');
        
        if (filter === 'all') {
          card.style.display = 'block';
        } else if (cardFilter === filter) {
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
      
      // Simple validation
      if (!email || !isValidEmail(email)) {
        showNotification('Please enter a valid email address!', 'error');
        return;
      }
      
      // Mock API call
      setTimeout(() => {
        showNotification(`Thank you! You've been subscribed with: ${email}`, 'success');
        form.reset();
      }, 500);
    });
  }
  
  // Update navigation links
  updateNavigation();
});

// Email validation
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
  // Remove old notification
  const oldNotification = document.querySelector('.notification');
  if (oldNotification) {
    oldNotification.remove();
  }
  
  // Create new notification
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

// Update navigation to include Exercises page
function updateNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Change the second link to point to exercises.html
  if (navLinks.length >= 2) {
    navLinks[0].href = "./index.html";
    navLinks[1].href = "./exercises.html";
    navLinks[1].textContent = "Exercises";
    
    // Add third link for Favorites
    if (navLinks.length === 2) {
      const favoritesLink = document.createElement('a');
      favoritesLink.href = "./favorites.html";
      favoritesLink.className = "nav-link";
      favoritesLink.textContent = "Favorites";
      navLinks[1].parentNode.appendChild(favoritesLink);
    }
  }
}