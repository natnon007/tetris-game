import { Pool } from 'pg';

export const pool = new Pool({
  user: 'admin',
  host: 'database',
  database: 'tetris_db',
  password: 'admin',
  port: 5432,
});

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

// เพิ่มฟังก์ชันสำหรับทดสอบการเชื่อมต่อ
export const testConnection = async (): Promise<void> => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};