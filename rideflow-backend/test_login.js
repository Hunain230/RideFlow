const fetch = require('node-fetch');

async function testLogin() {
    try {
        console.log('🔍 Testing login endpoint...');
        
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test.admin@rideflow.com',
                password: 'admin123'
            })
        });
        
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testLogin();
