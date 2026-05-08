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

async function debugRemainingIssues() {
    try {
        const driverToken = await getAuthToken('test.driver@rideflow.com', 'driver123');
        const riderToken = await getAuthToken('test.rider@rideflow.com', 'rider123');
        
        console.log('🔍 Debugging remaining failing tests...\n');
        
        // Debug 1: Driver Profile Update
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
        
        // Debug 2: Vehicle Registration
        console.log('\n2. Vehicle Registration (/api/driver/vehicles POST)');
        try {
            const vehicleResponse = await fetch('http://localhost:5000/api/driver/vehicles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${driverToken}`
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
            console.log(`   Status: ${vehicleResponse.status}`);
            const vehicleData = await vehicleResponse.json();
            console.log(`   Response:`, JSON.stringify(vehicleData, null, 2));
            console.log(`   Vehicle ID extraction attempts:`);
            console.log(`   - vehicleData.data?.vehicleID: ${vehicleData.data?.vehicleID}`);
            console.log(`   - vehicleData.data.vehicleID: ${vehicleData.data.vehicleID}`);
            console.log(`   - vehicleData.vehicle?.VehicleID: ${vehicleData.vehicle?.VehicleID}`);
        } catch (error) {
            console.log(`   Error: ${error.message}`);
        }
        
        // Debug 3: Availability Toggle
        console.log('\n3. Availability Toggle (/api/driver/availability PATCH)');
        try {
            const availabilityResponse = await fetch('http://localhost:5000/api/driver/availability', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${driverToken}`
                },
                body: JSON.stringify({
                    status: 'Online'
                })
            });
            console.log(`   Status: ${availabilityResponse.status}`);
            const availabilityData = await availabilityResponse.json();
            console.log(`   Response:`, JSON.stringify(availabilityData, null, 2));
        } catch (error) {
            console.log(`   Error: ${error.message}`);
        }
        
        // Debug 4: Location Creation
        console.log('\n4. Location Creation (/api/rider/locations POST)');
        try {
            const locationResponse = await fetch('http://localhost:5000/api/rider/locations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${riderToken}`
                },
                body: JSON.stringify({
                    locationName: 'Test Pickup',
                    street: 'Test Street',
                    city: 'Karachi',
                    state: 'Sindh',
                    zip: '74000',
                    latitude: 24.8607,
                    longitude: 67.0011
                })
            });
            console.log(`   Status: ${locationResponse.status}`);
            const locationData = await locationResponse.json();
            console.log(`   Response:`, JSON.stringify(locationData, null, 2));
        } catch (error) {
            console.log(`   Error: ${error.message}`);
        }
        
    } catch (error) {
        console.error('Authentication Error:', error.message);
    }
}

debugRemainingIssues();
