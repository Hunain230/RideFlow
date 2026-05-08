const db = require('./config/db');

async function checkDriverData() {
  try {
    console.log('Checking driver data...');
    
    // Check if driver user has driver record
    const [driverUsers] = await db.query('SELECT UserID, Email FROM USERS WHERE Role = "Driver"');
    console.log('Driver users found:', driverUsers.length);
    
    for (const user of driverUsers) {
      console.log('Checking user:', user.UserID, user.Email);
      
      const [driverRecords] = await db.query('SELECT * FROM DRIVERS WHERE UserID = ?', [user.UserID]);
      console.log('Driver records for user', user.UserID, ':', driverRecords.length);
      
      if (driverRecords.length === 0) {
        console.log('Creating driver record for user:', user.UserID);
        
        // Create driver record
        const [result] = await db.query(
          'INSERT INTO DRIVERS (UserID, LicenseNumber, CNIC, VerificationStatus, AvailabilityStatus, WalletBalance, CommissionRate) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [user.UserID, 'TEST-LICENSE-' + user.UserID, '12345-6789012-3', 'Verified', 'Online', 0, 15]
        );
        console.log('Driver record created with ID:', result.insertId);
      }
    }
    
    // Check for rides data
    const [rides] = await db.query('SELECT COUNT(*) as count FROM RIDES');
    console.log('Total rides in database:', rides[0].count);
    
    if (rides[0].count === 0) {
      console.log('Creating sample rides data...');
      
      // Get driver ID
      const [driverRecord] = await db.query('SELECT DriverID FROM DRIVERS WHERE UserID = 22');
      const driverId = driverRecord[0].DriverID;
      
      // Get customer ID
      const [customer] = await db.query('SELECT UserID FROM USERS WHERE Role = "Rider" LIMIT 1');
      const customerId = customer[0].UserID;
      
      // Create sample rides
      for (let i = 1; i <= 5; i++) {
        await db.query(
          'INSERT INTO RIDES (CustomerID, DriverID, PickupLocationID, DropoffLocationID, RideStatus, Fare, Distance, StartTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [customerId, driverId, 1, 2, 'Completed', 100 + (i * 20), 5 + i, new Date(Date.now() - (i * 24 * 60 * 60 * 1000))]
        );
      }
      
      console.log('Sample rides created');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkDriverData();
