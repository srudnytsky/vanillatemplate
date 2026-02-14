const API_BASE = 'https://your-energy.b.goit.study/api';

// Fetch daily quote
export async function fetchQuote() {
  try {
    const response = await fetch(`${API_BASE}/quote`);
    if (!response.ok) throw new Error('Failed to fetch quote');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching quote:', error);
    throw error;
  }
}

// Fetch exercises with filters
export async function fetchExercises(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const url = `${API_BASE}/exercises${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch exercises');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
}

// Fetch single exercise by ID
export async function fetchExercise(exerciseId) {
  try {
    const response = await fetch(`${API_BASE}/exercises/${exerciseId}`);
    if (!response.ok) throw new Error('Failed to fetch exercise details');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching exercise:', error);
    throw error;
  }
}

// Rate an exercise
export async function rateExercise(exerciseId, rating, email, comment = '') {
  try {
    const response = await fetch(`${API_BASE}/exercises/${exerciseId}/rating`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rate: rating,
        email: email,
        review: comment
      }),
    });
    
    if (!response.ok) throw new Error('Failed to submit rating');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error rating exercise:', error);
    throw error;
  }
}

// Subscribe to newsletter
export async function subscribe(email) {
  try {
    const response = await fetch(`${API_BASE}/subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) throw new Error('Failed to subscribe');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error subscribing:', error);
    throw error;
  }
}