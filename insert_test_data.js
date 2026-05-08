const db = require('./rideflow-backend/config/db');

async function insertTestData() {
  try {
    console.log('Inserting test data...');
    
    // Insert locations
    const [locationResult] = await db.query(`
      INSERT INTO LOCATIONS (LocationName, Street, City, State, Zip, Latitude, Longitude) VALUES
      ('Gulshan Chowrangi', '5-C Block 7 Gulshan-e-Iqbal', 'Karachi', 'Sindh', '75300', 24.92090000, 67.09270000),
      ('DHA Phase 6', 'Khayaban-e-Iqbal', 'Karachi', 'Sindh', '75500', 24.81160000, 67.07580000),
      ('Blue Area', 'Jinnah Avenue', 'Islamabad', 'ICT', '44000', 33.72740000, 73.09320000),
      ('F-7 Markaz', 'F-7 Super Market', 'Islamabad', 'ICT', '44000', 33.72890000, 73.05390000),
      ('Mall Road', '1 Mall Road', 'Lahore', 'Punjab', '54000', 31.56940000, 74.31220000)
    `);
    
    console.log(`✓ Inserted ${locationResult.affectedRows} locations`);
    
    // Update driver to be online and verified
    const [driverUpdate] = await db.query(`
      UPDATE DRIVERS 
      SET VerificationStatus = 'Verified', AvailabilityStatus = 'Online', CurrentLocationID = 1
      WHERE UserID = (SELECT UserID FROM USERS WHERE Email = 'test.driver@rideflow.com')
    `);
    
    console.log(`✓ Updated ${driverUpdate.affectedRows} driver(s) to be online and verified`);
    
    // Insert a vehicle for the test driver
    const [vehicleResult] = await db.query(`
      INSERT INTO VEHICLES (DriverID, Make, Model, Year, Color, LicensePlate, VehicleType, VerificationStatus)
      SELECT d.DriverID, 'Toyota', 'Corolla', 2022, 'White', 'ABC-123', 'Economy', 'Verified'
      FROM DRIVERS d 
      JOIN USERS u ON d.UserID = u.UserID 
      WHERE u.Email = 'test.driver@rideflow.com'
    `);
    
    console.log(`✓ Inserted ${vehicleResult.affectedRows} vehicle(s)`);
    
    // Verify data
    const [locations] = await db.query('SELECT LocationID, LocationName, City FROM LOCATIONS LIMIT 5');
    console.log('\nAvailable locations:');
    locations.forEach(loc => {
      console.log(`ID: ${loc.LocationID}, Name: ${loc.LocationName}, City: ${loc.City}`);
    });
    
    const [drivers] = await db.query(`
      SELECT d.DriverID, u.Email, d.AvailabilityStatus, d.VerificationStatus
      FROM DRIVERS d 
      JOIN USERS u ON d.UserID = u.UserID 
      WHERE u.Email = 'test.driver@rideflow.com'
    `);
    console.log('\nTest driver:');
    drivers.forEach(driver => {
      console.log(`DriverID: ${driver.DriverID}, Email: ${driver.Email}, Status: ${driver.AvailabilityStatus}, Verified: ${driver.VerificationStatus}`);
    });
    
    console.log('\n✅ Test data inserted successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error inserting test data:', err);
    process.exit(1);
  }
}

insertTestData();
