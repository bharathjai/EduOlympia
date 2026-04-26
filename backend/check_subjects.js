const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkData() {
  try {
    const res = await pool.query("SELECT * FROM subjects");
    console.log("Subjects:", res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
checkData();
