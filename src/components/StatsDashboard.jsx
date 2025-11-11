import React, { useState, useEffect } from 'react';
import { fetchStats } from '../services/statsApi';

export default function StatsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const statsData = await fetchStats();
      setStats(statsData);
    } catch (err) {
      setError('Failed to load statistics');
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="stats-dashboard">
        <h3>Statistics</h3>
        <div className="empty">Loading statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-dashboard">
        <h3>Statistics</h3>
        <div className="empty">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="stats-dashboard">
        <h3>Statistics</h3>
        <div className="empty">No statistics available</div>
      </div>
    );
  }

  return (
    <div className="stats-dashboard">
      <h3>Notes Statistics</h3>
      
      {/* Total Notes Card */}
      <div className="stat-card">
        <div className="stat-number">{stats.totalNotes}</div>
        <div className="stat-label">Total Notes</div>
      </div>

      {/* Average Notes Per Day */}
      <div className="stat-card">
        <div className="stat-number">{stats.averages.avg_per_day}</div>
        <div className="stat-label">Avg per Day</div>
        <div className="stat-subtext">{stats.averages.active_days} active days</div>
      </div>

      {/* Category Distribution */}
      <div className="stat-section">
        <h4>By Category</h4>
        <div className="category-stats">
          {stats.byCategory.map(cat => (
            <div key={cat.category} className="category-stat">
              <div className="category-stat-bar">
                <div 
                  className="category-stat-fill"
                  style={{ 
                    width: `${(cat.count / stats.totalNotes) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="category-stat-info">
                <span className="category-stat-name">{cat.category}</span>
                <span className="category-stat-count">{cat.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="stat-section">
        <h4>Recent Activity (7 days)</h4>
        <div className="recent-activity">
          {stats.recentActivity.length > 0 ? (
            stats.recentActivity.map(activity => (
              <div key={activity.date} className="activity-item">
                <span className="activity-date">
                  {new Date(activity.date).toLocaleDateString()}
                </span>
                <span className="activity-count">{activity.count} notes</span>
              </div>
            ))
          ) : (
            <div className="empty">No recent activity</div>
          )}
        </div>
      </div>

      <button 
        onClick={loadStats}
        className="btn small"
        style={{ width: '100%', marginTop: '12px' }}
      >
        Refresh Stats
      </button>
    </div>
  );
}