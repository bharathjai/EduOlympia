const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function addPolicies() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    const tables = ['schools', 'users', 'students', 'subjects', 'chapters', 'topics', 'study_materials', 'questions', 'tests', 'test_questions', 'exams', 'results', 'live_classes', 'analytics_overview'];

    for (const table of tables) {
      await client.query(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`);
      
      // Allow public read access for now to make the frontend work
      await client.query(`
        CREATE POLICY "Allow public read access" ON ${table}
        FOR SELECT USING (true);
      `);
      
      // Allow public insert/update/delete for the trainer dashboard
      await client.query(`
        CREATE POLICY "Allow public insert" ON ${table}
        FOR INSERT WITH CHECK (true);
      `);
      
      await client.query(`
        CREATE POLICY "Allow public update" ON ${table}
        FOR UPDATE USING (true);
      `);
      
      await client.query(`
        CREATE POLICY "Allow public delete" ON ${table}
        FOR DELETE USING (true);
      `);
      
      console.log(`Added permissive policies to ${table}`);
    }
    
  } catch (e) {
    // Ignore "policy already exists" errors
    console.error(e.message);
  } finally {
    await client.end();
  }
}

addPolicies();
