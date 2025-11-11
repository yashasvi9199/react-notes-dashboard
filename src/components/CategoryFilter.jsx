import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../services/categoriesApi';

export default function CategoryFilter({ selectedCategory, onCategoryChange, noteCounts }) {
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
    <div className="category-filter">
        <h3>Filter by Category:</h3>
        <div className="category-filter-buttons">
        <button
            onClick={() => onCategoryChange('')}
            className={`category-filter-btn ${!selectedCategory ? 'active' : ''}`}
        >
            All Notes
            <span className="note-count">({Object.values(noteCounts).reduce((sum, count) => sum + count, 0)})</span>
        </button>
        
        {categories.map(category => (
            <button
            key={category.id}
            onClick={() => onCategoryChange(category.name)}
            className={`category-filter-btn ${selectedCategory === category.name ? 'active' : ''}`}
            style={{ 
                borderLeft: `3px solid ${category.color}`,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
            }}
            >
            <span>{category.name}</span>
            <span className="note-count">({noteCounts[category.name] || 0})</span>
            </button>
        ))}
        </div>
    </div>
    );
}