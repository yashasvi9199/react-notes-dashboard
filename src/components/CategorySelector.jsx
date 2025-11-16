import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../services/categoriesApi';

export default function CategorySelector({ selectedCategory, onCategoryChange }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Fallback to default categories if API fails
      setCategories([
        { id: 1, name: 'General', color: '#6B7280' },
        { id: 2, name: 'Personal', color: '#EF4444' },
        { id: 3, name: 'Work', color: '#3B82F6' },
        { id: 4, name: 'Ideas', color: '#8B5CF6' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div>
      <label style={{ display: 'block', marginBottom: 8, fontWeight: 700 }} className="panel-title">
        Category
      </label>
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="form-input"
      >
        {categories.map(category => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}