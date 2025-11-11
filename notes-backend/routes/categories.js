import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// GET /api/categories - Get all categories
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM categories ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST /api/categories - Create new category
router.post('/', async (req, res) => {
  try {
    const { name, color } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO categories (name, color) VALUES (?, ?)',
      [name, color || '#6B7280']
    );

    res.status(201).json({ 
      message: 'Category created successfully',
      id: result.insertId 
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Category already exists' });
    } else {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Failed to create category' });
    }
  }
});

export default router;