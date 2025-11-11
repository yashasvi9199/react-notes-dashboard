import express from 'express';
import cors from 'cors';
import {testConnection} from './config/database.js';
import notesRouter from './routes/notes.js'
import categoriesRouter from './routes/categories.js'
import statsRouter from './routes/stats.js';

const app = express();
const PORT = 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use('/api/categories', categoriesRouter);
app.use('/api/notes', notesRouter);
app.use('/api/stats', statsRouter);

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
