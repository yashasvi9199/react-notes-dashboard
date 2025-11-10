import express from 'express';
import cors from 'cors';
import {testConnection} from './config/database.js';
import notesRouter from './routes/notes.js'

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Use notes route
app.use('/api/notes', notesRouter)

// Health check
app.get('/api/health', (req,res) => {
    res.json({
        message: 'Notes API is running!',
        timestamp: new Date().toISOString()
    });
});

// Database connection test route
app.get('/api/test-db', async (req,res) => {
    try{
        const isConnected = await testConnection();
        if (isConnected) {
            res.json({message: 'Database connection successful'});
        }else{
            res.status(500).json({error: 'Database connection failed'});
        }
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

app.listen(PORT, async ()=> {
    console.log(`🚀 Server running on port ${PORT}`);
    await testConnection();
})
