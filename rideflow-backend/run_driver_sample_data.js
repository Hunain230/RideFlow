const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: __dirname + '/.env' });

async function executeSQLFile() {
  const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    database: 'RideFlow',
    user: 'root',
    password: 'DIPLOM@t98',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '+00:00',
  });

  try {
    console.log('🔄 Executing driver sample data script...');
    
    // Read the SQL file
    const sqlFile = fs.readFileSync(__dirname + '/../10_driver_sample_data.sql', 'utf8');
    
    // Split into individual statements (simple approach)
    const statements = sqlFile.split(';').filter(stmt => stmt.trim().length > 0);
    
    const connection = await pool.getConnection();
    
    for (const statement of statements) {
      const trimmedStatement = statement.trim();
      if (trimmedStatement && !trimmedStatement.startsWith('--')) {
        try {
          await connection.execute(trimmedStatement);
        } catch (err) {
          // Ignore errors for statements that might fail (like INSERT if data already exists)
          if (!err.message.includes('Duplicate entry')) {
            console.log('⚠️  Warning:', err.message);
          }
        }
      }
    }
    
    connection.release();
    console.log('✅ Driver sample data executed successfully!');
    
    // Show summary of what was created
    const [drivers] = await pool.execute('SELECT COUNT(*) as count FROM DRIVERS');
    const [rides] = await pool.execute('SELECT COUNT(*) as count FROM RIDES');
    const [payments] = await pool.execute('SELECT COUNT(*) as count FROM PAYMENTS');
    
    console.log('\n📊 Database Summary:');
    console.log(`- Drivers: ${drivers[0].count}`);
    console.log(`- Rides: ${rides[0].count}`);
    console.log(`- Payments: ${payments[0].count}`);
    
    // Show driver earnings
    const [driverStats] = await pool.execute(`
      SELECT 
        d.DriverID,
        u.FirstName,
        u.LastName,
        COUNT(r.RideID) as total_rides,
        COALESCE(SUM(p.Amount), 0) as total_earnings,
        d.WalletBalance
      FROM DRIVERS d
      JOIN USERS u ON d.UserID = u.UserID
      LEFT JOIN RIDES r ON d.DriverID = r.DriverID AND r.RideStatus = 'Completed'
      LEFT JOIN PAYMENTS p ON r.RideID = p.RideID AND p.PaymentStatus = 'Paid'
      GROUP BY d.DriverID, u.FirstName, u.LastName, d.WalletBalance
      ORDER BY total_earnings DESC
    `);
    
    console.log('\n💰 Driver Earnings Summary:');
    driverStats.forEach(driver => {
      console.log(`- ${driver.FirstName} ${driver.LastName}: ${driver.total_rides} rides, PKR ${Number(driver.total_earnings).toFixed(2)} earned, PKR ${Number(driver.WalletBalance).toFixed(2)} in wallet`);
    });
    
  } catch (error) {
    console.error('❌ Error executing SQL file:', error.message);
  } finally {
    await pool.end();
  }
}

executeSQLFile();
