const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function enableRealtimeForExams() {
  try {
    console.log("Enabling realtime for exams...");
    // Just in case it's not published, add the table
    await pool.query("ALTER PUBLICATION supabase_realtime ADD TABLE exams");
    console.log("Realtime enabled for exams.");
  } catch (e) {
    if (e.message.includes('already in publication')) {
       console.log("Exams table is already in supabase_realtime publication.");
    } else {
       console.error("Error:", e.message);
    }
  } finally {
    pool.end();
  }
}
enableRealtimeForExams();
