const axios = require('axios');

async function testRegister() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      role: 'Rider'
    });
    console.log('Registration Success:', res.data);
  } catch (err) {
    console.error('Registration Failed:', err.response ? err.response.data : err.message);
  }
}

testRegister();
