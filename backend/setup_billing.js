const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function setupBilling() {
  try {
    console.log("Setting up invoices table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id VARCHAR(50) PRIMARY KEY,
        school_name VARCHAR(255) NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        invoice_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const check = await pool.query("SELECT id FROM invoices LIMIT 1");
    if (check.rows.length === 0) {
      await pool.query("INSERT INTO invoices (id, school_name, amount, status, invoice_date) VALUES ('INV-2026-001', 'Greenwood High', 95000, 'Paid', '2026-10-01')");
      await pool.query("INSERT INTO invoices (id, school_name, amount, status, invoice_date) VALUES ('INV-2026-002', 'Oakridge International', 180000, 'Pending', '2026-10-05')");
      await pool.query("INSERT INTO invoices (id, school_name, amount, status, invoice_date) VALUES ('INV-2026-003', 'Silver Oaks Academy', 65000, 'Overdue', '2026-09-15')");
    }
    console.log("invoices setup complete!");
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
setupBilling();
