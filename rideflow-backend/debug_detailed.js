const fetch = require('node-fetch');

async function getAuthToken(userEmail, password) {
    const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: userEmail,
            password: password
        })
    });
    
    const data = await response.json();
    return data.data.token;
}

async function testAllEndpoints() {
    try {
        const driverToken = await getAuthToken('test.driver@rideflow.com', 'driver123');
        const riderToken = await getAuthToken('test.rider@rideflow.com', 'rider123');
        const adminToken = await getAuthToken('test.admin@rideflow.com', 'admin123');
        
        console.log('🔍 Testing all endpoints with detailed responses...\n');
        
        // Test 1: Driver Profile Update
        console.log('1. Driver Profile Update (/api/driver/profile PATCH)');
        try {
            const updateResponse = await fetch('http://localhost:5000/api/driver/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${driverToken}`
                },
                body: JSON.stringify({
                    firstName: 'Updated',
                    lastName: 'Driver'
                })
            });
            console.log(`   Status: ${updateResponse.status}`);
            const updateData = await updateResponse.json();
            console.log(`   Response:`, JSON.stringify(updateData, null, 2));
        } catch (error) {
            console.log(`   Error: ${error.message}`);
        }
        
        // Test 2: Driver Availability Toggle
        console.log('\n2. Driver Availability Toggle (/api/driver/availability PATCH)');
        try {
            const availabilityResponse = await fetch('http://localhost:5000/api/driver/availability', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${driverToken}`
                },
                body: JSON.stringify({
                    availabilityStatus: 'Online'
                })
            });
            console.log(`   Status: ${availabilityResponse.status}`);
            const availabilityData = await availabilityResponse.json();
            console.log(`   Response:`, JSON.stringify(availabilityData, null, 2));
        } catch (error) {
            console.log(`   Error: ${error.message}`);
        }
        
        // Test 3: Ride Creation
        console.log('\n3. Ride Creation (/api/rider/rides POST)');
        try {
            const rideResponse = await fetch('http://localhost:5000/api/rider/rides', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${riderToken}`
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
            console.log(`   Status: ${rideResponse.status}`);
            const rideData = await rideResponse.json();
            console.log(`   Response:`, JSON.stringify(rideData, null, 2));
        } catch (error) {
            console.log(`   Error: ${error.message}`);
        }
        
        // Test 4: Admin Driver Verification
        console.log('\n4. Admin Driver Verification (/api/admin/drivers/1/verify)');
        try {
            const verifyResponse = await fetch('http://localhost:5000/api/admin/drivers/1/verify', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({
                    verificationStatus: 'Verified'
                })
            });
            console.log(`   Status: ${verifyResponse.status}`);
            const verifyData = await verifyResponse.json();
            console.log(`   Response:`, JSON.stringify(verifyData, null, 2));
        } catch (error) {
            console.log(`   Error: ${error.message}`);
        }
        
        // Test 5: List all available routes
        console.log('\n5. Check available routes...');
        try {
            const routesResponse = await fetch('http://localhost:5000/api/');
            console.log(`   Status: ${routesResponse.status}`);
            console.log(`   Available at /api/`);
        } catch (error) {
            console.log(`   Error: ${error.message}`);
        }
        
    } catch (error) {
        console.error('Authentication Error:', error.message);
    }
}

testAllEndpoints();
