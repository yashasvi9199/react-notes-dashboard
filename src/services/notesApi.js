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
    const response = await fetch(`${API_BASE_URL}/notes/search/${encodedURIComponent(query)}`);

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

// Create new note
export const createNote = async(noteData) => {
    try{
        const response = await fetch(`${API_BASE_URL}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noteData),
        });

        if(!response.ok) throw new Error('Failed to create note');
        return await response.json();
    }catch(err){
        console.error('Error creating note: ',err);
        throw err;
    }
};

// Update existing note
export const updateNote = async (id, noteData) => {
  try {
    console.log('API Update - ID:', id, 'Data:', noteData);
    
    // Remove the category field if it's not being used
    const { category, ...updateData } = noteData;
    
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error response:', errorText);
      throw new Error(`Failed to update note: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('API Success response:', result);
    return result;
    
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