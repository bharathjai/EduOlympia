const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function initDB() {
  console.log('Connecting to Supabase...');
  
  // Connect directly using DATABASE_URL
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Supabase
  });

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL database.');
    
    console.log('Executing schema.sql...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    await client.query(schemaSql);
    console.log('Schema executed successfully. All tables created!');

    // Create super admin if not exists
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('superadmin123', saltRounds);
    
    const superAdminCheck = await client.query(`SELECT * FROM users WHERE email = 'superadmin@eduolympia.com'`);
    if (superAdminCheck.rowCount === 0) {
      // First ensure a school exists for the admin
      const schoolCheck = await client.query(`SELECT id FROM schools LIMIT 1`);
      let schoolId;
      if (schoolCheck.rowCount === 0) {
        const newSchool = await client.query(`INSERT INTO schools (name) VALUES ('EduOlympia Default School') RETURNING id`);
        schoolId = newSchool.rows[0].id;
      } else {
        schoolId = schoolCheck.rows[0].id;
      }

      await client.query(
        `INSERT INTO users (school_id, role, name, email, password_hash) VALUES ($1, $2, $3, $4, $5)`,
        [schoolId, 'super_admin', 'Super Admin', 'superadmin@eduolympia.com', passwordHash]
      );
      console.log('Super admin user created. (superadmin@eduolympia.com / superadmin123)');
    } else {
      console.log('Super admin user already exists.');
    }

  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    await client.end();
  }
}

initDB();
