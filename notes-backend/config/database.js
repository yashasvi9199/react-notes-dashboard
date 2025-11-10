const mysql = require(\mysql2/promise);
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'react_notes_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 10,
    reconnect: true
});

// Test database connection
async function testConnection() {
    try{
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
        return true;
    }catch(err){
        console.error('❌ Database connection failes: ', err.message);
        return false;
    }
}

module.exports = {pool, testConnection};