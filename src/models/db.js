import { Pool } from 'pg';

// FIX: Make SSL configuration flexible for local machines connecting to Render
const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false // Prevents local OS handshake rejections
    }
});

let db = null;

// Modified to ensure your queries log errors cleanly during local development tasks
if (process.env.NODE_ENV === 'development' && process.env.ENABLE_SQL_LOGGING === 'true') {
    db = {
        async query(text, params) {
            try {
                const start = Date.now();
                const res = await pool.query(text, params);
                const duration = Date.now() - start;
                console.log('Executed query:', { 
                    text: text.replace(/\s+/g, ' ').trim(), 
                    duration: `${duration}ms`, 
                    rows: res.rowCount 
                });
                return res;
            } catch (error) {
                console.error('❌ DATABASE QUERY ERROR:', error.message);
                throw error;
            }
        },
        async close() {
            await pool.end();
        }
    };
} else {
    // FALLBACK SAFETY: Add an explicit catch wrapper even if logging is turned off
    db = {
        async query(text, params) {
            try {
                return await pool.query(text, params);
            } catch (error) {
                console.error('❌ DATABASE FALLBACK ERROR:', error.message);
                throw error;
            }
        },
        async close() {
            await pool.end();
        }
    };
}

const testConnection = async() => {
    try {
        const result = await db.query('SELECT NOW() as current_time');
        console.log('Database connection successful:', result.rows[0].current_time);
        return true;
    } catch (error) {
        console.error('❌ CRITICAL: Database connection failed during startup:', error.message);
        return false; // Changed throw to false so your local server doesn't brick entirely
    }
};

export { db as default, testConnection };