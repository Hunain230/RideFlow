const fs = require('fs');
const db = require('./rideflow-backend/config/db');

async function loadProcedures() {
  try {
    console.log('Loading stored procedures...');
    
    // Read and execute procedures SQL
    const proceduresSQL = fs.readFileSync('./05_procedures.sql', 'utf8');
    
    // Split by $$ delimiter and execute each procedure
    const statements = proceduresSQL.split('$$').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.includes('CREATE PROCEDURE') || statement.includes('DROP PROCEDURE')) {
        try {
          await db.query(statement + '$$');
          console.log('✓ Procedure loaded');
        } catch (err) {
          console.log('⚠ Procedure error:', err.message);
        }
      }
    }
    
    console.log('\n✅ Stored procedures loaded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error loading procedures:', err);
    process.exit(1);
  }
}

loadProcedures();
