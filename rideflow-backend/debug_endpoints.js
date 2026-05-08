const fetch = require('node-fetch');

async function getAuthToken() {
    const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: 'test.driver@rideflow.com',
            password: 'driver123'
        })
    });
    
    const data = await response.json();
    return data.data.token;
}

async function testEndpoints() {
    try {
        const token = await getAuthToken();
        console.log('Token obtained:', token.substring(0, 50) + '...');
        
        // Test driver profile update
        console.log('\n🔍 Testing driver profile update...');
        const updateResponse = await fetch('http://localhost:5000/api/driver/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                firstName: 'Updated',
                lastName: 'Driver',
                licenseNumber: 'DL-UPDATED-001'
            })
        });
        
        console.log('Profile Update Status:', updateResponse.status);
        console.log('Profile Update Response:', await updateResponse.json());
        
        // Test vehicle registration
        console.log('\n🔍 Testing vehicle registration...');
        const vehicleResponse = await fetch('http://localhost:5000/api/driver/vehicles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                make: 'Toyota',
                model: 'Corolla',
                year: 2022,
                color: 'Silver',
                licensePlate: 'TEST-123',
                vehicleType: 'Economy'
            })
        });
        
        console.log('Vehicle Registration Status:', vehicleResponse.status);
        console.log('Vehicle Registration Response:', await vehicleResponse.json());
        
        // Test ride creation
        const riderToken = await getAuthToken(); // This will get driver token, need rider token
        console.log('\n🔍 Testing ride creation...');
        const rideResponse = await fetch('http://localhost:5000/api/rides', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                pickupLocation: {
                    latitude: 24.8607,
                    longitude: 67.0011,
                    address: 'Karachi, Pakistan'
                },
                dropoffLocation: {
                    latitude: 24.9136,
                    longitude: 67.0921,
                    address: 'Karachi Airport'
                },
                vehicleType: 'Economy'
            })
        });
        
        console.log('Ride Creation Status:', rideResponse.status);
        console.log('Ride Creation Response:', await rideResponse.json());
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testEndpoints();
