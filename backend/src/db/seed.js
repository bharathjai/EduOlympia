const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function seedDB() {
  console.log('Connecting to Supabase for seeding...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected! Seeding sample data...');

    // Get the school ID
    const schoolRes = await client.query('SELECT id FROM schools LIMIT 1');
    const schoolId = schoolRes.rows[0].id;

    // Create Trainer User
    const bcrypt = require('bcrypt');
    const trainerHash = await bcrypt.hash('trainer123', 10);
    const trainerRes = await client.query(
      `INSERT INTO users (school_id, role, name, email, password_hash) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [schoolId, 'trainer', 'Rahul Singh', 'trainer@eduolympia.com', trainerHash]
    );
    const trainerId = trainerRes.rows[0]?.id || (await client.query(`SELECT id FROM users WHERE email='trainer@eduolympia.com'`)).rows[0].id;

    // Create Student User
    const studentHash = await bcrypt.hash('student123', 10);
    const studentRes = await client.query(
      `INSERT INTO users (school_id, role, name, email, password_hash) 
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [schoolId, 'student', 'Aryan Kumar', 'student@eduolympia.com', studentHash]
    );
    const studentUserId = studentRes.rows[0]?.id || (await client.query(`SELECT id FROM users WHERE email='student@eduolympia.com'`)).rows[0].id;

    // Create Student Record
    await client.query(
      `INSERT INTO students (user_id, school_id, batch_class) 
       SELECT $1, $2, $3 
       WHERE NOT EXISTS (SELECT 1 FROM students WHERE user_id = $1)`,
      [studentUserId, schoolId, 'Class 8']
    );

    // Create Subjects
    const mathRes = await client.query(`INSERT INTO subjects (name) VALUES ('Mathematics') RETURNING id`);
    const mathId = mathRes.rows[0].id;

    // Create Classes (Tests)
    await client.query(
      `INSERT INTO tests (title, school_id, batch_class, created_by) VALUES 
      ('Algebra Basics', $1, 'Class 8', $2),
      ('Geometry Intro', $1, 'Class 8', $2)`,
      [schoolId, trainerId]
    );

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.end();
  }
}

seedDB();
