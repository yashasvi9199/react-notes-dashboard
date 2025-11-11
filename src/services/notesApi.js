// API Base URL - will fail on GitHub Pages, fallback to localStorage
const API_BASE_URL = 'http://localhost:5000/api';

// Test database connection
export const testConnection = async () => {
  try {
    // If we're not on localhost, database won't be available
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return false;
    }
    
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.log('Database connection failed, using localStorage:', error.message);
    return false;
  }
};

// Fetch all notes
export const fetchNotes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`);
    if (!response.ok) throw new Error('Failed to fetch notes');
    return await response.json();
  } catch (error) {
    console.error('Error fetching notes from DB:', error);
    throw error;
  }
};

// Create new note
export const createNote = async (noteData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create note: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating note in DB:', error);
    throw error;
  }
};

// Update existing note
export const updateNote = async (id, noteData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update note: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating note in DB:', error);
    throw error;
  }
};

// Delete note
export const deleteNote = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete note: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting note from DB:', error);
    throw error;
  }
};

// Search notes
export const searchNotes = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/search/${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to search notes: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching notes in DB:', error);
    throw error;
  }
};

// Get notes by category
export const getNotesByCategory = async (category) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/category/${encodeURIComponent(category)}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch notes by category: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching notes by category from DB:', error);
    throw error;
  }
};