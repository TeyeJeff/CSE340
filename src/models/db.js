import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

let db = null;

if (process.env.NODE_ENV === 'development' && process.env.ENABLE_SQL_LOGGING === 'true') {
    db = {
        query: async (text, params) => {
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
        close: async () => {
            await pool.end();
        }
    };
} else {
    db = {
        query: async (text, params) => {
            try {
                return await pool.query(text, params);
            } catch (error) {
                console.error('❌ DATABASE FALLBACK ERROR:', error.message);
                throw error;
            }
        },
        close: async () => {
            await pool.end();
        }
    };
}

const testConnection = async () => {
    try {
        const result = await db.query('SELECT NOW() as current_time');
        console.log('Database connection successful:', result.rows[0].current_time);
        return true;
    } catch (error) {
        console.error('❌ CRITICAL: Database connection failed during startup:', error.message);
        return false;
    }
};

export { db as default, testConnection };