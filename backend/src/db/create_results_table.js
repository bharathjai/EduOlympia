const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function createResultsTable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_test_results (
        id SERIAL PRIMARY KEY,
        student_name VARCHAR(255),
        paper_id INTEGER,
        paper_title VARCHAR(255),
        score INTEGER,
        total_questions INTEGER,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Enable RLS and create public access policies for simplicity in demo
    await client.query(`ALTER TABLE student_test_results ENABLE ROW LEVEL SECURITY;`);
    try {
      await client.query(`CREATE POLICY "Allow public read access" ON student_test_results FOR SELECT USING (true);`);
      await client.query(`CREATE POLICY "Allow public insert" ON student_test_results FOR INSERT WITH CHECK (true);`);
    } catch(e) {
      // Policies might already exist
    }

    console.log('student_test_results table created successfully!');
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

createResultsTable();
