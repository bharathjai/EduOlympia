const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedContent() {
  try {
    console.log("Seeding rich study materials for SA-06 Content Approval...");
    
    // First, let's make sure we have a trainer user
    let trainerRes = await pool.query("SELECT id FROM users WHERE role = 'trainer' LIMIT 1");
    let trainerId = null;
    
    if (trainerRes.rows.length === 0) {
      // Create a dummy trainer
      const insertUser = await pool.query(
        "INSERT INTO users (role, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id",
        ['trainer', 'Dr. Albert Einstein', 'albert@eduolympia.com', 'hashedpwd']
      );
      trainerId = insertUser.rows[0].id;
    } else {
      trainerId = trainerRes.rows[0].id;
    }

    const items = [
      { title: "Advanced Calculus Formulas & Theorems", type: "PDF", subject: "Mathematics", status: "Pending" },
      { title: "Newton's Laws Practical Demonstration", type: "Video", subject: "Physics", status: "Pending" },
      { title: "Organic Chemistry Nomenclature Guide", type: "Notes", subject: "Chemistry", status: "Pending" },
      { title: "Cell Structure 3D Animation", type: "Video", subject: "Biology", status: "Pending" },
      { title: "Probability & Statistics Practice Set", type: "PDF", subject: "Mathematics", status: "Approved" },
      { title: "Intro to Quantum Mechanics", type: "PDF", subject: "Physics", status: "Rejected" },
    ];

    for (const item of items) {
      await pool.query(
        "INSERT INTO study_materials (title, type, subject, status, uploaded_by) VALUES ($1, $2, $3, $4, $5)",
        [item.title, item.type, item.subject, item.status, trainerId]
      );
    }
    
    console.log("Successfully seeded 6 rich study materials!");
  } catch (err) {
    console.error("Error seeding:", err);
  } finally {
    pool.end();
  }
}

seedContent();
