const fs = require('fs');
const db = require('./rideflow-backend/config/db');

async function loadSeedData() {
  try {
    console.log('Loading seed data...');
    
    // Read and execute seed SQL
    const seedSQL = fs.readFileSync('./03_seed.sql', 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = seedSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.includes('INSERT INTO')) {
        try {
          await db.query(statement);
          console.log('✓ Executed:', statement.substring(0, 50) + '...');
        } catch (err) {
          console.log('⚠ Skipped:', statement.substring(0, 50) + '...', err.message);
        }
      }
    }
    
    // Verify data was loaded
    const [locations] = await db.query('SELECT COUNT(*) as count FROM LOCATIONS');
    const [drivers] = await db.query('SELECT COUNT(*) as count FROM DRIVERS WHERE VerificationStatus = "Verified"');
    const [vehicles] = await db.query('SELECT COUNT(*) as count FROM VEHICLES WHERE VerificationStatus = "Verified"');
    
    console.log('\n✅ Seed data loaded successfully:');
    console.log(`- Locations: ${locations[0].count}`);
    console.log(`- Verified Drivers: ${drivers[0].count}`);
    console.log(`- Verified Vehicles: ${vehicles[0].count}`);
    
    // Show sample locations
    const [sampleLocations] = await db.query('SELECT LocationID, LocationName, City FROM LOCATIONS LIMIT 5');
    console.log('\nSample locations:');
    sampleLocations.forEach(loc => {
      console.log(`ID: ${loc.LocationID}, Name: ${loc.LocationName}, City: ${loc.City}`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error('Error loading seed data:', err);
    process.exit(1);
  }
}

loadSeedData();
