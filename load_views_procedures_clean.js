const fs = require('fs');
const db = require('./rideflow-backend/config/db');

async function loadViewsAndProcedures() {
  try {
    console.log('Loading updated views and procedures...');
    
    // Load views
    const viewsSQL = fs.readFileSync('./06_views.sql', 'utf8');
    await db.query(viewsSQL);
    console.log('✓ Views loaded successfully');
    
    // Load procedures
    const proceduresSQL = fs.readFileSync('./05_procedures.sql', 'utf8');
    await db.query(proceduresSQL);
    console.log('✓ Procedures loaded successfully');
    
    console.log('\n✅ All views and procedures updated and loaded!');
    process.exit(0);
  } catch (err) {
    console.error('Error loading views/procedures:', err);
    process.exit(1);
  }
}

loadViewsAndProcedures();
