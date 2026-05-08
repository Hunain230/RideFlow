const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function updatePasswords() {
  const connection = await db.getConnection();

  try {
    console.log('Updating test user passwords to bcrypt hashes...');

    // Hash passwords
    const adminHash = await bcrypt.hash('admin123', 12);
    const riderHash = await bcrypt.hash('rider123', 12);
    const driverHash = await bcrypt.hash('driver123', 12);

    // Update passwords in database
    await connection.execute(
      'UPDATE USERS SET Password = ? WHERE Email = ?',
      [adminHash, 'test.admin@rideflow.com']
    );

    await connection.execute(
      'UPDATE USERS SET Password = ? WHERE Email = ?',
      [riderHash, 'test.rider@rideflow.com']
    );

    await connection.execute(
      'UPDATE USERS SET Password = ? WHERE Email = ?',
      [driverHash, 'test.driver@rideflow.com']
    );

    console.log('✅ Passwords updated successfully!');
    
    // Verify the updates
    const [users] = await connection.execute(
      'SELECT UserID, Email, LEFT(Password, 30) AS PasswordHash FROM USERS WHERE Email LIKE "test.%@rideflow.com"'
    );
    
    console.log('\nUpdated users:');
    users.forEach(user => {
      console.log(`- ${user.Email}: ${user.PasswordHash}...`);
    });

  } catch (error) {
    console.error('Error updating passwords:', error);
  } finally {
    connection.release();
  }
}

updatePasswords();
