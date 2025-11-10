import express from 'express';
import {pool} from '../config/database.js';

const router = express.Router();

// All queries
const getAllQuery = 'SELECT * FROM notes WHERE is_archived = FALSE ORDER BY created_at DESC'
const getOneQuery = "SELECT * FROM notes WHERE id=?"
const insertQuery = 'INSERT INTO notes (id, title, content, category) VALUES (?,?,?,?)'
const updateQuery = 'UPDATE notes SET title=?, content=?, category=? WHERE id=?'
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
router.post("/", async(req, res) => {
    try{
        const {title, content, category} = req.body;
        const id = Date.now().toString();
        await pool.execute(insertQuery, [id, title || "Untitled", content || "", category || "General"]);

        res.status(201).json({
            message: "Note created successfully",
            id
        });
    }catch(err){
        console.error("Error creating note: ",err);
        res.status(500).json({error: "Failed to create note"});
    }
});

// PUT /api/notes/:id - Update existing note
router.put('/:id', async(req, res) => {
    try{
        const {title, content, category} = req.body;

        await pool.execute(updateQuery, 
            [title|| "Untitled", content|| "", category|| "General", req.params.id]);

        res.json({message: "Note updated succesfully"});
    }catch(err){
        console.error("Error updating the note: ",err);
        res.status(500).json({error: "Failed to update the note"});
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