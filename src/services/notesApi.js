const API_BASE_URL = 'http://localhost:5000/api';

// Fetch all notes
export const fetchNotes = async () => {
    try{
        const response = await fetch(`${API_BASE_URL}/notes`);
        if(!response.ok) throw new Error('Failed to fetch notes');
        return await response.json();
    }catch(err){
        console.error('Error fetching notes: ',err);
        throw err;
    }
};

// Search Notes
export const searchNotes = async (query) => {
  try{
    const response = await fetch(`${API_BASE_URL}/notes/search/${encodeURIComponent(query)}`);

    if(!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to search notes: ${errorText}`);
    }
    return await response.json();
  }catch(err){
    console.error('Error searching notesw: ',err);
    throw err;
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
    console.error('Error fetching notes by category:', error);
    throw error;
  }
};

// Create new note - updated to handle new response format
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
    
    const result = await response.json();
    return result.note || result; // Handle both response formats
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

// Update existing note - updated to handle new response format
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
    
    const result = await response.json();
    return result.note || result; // Handle both response formats
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

// Delete note
export const deleteNote = async (id) => {
    try{
        const response = await fetch(`${API_BASE_URL}/notes/${id}`,{
            method: 'DELETE',
        });

        if(!response.ok) throw new Error('Failed to delete note');
        return await response.json()
    }catch(err){
        console.error('Error deleting note: ',err)
        throw err;
    }
};