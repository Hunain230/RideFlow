const jwt = require('jsonwebtoken');
require('dotenv').config({ path: __dirname + '/../.env' });
const db = require('./config/db');

async function createDriverToken() {
  try {
    await db.query('SELECT 1');
    console.log('✅ Connected to database - Creating driver token...');
    
    const [drivers] = await db.query('SELECT UserID, Email FROM USERS WHERE Role = "Driver" LIMIT 1');
    
    if (drivers.length === 0) {
      console.log('❌ No driver users found');
      return;
    }
    
    const driver = drivers[0];
    console.log('Found existing driver user:');
    console.log('User ID:', driver.UserID);
    console.log('Email:', driver.Email);
    
    const token = jwt.sign(
      { userID: driver.UserID, email: driver.Email, role: 'Driver' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    console.log('Token:', token);
    console.log('✅ Driver token created successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

createDriverToken();
