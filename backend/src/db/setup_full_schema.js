const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function setupFullSchema() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS live_classes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        subject VARCHAR(100),
        class_grade VARCHAR(100),
        date VARCHAR(100),
        time VARCHAR(50),
        status VARCHAR(50),
        students_registered INTEGER DEFAULT 0
      );
    `);
    
    const checkClasses = await client.query('SELECT count(*) FROM live_classes');
    if (parseInt(checkClasses.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO live_classes (title, subject, class_grade, date, time, status, students_registered) VALUES
        ('Algebra Crash Course', 'Mathematics', 'Class 8', 'Tomorrow', '10:00 AM', 'upcoming', 24),
        ('Chemical Reactions Q&A', 'Science', 'Class 10', 'In 2 days', '2:00 PM', 'upcoming', 18)
      `);
    }

    // Enable RLS and create public access policies
    await client.query(`ALTER TABLE live_classes ENABLE ROW LEVEL SECURITY;`);
    try {
      await client.query(`CREATE POLICY "Allow public read access" ON live_classes FOR SELECT USING (true);`);
      await client.query(`CREATE POLICY "Allow public insert" ON live_classes FOR INSERT WITH CHECK (true);`);
    } catch(e) {}

    console.log('live_classes table created successfully!');
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

setupFullSchema();
