// Check the actual schema of RIDES table
const db = require('./config/db');

async function checkRidesSchema() {
  try {
    console.log('Checking RIDES table schema...');
    
    const [rows] = await db.query('DESCRIBE RIDES');
    console.log('RIDES table columns:');
    rows.forEach(row => {
      console.log(`  ${row.Field} - ${row.Type}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking schema:', error);
    process.exit(1);
  }
}

checkRidesSchema();
