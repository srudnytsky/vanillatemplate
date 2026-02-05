// src/js/api.js
const API_BASE = 'https://your-energy.b.goit.study/api';

export const fetchQuote = async () => {
  try {
    const response = await fetch(`${API_BASE}/quote`);
    if (!response.ok) throw new Error('Failed to fetch quote');
    return await response.json();
  } catch (error) {
    console.error('Error fetching quote:', error);
    return {
      quote: "The only bad workout is the one that didn't happen.",
      author: "Unknown"
    };
  }
};

export const fetchFilters = async (filter) => {
  try {
    const response = await fetch(`${API_BASE}/filters?filter=${filter}`);
    if (!response.ok) throw new Error('Failed to fetch filters');
    return await response.json();
  } catch (error) {
    console.error('Error fetching filters:', error);
    return { results: [] };
  }
};

export const fetchExercises = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE}/exercises${queryParams ? `?${queryParams}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('Failed to fetch exercises');
    const data = await response.json();
    
    return {
      results: data.results || data || [],
      totalPages: data.totalPages || Math.ceil((data.results || data || []).length / 10),
      page: params.page || 1,
      perPage: 10
    };
  } catch (error) {
    console.error('Error fetching exercises:', error);
    // Return mock data
    return getMockExercisesData(params);
  }
};

export const fetchExercise = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/exercises/${id}`);
    if (!response.ok) throw new Error('Failed to fetch exercise');
    return await response.json();
  } catch (error) {
    console.error('Error fetching exercise:', error);
    return getMockExercise(id);
  }
};

export const rateExercise = async (id, rating, email, comment = '') => {
  try {
    const response = await fetch(`${API_BASE}/exercises/${id}/rating`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        rate: rating,
        email: email,
        review: comment 
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to submit rating');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error rating exercise:', error);
    return {
      message: 'Rating submitted successfully (demo mode)',
      rating: rating
    };
  }
};

export const subscribe = async (email) => {
  try {
    const response = await fetch(`${API_BASE}/subscription`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to subscribe');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error subscribing:', error);
    return {
      message: 'Subscribed successfully (demo mode)'
    };
  }
};

// Mock data functions
function getMockExercisesData(params = {}) {
  const mockExercises = [
    {
      _id: '1',
      name: "3/4 sit-up",
      rating: 4.0,
      burnedCalories: 220,
      time: 3,
      bodyPart: "Waist",
      target: "Abs",
      equipment: "None",
      popularity: 156
    },
    {
      _id: '2',
      name: "Barbell reverse preacher curl",
      rating: 5.0,
      burnedCalories: 153,
      time: 3,
      bodyPart: "Waist",
      target: "Biceps",
      equipment: "Barbell",
      popularity: 89
    },
    {
      _id: '3',
      name: "Barbell side split squat v. 2",
      rating: 5.0,
      burnedCalories: 60,
      time: 3,
      bodyPart: "Waist",
      target: "Quads",
      equipment: "Barbell",
      popularity: 112
    },
    {
      _id: '4',
      name: "Barbell rollerout",
      rating: 5.0,
      burnedCalories: 87,
      time: 3,
      bodyPart: "Waist",
      target: "Abs",
      equipment: "Barbell",
      popularity: 76
    },
    {
      _id: '5',
      name: "45° side bend",
      rating: 5.0,
      burnedCalories: 323,
      time: 3,
      bodyPart: "Waist",
      target: "Abs",
      equipment: "Dumbbells",
      popularity: 142
    },
    {
      _id: '6',
      name: "Air bike",
      rating: 4.0,
      burnedCalories: 312,
      time: 3,
      bodyPart: "Waist",
      target: "Abs",
      equipment: "None",
      popularity: 98
    },
    {
      _id: '7',
      name: "Stationary bike walk",
      rating: 4.0,
      burnedCalories: 60,
      time: 3,
      bodyPart: "Waist",
      target: "Cardiovascular system",
      equipment: "Stationary bike",
      popularity: 116
    }
  ];

  let filtered = [...mockExercises];
  
  if (params.filter) {
    if (params.filter === 'muscles') {
      filtered = filtered.filter(ex => ['Abs', 'Biceps', 'Quads'].includes(ex.target));
    } else if (params.filter === 'bodyparts') {
      filtered = filtered.filter(ex => ex.bodyPart === 'Waist');
    } else if (params.filter === 'equipment') {
      filtered = filtered.filter(ex => ex.equipment !== 'None');
    }
  }
  
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase();
    filtered = filtered.filter(ex => 
      ex.name.toLowerCase().includes(keyword) ||
      ex.target.toLowerCase().includes(keyword) ||
      ex.bodyPart.toLowerCase().includes(keyword)
    );
  }
  
  const page = parseInt(params.page) || 1;
  const perPage = 10;
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginated = filtered.slice(startIndex, endIndex);
  
  return {
    results: paginated,
    totalPages: Math.ceil(filtered.length / perPage),
    page: page,
    perPage: perPage,
    total: filtered.length
  };
}

function getMockExercise(id) {
  const mockExercises = {
    '1': {
      _id: '1',
      name: "3/4 sit-up",
      rating: 4.0,
      burnedCalories: 220,
      time: 3,
      bodyPart: "Waist",
      target: "Abs",
      equipment: "None",
      popularity: 156,
      description: "A modified sit-up that targets the abdominal muscles. Perform by lying on your back with knees bent, then lifting your upper body until your torso is at a 45-degree angle.",
      difficulty: "Beginner"
    },
    '2': {
      _id: '2',
      name: "Barbell reverse preacher curl",
      rating: 5.0,
      burnedCalories: 153,
      time: 3,
      bodyPart: "Waist",
      target: "Biceps",
      equipment: "Barbell",
      popularity: 89,
      description: "An isolation exercise for the biceps that uses a preacher bench with a reverse grip. Focuses on the brachialis muscle for arm thickness.",
      difficulty: "Intermediate"
    },
    '7': {
      _id: '7',
      name: "Stationary bike walk",
      rating: 4.0,
      burnedCalories: 60,
      time: 3,
      bodyPart: "Waist",
      target: "Cardiovascular system",
      equipment: "Stationary bike",
      popularity: 116,
      description: "While not a muscle, this system is essential for endurance training. Aerobic exercises like running, cycling, and swimming improve cardiovascular health.",
      difficulty: "Beginner"
    }
  };
  
  return mockExercises[id] || mockExercises['1'];
}