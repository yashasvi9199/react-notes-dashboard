const API_BASE_URL = 'http://localhost:5000/api';

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Create new category
export const createCategory = async (categoryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create category: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};