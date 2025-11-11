import express from 'express';
import {pool} from '../config/database.js';

const router = express.Router();

// All queries
const getAllQuery = 'SELECT * FROM notes WHERE is_archived = FALSE ORDER BY created_at DESC'
const getOneQuery = "SELECT * FROM notes WHERE id=?"
const insertQuery = 'INSERT INTO notes (id, title, content, category, created_at) VALUES (?, ?, ?, ?, ?)'
const updateQuery = 'UPDATE notes SET title = ?, content = ?, category = ? WHERE id = ?'
const deleteQuery = 'UPDATE notes SET is_archived=TRUE WHERE id=?'

// GET /api/notes - Get all notes
router.get('/', async (req, res) => {
    try{
        const [rows] = await pool.execute(getAllQuery);
        res.json(rows);
    }catch(err){
        console.error("Error fetching notes: ", err);
        res.status(500).json({error: "Failed to fetch notes"});
    }
});

// GET Route for Search
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = `%${req.params.query}%`;
    
    const [rows] = await pool.execute(
      `SELECT * FROM notes 
       WHERE is_archived = FALSE 
       AND (title LIKE ? OR content LIKE ?)
       ORDER BY 
         CASE 
           WHEN title LIKE ? THEN 1 
           WHEN content LIKE ? THEN 2 
         END,
         created_at DESC`,
      [searchQuery, searchQuery, searchQuery, searchQuery]
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error searching notes:', error);
    res.status(500).json({ error: 'Failed to search notes' });
  }
});

// GET route for filtering notes by category
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    
    const [rows] = await pool.execute(
      `SELECT * FROM notes 
       WHERE is_archived = FALSE 
       AND category = ?
       ORDER BY created_at DESC`,
      [category]
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching notes by category:', error);
    res.status(500).json({ error: 'Failed to fetch notes by category' });
  }
});

// GET /api/notes/:id - Get single note by ID
router.get('/:id', async (req,res) => {
    try{
        const [rows] = await pool.execute(getOneQuery, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({error: "Note not found"});
        }
        res.json(rows[0]);
    }catch(err){
        console.error("Error fetching note: ",err);
        res.status(500).json({error: "Failed to fetch note"});
    }
});

// POST /api/notes - Create new note
router.post('/', async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const id = Date.now().toString();
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    await pool.execute(insertQuery,
      [id, title || 'Untitled', content || '', category || 'General', createdAt]
    );
    
    // Return the created note with proper date
    const [rows] = await pool.execute('SELECT * FROM notes WHERE id = ?', [id]);
    
    res.status(201).json({ 
      message: 'Note created successfully',
      note: rows[0]
    });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// PUT /api/notes/:id - Update existing note
router.put('/:id', async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const noteId = req.params.id;
    
    await pool.execute(updateQuery,
      [title || 'Untitled', content || '', category || 'General', noteId]
    );
    
    // Return the updated note
    const [rows] = await pool.execute('SELECT * FROM notes WHERE id = ?', [noteId]);
    
    res.json({ 
      message: 'Note updated successfully',
      note: rows[0]
    });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// DELETE /api/notes/:id - Delete note(soft delete)
router.delete('/:id', async(req, res) => {
    try{
        await pool.execute(deleteQuery, [req.params.id]);
        
        res.json({message: "Notes deleted successfully"});
    }catch(err){
        console.error("Error deleting the note: ",err);
        res.status(500).json({error: "Failed to delete note"});
    }
});

export default router;