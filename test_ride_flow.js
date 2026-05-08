const axios = require('axios');

// Test tokens
const riderToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjIxLCJlbWFpbCI6InRlc3QucmlkZXJAcmlkZWZsb3cuY29tIiwicm9sZSI6IlJpZGVyIiwiaWF0IjoxNzc4MjU2NTcxLCJleHAiOjE3NzgzNDI5NzF9.oabQUsW274My7d5SvZmNcbPcWUs1udAdEfdk_P__oY0";
const driverToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjIyLCJlbWFpbCI6InRlc3QuZHJpdmVyQHJpZGVmbG93LmNvbSIsInJvbGUiOiJEcml2ZXIiLCJpYXQiOjE3NzgyNTYxMTYsImV4cCI6MTc3ODM0MjUxNn0.f602MgfyVThikS4TyPFrIPuikQHOAechstS5CeKRaxk";

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

async function testRideFlow() {
  try {
    console.log('🔄 Testing Complete Ride Flow...\n');

    // Step 1: Check driver's current incoming rides (should be empty)
    console.log('1. Checking driver incoming rides (before ride creation)...');
    const driverAPI = axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${driverToken}`
      }
    });
    
    const incomingBefore = await driverAPI.get('/driver/rides/incoming');
    console.log('✅ Incoming rides before:', incomingBefore.data.data.length);

    // Step 2: Rider creates a new ride
    console.log('\n2. Creating new ride from rider portal...');
    const riderAPI = axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${riderToken}`
      }
    });

    const newRide = {
      pickupLocationID: 1,
      dropoffLocationID: 2,
      vehicleType: 'Economy'
    };

    const rideResponse = await riderAPI.post('/rider/rides', newRide);
    console.log('✅ Ride created:', rideResponse.data.data.RideID);

    // Step 3: Wait a moment for system to process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 4: Check driver's incoming rides again
    console.log('\n3. Checking driver incoming rides (after ride creation)...');
    const incomingAfter = await driverAPI.get('/driver/rides/incoming');
    console.log('✅ Incoming rides after:', incomingAfter.data.data.length);
    
    if (incomingAfter.data.data.length > 0) {
      console.log('🎉 SUCCESS! Ride is now visible to driver!');
      console.log('Ride details:', incomingAfter.data.data[0]);
      
      // Step 5: Test driver accepting the ride
      console.log('\n4. Testing driver accepting the ride...');
      const rideId = incomingAfter.data.data[0].RideID;
      
      try {
        // First get driver's available vehicles
        const vehiclesResponse = await driverAPI.get('/driver/vehicles');
        const vehicles = vehiclesResponse.data.data;
        
        if (vehicles && vehicles.length > 0) {
          const vehicleID = vehicles[0].VehicleID;
          console.log(`Using vehicle ID: ${vehicleID}`);
          await driverAPI.patch(`/driver/rides/${rideId}/accept`, { vehicleID });
          console.log('✅ Ride accepted successfully!');
        } else {
          console.log('❌ No vehicles available for driver');
        }
        
        // Step 6: Check if ride moved from incoming to active rides
        await new Promise(resolve => setTimeout(resolve, 1000));
        const incomingAfterAccept = await driverAPI.get('/driver/rides/incoming');
        const myRides = await driverAPI.get('/driver/rides');
        
        console.log('✅ Incoming rides after accept:', incomingAfterAccept.data.data.length);
        console.log('✅ My rides after accept:', myRides.data.data.length);
        
        if (incomingAfterAccept.data.data.length === 0 && myRides.data.data.length > 0) {
          console.log('🎉 PERFECT! Ride flow working correctly!');
        }
        
      } catch (acceptError) {
        console.log('❌ Failed to accept ride:', acceptError.response?.data || acceptError.message);
      }
      
    } else {
      console.log('❌ FAILED! Ride not showing up in driver incoming rides');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testRideFlow();
