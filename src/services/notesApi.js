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
    try{
        const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noteData),
        });

        if(!response.ok) throw new Error('Failed to update note');
        return await response.json(noteData);
    }catch(err){
        console.error('Error updating note: ',err);
        throw err;
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