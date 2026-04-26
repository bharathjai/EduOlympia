const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addSubject() {
  try {
    await pool.query("ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS subject VARCHAR(255);");
    console.log("Added subject column to study_materials");
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
addSubject();
