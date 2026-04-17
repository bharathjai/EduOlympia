const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// We need the service role key to bypass RLS and create tables, 
// BUT we only have the anon key. 
// We will use pg client instead since we have DATABASE_URL in backend/.env

const { Client } = require('pg');

async function migrateSchema() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Supabase DB via pg...');

    // Create Classes Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS live_classes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        subject VARCHAR(100),
        class_grade VARCHAR(100),
        date VARCHAR(50),
        time VARCHAR(50),
        status VARCHAR(50),
        students_registered INTEGER DEFAULT 0
      );
    `);

    // Create Analytics Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics_overview (
        id SERIAL PRIMARY KEY,
        total_students INTEGER,
        materials_published INTEGER,
        questions_created INTEGER,
        live_classes_hosted INTEGER,
        average_test_score DECIMAL(5,2),
        improvement_rate DECIMAL(5,2)
      );
    `);

    // Seed Live Classes
    const checkClasses = await client.query('SELECT count(*) FROM live_classes');
    if (parseInt(checkClasses.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO live_classes (title, subject, class_grade, date, time, status, students_registered) VALUES
        ('Graphical Representation of Data', 'Mathematics', 'Class 8', 'Today', '04:00 PM', 'upcoming', 45),
        ('Linear Equations in One Variable', 'Mathematics', 'Class 8', 'Tomorrow', '10:00 AM', 'upcoming', 38),
        ('Understanding Quadrilaterals', 'Mathematics', 'Class 8', '15 Oct, 2026', '02:00 PM', 'completed', 42)
      `);
    }

    // Seed Analytics
    const checkAnalytics = await client.query('SELECT count(*) FROM analytics_overview');
    if (parseInt(checkAnalytics.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO analytics_overview (total_students, materials_published, questions_created, live_classes_hosted, average_test_score, improvement_rate) VALUES
        (2847, 56, 3420, 5, 78.6, 8.1)
      `);
    }

    console.log('Missing tables created and seeded!');
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

migrateSchema();
