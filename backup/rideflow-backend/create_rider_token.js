const jwt = require('jsonwebtoken');
require('dotenv').config({ path: __dirname + '/../.env' });
const db = require('./config/db');

async function createRiderToken() {
  try {
    await db.query('SELECT 1');
    console.log('✅ Connected to database - Creating rider token...');
    
    const [riders] = await db.query('SELECT UserID, Email FROM USERS WHERE Role = "Rider" LIMIT 1');
    
    if (riders.length === 0) {
      console.log('❌ No rider users found');
      return;
    }
    
    const rider = riders[0];
    console.log('Found existing rider user:');
    console.log('User ID:', rider.UserID);
    console.log('Email:', rider.Email);
    
    const token = jwt.sign(
      { userID: rider.UserID, email: rider.Email, role: 'Rider' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    console.log('Token:', token);
    console.log('✅ Rider token created successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

createRiderToken();
