const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function migrateSchema() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // 1. Students Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS trainer_students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        class_grade VARCHAR(100),
        section VARCHAR(50),
        last_active VARCHAR(100),
        score INTEGER,
        phone VARCHAR(50)
      );
    `);
    const checkStudents = await client.query('SELECT count(*) FROM trainer_students');
    if (parseInt(checkStudents.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO trainer_students (name, class_grade, section, last_active, score, phone) VALUES
        ('Aarav Sharma', 'Class 8', 'A', '2 hours ago', 85, '+91 9876543210'),
        ('Diya Patel', 'Class 9', 'B', 'Just now', 92, '+91 8765432109'),
        ('Kabir Singh', 'Class 8', 'A', '1 day ago', 68, '+91 7654321098'),
        ('Ananya Iyer', 'Class 10', 'C', '5 mins ago', 96, '+91 6543210987'),
        ('Rohan Gupta', 'Class 9', 'A', '3 days ago', 74, '+91 5432109876')
      `);
    }

    // 2. Practice Papers
    await client.query(`
      CREATE TABLE IF NOT EXISTS practice_papers (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        subject VARCHAR(100),
        class_grade VARCHAR(100),
        total_questions INTEGER,
        difficulty VARCHAR(50)
      );
    `);
    const checkPractice = await client.query('SELECT count(*) FROM practice_papers');
    if (parseInt(checkPractice.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO practice_papers (title, subject, class_grade, total_questions, difficulty) VALUES
        ('Algebra Revision - Chapter 1', 'Mathematics', 'Class 8', 25, 'Medium'),
        ('Geometry Fundamentals', 'Mathematics', 'Class 9', 30, 'Hard'),
        ('Fractions & Decimals Quiz', 'Mathematics', 'Class 7', 20, 'Easy')
      `);
    }

    // 3. Exams
    await client.query(`
      CREATE TABLE IF NOT EXISTS trainer_exams (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        subject VARCHAR(100),
        class_grade VARCHAR(100),
        date VARCHAR(50),
        duration INTEGER,
        status VARCHAR(50)
      );
    `);
    const checkExams = await client.query('SELECT count(*) FROM trainer_exams');
    if (parseInt(checkExams.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO trainer_exams (title, subject, class_grade, date, duration, status) VALUES
        ('Mid-Term Mathematics Exam', 'Mathematics', 'Class 8', 'Oct 15, 2026', 60, 'upcoming'),
        ('Geometry Unit Test', 'Mathematics', 'Class 8', 'Oct 22, 2026', 45, 'upcoming'),
        ('Algebra Weekly Quiz', 'Mathematics', 'Class 8', 'Sep 30, 2026', 30, 'completed')
      `);
    }

    // 4. Materials
    await client.query(`
      CREATE TABLE IF NOT EXISTS trainer_materials (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        subject VARCHAR(100),
        class_grade VARCHAR(100),
        type VARCHAR(50),
        size VARCHAR(50),
        uploaded_at VARCHAR(50)
      );
    `);
    const checkMaterials = await client.query('SELECT count(*) FROM trainer_materials');
    if (parseInt(checkMaterials.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO trainer_materials (title, subject, class_grade, type, size, uploaded_at) VALUES
        ('Quadratic Equations - Complete Notes', 'Mathematics', 'Class 10', 'PDF', '2.4 MB', '2 days ago'),
        ('Trigonometry Formulas Cheat Sheet', 'Mathematics', 'Class 10', 'PDF', '1.1 MB', '1 week ago'),
        ('Linear Equations Video Lecture', 'Mathematics', 'Class 8', 'Video', '145 MB', '3 days ago')
      `);
    }

    // 5. Questions
    await client.query(`
      CREATE TABLE IF NOT EXISTS trainer_questions (
        id SERIAL PRIMARY KEY,
        question_text TEXT,
        subject VARCHAR(100),
        topic VARCHAR(100),
        difficulty VARCHAR(50),
        type VARCHAR(50)
      );
    `);
    const checkQs = await client.query('SELECT count(*) FROM trainer_questions');
    if (parseInt(checkQs.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO trainer_questions (question_text, subject, topic, difficulty, type) VALUES
        ('If 2x + 5 = 15, what is the value of x?', 'Mathematics', 'Algebra', 'Easy', 'Multiple Choice'),
        ('What is the sum of angles in a convex pentagon?', 'Mathematics', 'Geometry', 'Medium', 'Multiple Choice'),
        ('Solve for y: 3(y - 2) = 2y + 8', 'Mathematics', 'Algebra', 'Medium', 'Short Answer'),
        ('In a right-angled triangle, if the hypotenuse is 13 and one side is 5, find the other side.', 'Mathematics', 'Geometry', 'Hard', 'Multiple Choice')
      `);
    }
    
    // Apply RLS
    const tables = ['trainer_students', 'practice_papers', 'trainer_exams', 'trainer_materials', 'trainer_questions'];
    for (const table of tables) {
      await client.query(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`);
      try {
        await client.query(`CREATE POLICY "Allow public read access" ON ${table} FOR SELECT USING (true);`);
        await client.query(`CREATE POLICY "Allow public insert" ON ${table} FOR INSERT WITH CHECK (true);`);
        await client.query(`CREATE POLICY "Allow public update" ON ${table} FOR UPDATE USING (true);`);
        await client.query(`CREATE POLICY "Allow public delete" ON ${table} FOR DELETE USING (true);`);
      } catch(e) {}
    }

    console.log('All remaining tables created and seeded!');
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

migrateSchema();
