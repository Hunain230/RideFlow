const axios = require('axios');

async function testLogin() {
  console.log('Testing login endpoint...');
  
  const users = [
    { email: 'test.admin@rideflow.com', password: 'admin123', name: 'Admin' },
    { email: 'test.rider@rideflow.com', password: 'rider123', name: 'Rider' },
    { email: 'test.driver@rideflow.com', password: 'driver123', name: 'Driver' }
  ];
  
  for (const user of users) {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: user.email,
        password: user.password
      });
      
      console.log(`✅ ${user.name} login successful!`);
      console.log('Full response:', JSON.stringify(response.data, null, 2));
      console.log('---');
      
    } catch (error) {
      console.error(`❌ ${user.name} login failed:`);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
      console.log('---');
    }
  }
}

testLogin();
