const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function enableRealtime() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    console.log('Adding practice_papers to supabase_realtime publication...');
    
    // First check if the publication exists
    const pubCheck = await client.query(`
      SELECT pubname FROM pg_publication WHERE pubname = 'supabase_realtime';
    `);
    
    if (pubCheck.rows.length === 0) {
      console.log('Creating supabase_realtime publication...');
      await client.query(`CREATE PUBLICATION supabase_realtime FOR ALL TABLES;`);
    } else {
      try {
        await client.query(`ALTER PUBLICATION supabase_realtime ADD TABLE practice_papers;`);
        console.log('Successfully added practice_papers to real-time.');
      } catch (e) {
        // Ignore if already added
        if (e.code === '42704') {
            console.log('Table might already be in publication or does not exist.');
        } else if (e.code === '42710') {
            console.log('Table practice_papers is already in publication supabase_realtime.');
        } else {
            throw e;
        }
      }
    }

    console.log('Done!');
  } catch (e) {
    console.error('Error enabling real-time:', e);
  } finally {
    await client.end();
  }
}

enableRealtime();
