const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addAiColumns() {
  try {
    console.log("Adding AI Content Flag columns...");
    
    // Add to study_materials
    await pool.query("ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS ai_flagged BOOLEAN DEFAULT FALSE;");
    await pool.query("ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS ai_concern TEXT;");
    console.log("Updated study_materials table.");

    // Add to exams
    await pool.query("ALTER TABLE exams ADD COLUMN IF NOT EXISTS ai_flagged BOOLEAN DEFAULT FALSE;");
    await pool.query("ALTER TABLE exams ADD COLUMN IF NOT EXISTS ai_concern TEXT;");
    console.log("Updated exams table.");

  } catch (err) {
    console.error("Error updating schema:", err);
  } finally {
    pool.end();
  }
}

addAiColumns();
