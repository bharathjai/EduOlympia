const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedResults() {
  try {
    console.log("Seeding results table for leaderboard...");

    // Create a school
    const schoolRes = await pool.query("INSERT INTO schools (name) VALUES ('Global Tech High') RETURNING id");
    const schoolId = schoolRes.rows[0].id;

    // Create an exam
    const examRes = await pool.query("INSERT INTO exams (title) VALUES ('Math Olympiad 2026') RETURNING id");
    const examId = examRes.rows[0].id;

    // Create students and results
    const students = [
      { name: 'Alex Johnson', email: 'alex@gth.com', score: 99.5 },
      { name: 'Maria Garcia', email: 'maria@gth.com', score: 98.2 },
      { name: 'James Smith', email: 'james@gth.com', score: 97.8 },
      { name: 'Linda Lee', email: 'linda@gth.com', score: 95.1 },
    ];

    for (const student of students) {
      const userRes = await pool.query(
        "INSERT INTO users (role, name, email, password_hash, school_id) VALUES ('student', $1, $2, 'pass', $3) RETURNING id",
        [student.name, student.email, schoolId]
      );
      const userId = userRes.rows[0].id;

      const studRes = await pool.query(
        "INSERT INTO students (user_id, school_id) VALUES ($1, $2) RETURNING id",
        [userId, schoolId]
      );
      const studentId = studRes.rows[0].id;

      await pool.query(
        "INSERT INTO results (student_id, exam_id, score, total_questions) VALUES ($1, $2, $3, 100)",
        [studentId, examId, student.score]
      );
    }

    console.log("Results seeding complete.");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    pool.end();
  }
}
seedResults();
