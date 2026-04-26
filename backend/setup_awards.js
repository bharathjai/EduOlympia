const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function setupAwards() {
  try {
    console.log("Setting up award_events table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS award_events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        event_date DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'Upcoming',
        medals_assigned INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed mock events if empty
    const check = await pool.query("SELECT id FROM award_events LIMIT 1");
    if (check.rows.length === 0) {
      const query = "INSERT INTO award_events (title, event_date, status, medals_assigned) VALUES ($1, $2, $3, $4)";
      await pool.query(query, ["National Olympiad Awards 2026", "2026-12-15", "Upcoming", 150]);
      await pool.query(query, ["Regional Science Fair Honors", "2025-11-02", "Completed", 45]);
      await pool.query(query, ["Top Schools Recognition Q3", "2025-10-20", "Completed", 10]);
    }
    console.log("award_events setup complete!");
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
setupAwards();
