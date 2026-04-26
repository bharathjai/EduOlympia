const db = require('./src/db');
async function addCol() {
  try {
    await db.query(`ALTER TABLE schools ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active'`);
    console.log("Column added");
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}
addCol();
