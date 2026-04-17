const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function initDB() {
  console.log('Initializing database...');
  // First, connect to default postgres DB to create our db if it doesn't exist
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: 'postgres',
  });

  try {
    await client.connect();
    console.log('Connected to default postgres database.');
    
    const dbName = process.env.DB_NAME;
    const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${dbName}'`);
    
    if (res.rowCount === 0) {
      console.log(`Database ${dbName} not found, creating it...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database ${dbName} created successfully.`);
    } else {
      console.log(`Database ${dbName} already exists.`);
    }
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
  }

  // Now connect to our newly created DB and run the schema
  const dbClient = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  });

  try {
    await dbClient.connect();
    console.log(`Connected to ${process.env.DB_NAME} database.`);
    
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    await dbClient.query(schemaSql);
    console.log('Schema executed successfully.');

    // Create super admin if not exists
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('superadmin123', saltRounds);
    
    const superAdminCheck = await dbClient.query(`SELECT * FROM users WHERE email = 'superadmin@eduolympia.com'`);
    if (superAdminCheck.rowCount === 0) {
      await dbClient.query(
        `INSERT INTO users (role, name, email, password_hash) VALUES ($1, $2, $3, $4)`,
        ['super_admin', 'Super Admin', 'superadmin@eduolympia.com', passwordHash]
      );
      console.log('Super admin user created. (superadmin@eduolympia.com / superadmin123)');
    } else {
      console.log('Super admin user already exists.');
    }

  } catch (err) {
    console.error('Error executing schema:', err);
  } finally {
    await dbClient.end();
  }
}

initDB();
