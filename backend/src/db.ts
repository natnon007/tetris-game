import { Pool } from 'pg';

export const pool = new Pool({
  user: 'admin',
  host: 'database',
  database: 'tetris_db',
  password: 'admin',
  port: 5432,
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// สร้างตาราง scores
export const createTables = async (): Promise<void> => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS scores (
        id SERIAL PRIMARY KEY,
        player_name VARCHAR(50) NOT NULL,
        score INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        country_code VARCHAR(2) DEFAULT 'UN'
      );
    `);
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

export const connectWithRetry = async (maxAttempts: number = 5, delayMs: number = 5000): Promise<void> => {
  let currentAttempt = 1;

  while (currentAttempt <= maxAttempts) {
    try {
      const result = await pool.query('SELECT NOW()');
      console.log('Database connection successful at:', result.rows[0].now);
      return;
    } catch (error) {
      console.error(`Database connection attempt ${currentAttempt}/${maxAttempts} failed:`, error.message);
      
      if (currentAttempt === maxAttempts) {
        throw new Error('Max connection attempts reached. Could not connect to database.');
      }

      console.log(`Retrying in ${delayMs/1000} seconds...`);
      await delay(delayMs);
      currentAttempt++;
    }
  }
};