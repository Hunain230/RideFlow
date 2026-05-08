const axios = require('axios');

// Test tokens
const riderToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjIxLCJlbWFpbCI6InRlc3QucmlkZXJAcmlkZWZsb3cuY29tIiwicm9sZSI6IlJpZGVyIiwiaWF0IjoxNzc4MjU2NTcxLCJleHAiOjE3NzgzNDI5NzF9.oabQUsW274My7d5SvZmNcbPcWUs1udAdEfdk_P__oY0";
const driverToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjIyLCJlbWFpbCI6InRlc3QuZHJpdmVyQHJpZGVmbG93LmNvbSIsInJvbGUiOiJEcml2ZXIiLCJpYXQiOjE3NzgyNTYxMTYsImV4cCI6MTc3ODM0MjUxNn0.f602MgfyVThikS4TyPFrIPuikQHOAechstS5CeKRaxk";

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

async function testCompleteRideFlow() {
  try {
    console.log('🔄 Testing Complete Ride Flow with Real-time Updates...\n');

    // Step 1: Check initial state
    console.log('1. Checking initial state...');
    const riderAPI = axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${riderToken}`
      }
    });

    const driverAPI = axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${driverToken}`
      }
    });

    // Step 2: Create ride from rider portal
    console.log('\n2. Creating ride from rider portal...');
    const newRide = {
      pickupLocationID: 1,
      dropoffLocationID: 2,
      vehicleType: 'Economy'
    };

    const rideResponse = await riderAPI.post('/rider/rides', newRide);
    const rideId = rideResponse.data.data.rideID;
    console.log('✅ Ride created with ID:', rideId);

    // Step 3: Wait for system to process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 4: Check driver's incoming rides
    console.log('\n3. Checking driver incoming rides...');
    const incomingResponse = await driverAPI.get('/driver/rides/incoming');
    const incomingRides = incomingResponse.data.data || [];
    
    if (incomingRides.length > 0) {
      const targetRide = incomingRides.find(ride => ride.RideID === rideId);
      
      if (targetRide) {
        console.log('✅ Ride found in driver incoming rides!');
        
        // Step 5: Test driver accepting ride
        console.log('\n4. Driver accepting ride...');
        
        // Get driver vehicles first
        const vehiclesResponse = await driverAPI.get('/driver/vehicles');
        const vehicles = vehiclesResponse.data.data;
        
        if (vehicles && vehicles.length > 0) {
          const vehicleID = vehicles[0].VehicleID;
          await driverAPI.patch(`/driver/rides/${rideId}/accept`, { vehicleID });
          console.log('✅ Driver accepted ride!');
          
          // Step 6: Wait for real-time updates
          console.log('\n5. Testing real-time status updates...');
          await testRealTimeUpdates(riderAPI, driverAPI, rideId);
          
        } else {
          console.log('❌ No vehicles available for driver');
        }
      } else {
        console.log('❌ Ride not found in driver incoming rides');
      }
    } else {
      console.log('❌ No incoming rides found for driver');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

async function testRealTimeUpdates(riderAPI, driverAPI, rideId) {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    attempts++;
    console.log(`\n--- Update Check ${attempts} ---`);
    
    try {
      // Check rider's ride status
      const riderRideResponse = await riderAPI.get(`/rider/rides/${rideId}`);
      const riderStatus = riderRideResponse.data.data.RideStatus;
      console.log(`Rider sees status: ${riderStatus}`);
      
      // Check driver's active rides
      const driverRidesResponse = await driverAPI.get('/driver/rides');
      const driverRides = driverRidesResponse.data.data || [];
      const driverRide = driverRides.find(ride => ride.RideID === rideId);
      const driverStatus = driverRide ? driverRide.RideStatus : 'Not found';
      console.log(`Driver sees status: ${driverStatus}`);
      
      // Check if statuses are synchronized
      if (riderStatus === 'Accepted' && driverStatus === 'Accepted') {
        console.log('✅ Real-time sync: Both rider and driver see "Accepted"');
        
        // Test driver starting ride
        console.log('\n6. Driver starting ride...');
        await driverAPI.patch(`/driver/rides/${rideId}/start`);
        console.log('✅ Driver started ride!');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Test driver completing ride
        console.log('\n7. Driver completing ride...');
        await driverAPI.patch(`/driver/rides/${rideId}/complete`);
        console.log('✅ Driver completed ride!');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Final status check
        const finalRiderResponse = await riderAPI.get(`/rider/rides/${rideId}`);
        const finalDriverResponse = await driverAPI.get('/driver/rides');
        const finalDriverRide = finalDriverResponse.data.data.find(ride => ride.RideID === rideId);
        
        console.log(`\n🎉 FINAL STATUS:`);
        console.log(`Rider final status: ${finalRiderResponse.data.data.RideStatus}`);
        console.log(`Driver final status: ${finalDriverRide ? finalDriverRide.RideStatus : 'Not found'}`);
        
        if (finalRiderResponse.data.data.RideStatus === 'Completed' && finalDriverRide && finalDriverRide.RideStatus === 'Completed') {
          console.log('🎉 PERFECT! Complete ride flow working with real-time updates!');
          return true;
        }
        
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Update check ${attempts} failed:`, error.response?.data || error.message);
    }
  }
  
  console.log(`\n⏰ Completed ${attempts} update checks`);
  return false;
}

testCompleteRideFlow();
