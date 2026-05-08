const db = require('./rideflow-backend/config/db');

async function checkLocations() {
  try {
    const [rows] = await db.query('SELECT LocationID, LocationName, City FROM LOCATIONS LIMIT 5');
    console.log('Available locations:');
    rows.forEach(row => console.log(`ID: ${row.LocationID}, Name: ${row.LocationName}, City: ${row.City}`));
    
    // Also check if there are any drivers available
    const [drivers] = await db.query('SELECT DriverID, UserID FROM DRIVERS WHERE AvailabilityStatus = "Online" AND VerificationStatus = "Verified" LIMIT 3');
    console.log('\nAvailable drivers:');
    drivers.forEach(driver => console.log(`DriverID: ${driver.DriverID}, UserID: ${driver.UserID}`));
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkLocations();
