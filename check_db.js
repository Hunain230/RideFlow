const db = require('./rideflow-backend/config/db');

async function checkDB() {
  try {
    const [locations] = await db.query('SELECT COUNT(*) as locationCount FROM LOCATIONS');
    console.log('Location count:', locations[0].locationCount);
    
    const [drivers] = await db.query('SELECT COUNT(*) as driverCount FROM DRIVERS');
    console.log('Driver count:', drivers[0].driverCount);
    
    const [users] = await db.query('SELECT COUNT(*) as userCount FROM USERS WHERE Email LIKE "test.%"');
    console.log('Test users count:', users[0].userCount);
    
    // Get sample locations if they exist
    const [sampleLocations] = await db.query('SELECT LocationID, LocationName, City FROM LOCATIONS LIMIT 3');
    if (sampleLocations.length > 0) {
      console.log('\nSample locations:');
      sampleLocations.forEach(loc => console.log(`ID: ${loc.LocationID}, Name: ${loc.LocationName}, City: ${loc.City}`));
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkDB();
