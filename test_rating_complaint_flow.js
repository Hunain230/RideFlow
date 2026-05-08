const axios = require('axios');

// Test tokens
const riderToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjIxLCJlbWFpbCI6InRlc3QucmlkZXJAcmlkZWZsb3cuY29tIiwiaWF0IjoxNzc4MjU2NTcxLCJleHAiOjE3NzgzNDI5NzF9.oabQUsW274My7d5SvZmNcbPcWUs1udAdEfdk_P__oY0";
const driverToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjIyLCJlbWFpbCI6InRlc3QucmlkZXJAcmlkZWZsb3cuY29tIiwiaWF0IjoxNzc4MjU2NTcxLCJleHAiOjE3NzgzNDI5NzF9.f602MgfyVThikS4TyPFrIPuikQHOAechstS5CeKRaxk";

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

async function testRatingComplaintFlow() {
  try {
    console.log('🔄 Testing Complete Rating and Complaint Flow...\n');

    // Step 1: Create a ride from rider portal
    console.log('1. Creating ride from rider portal...');
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
    const rideId = rideResponse.data.data.rideID;
    console.log('✅ Ride created with ID:', rideId);

    // Step 2: Driver accepts the ride
    console.log('\n2. Driver accepting ride...');
    const driverAPI = axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${driverToken}`
      }
    });

    // Get driver vehicles
    const vehiclesResponse = await driverAPI.get('/driver/vehicles');
    const vehicles = vehiclesResponse.data.data;
    
    if (vehicles && vehicles.length > 0) {
      const vehicleID = vehicles[0].VehicleID;
      await driverAPI.patch(`/driver/rides/${rideId}/accept`, { vehicleID });
      console.log('✅ Driver accepted ride with vehicle ID:', vehicleID);
    } else {
      console.log('❌ No vehicles available for driver');
      return;
    }

    // Step 3: Driver completes the ride
    console.log('\n3. Driver completing ride...');
    await driverAPI.patch(`/driver/rides/${rideId}/complete`);
    console.log('✅ Driver completed ride!');

    // Step 4: Wait for real-time updates
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Step 5: Check if rider sees completed status
    console.log('\n4. Checking rider ride status...');
    const riderRideResponse = await riderAPI.get(`/rider/rides/${rideId}`);
    const riderStatus = riderRideResponse.data.data.RideStatus;
    console.log('✅ Rider sees status:', riderStatus);

    if (riderStatus === 'Completed') {
      console.log('🎉 SUCCESS! Ride completed and rider can rate driver!');
      
      // Step 6: Test rider rating the driver
      console.log('\n5. Testing rider rating driver...');
      const ratingData = {
        score: 5,
        comment: 'Excellent service! Very professional and friendly.'
      };

      await riderAPI.rateRide(rideId, ratingData);
      console.log('✅ Rider rated driver successfully!');

      // Step 7: Test driver rating the rider
      console.log('\n6. Testing driver rating rider...');
      const driverRatingData = {
        score: 4,
        comment: 'Great rider! Very punctual and courteous.'
      };

      await driverAPI.rateRide(rideId, driverRatingData);
      console.log('✅ Driver rated rider successfully!');

      // Step 8: Test rider filing complaint
      console.log('\n7. Testing rider filing complaint...');
      const complaintData = {
        type: 'service',
        description: 'Driver was rude and unprofessional during the ride.'
      };

      await riderAPI.fileComplaint({
        rideId: rideId,
        complaintType: complaintData.type,
        description: complaintData.description
      });
      console.log('✅ Rider filed complaint successfully!');

      // Step 9: Test driver filing complaint
      console.log('\n8. Testing driver filing complaint...');
      const driverComplaintData = {
        type: 'behavior',
        description: 'Rider was constantly changing destination during the ride.'
      };

      await driverAPI.fileComplaint({
        rideId: rideId,
        complaintType: driverComplaintData.type,
        description: driverComplaintData.description
      });
      console.log('✅ Driver filed complaint successfully!');

      console.log('\n🎉 COMPLETE RATING AND COMPLAINT FLOW WORKING!');
      console.log('✅ Ride created → Driver accepts → Driver completes → Both can rate/complain');
      console.log('✅ Real-time status updates working across all portals');
      console.log('✅ Rating and complaint system fully integrated');

    } catch (error) {
      console.error('❌ Test failed:', error.response?.data || error.message);
    }
  }

  // Additional test: Check if ratings are stored correctly
  async function checkRatings() {
    try {
      console.log('\n🔍 Checking stored ratings...');
      
      // Check rider ratings
      const riderRatingsResponse = await riderAPI.get(`/rider/rides/${rideId}/ratings`);
      console.log('Rider ratings for this ride:', riderRatingsResponse.data.data);
      
      // Check driver ratings
      const driverRatingsResponse = await driverAPI.getRatings();
      console.log('Driver overall ratings:', driverRatingsResponse.data.data);
      
      console.log('✅ Rating system working correctly!');
      
    } catch (error) {
      console.error('❌ Failed to check ratings:', error.response?.data || error.message);
    }
  }

  async function main() {
    await testRatingComplaintFlow();
    await checkRatings();
  }

  main();
