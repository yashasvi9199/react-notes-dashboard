import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// GET /api/stats - Get notes statistics
router.get('/', async (req, res) => {
  try {
    // Get total notes count
    const [totalResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM notes WHERE is_archived = FALSE'
    );

    // Get notes by category counts
    const [categoryResult] = await pool.execute(
      `SELECT category, COUNT(*) as count 
       FROM notes 
       WHERE is_archived = FALSE 
       GROUP BY category 
       ORDER BY count DESC`
    );

    // Get recent activity (last 7 days)
    const [recentResult] = await pool.execute(
      `SELECT DATE(created_at) as date, COUNT(*) as count 
       FROM notes 
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) 
       AND is_archived = FALSE
       GROUP BY DATE(created_at) 
       ORDER BY date DESC`
    );

    // Get average notes per day
    const [avgResult] = await pool.execute(
      `SELECT 
         COUNT(*) as total_notes,
         COUNT(DISTINCT DATE(created_at)) as active_days,
         ROUND(COUNT(*) / GREATEST(COUNT(DISTINCT DATE(created_at)), 1), 2) as avg_per_day
       FROM notes 
       WHERE is_archived = FALSE`
    );

    res.json({
      totalNotes: totalResult[0].total,
      byCategory: categoryResult,
      recentActivity: recentResult,
      averages: avgResult[0]
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;