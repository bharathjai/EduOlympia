const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function setupExams() {
  try {
    console.log("Adding status column to exams...");
    await pool.query("ALTER TABLE exams ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Pending'");
    
    // Seed some mock exams if none exist
    const check = await pool.query("SELECT id FROM exams LIMIT 1");
    if (check.rows.length === 0) {
      const userRes = await pool.query("SELECT id FROM users WHERE role='trainer' LIMIT 1");
      if (userRes.rows.length > 0) {
        const trainerId = userRes.rows[0].id;
        await pool.query(
          "INSERT INTO exams (title, duration_minutes, created_by, status) VALUES ($1, $2, $3, $4)",
          ["Grade 10 Mock Olympiad", 120, trainerId, "Pending"]
        );
        await pool.query(
          "INSERT INTO exams (title, duration_minutes, created_by, status) VALUES ($1, $2, $3, $4)",
          ["Regional Science Qualifier", 90, trainerId, "Pending"]
        );
      }
    }
    console.log("Exams setup complete!");
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
setupExams();
