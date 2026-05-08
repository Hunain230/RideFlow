const axios = require('axios');

// Test driver API endpoints
const driverToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjIyLCJlbWFpbCI6InRlc3QuZHJpdmVyQHJpZGVmbG93LmNvbSIsInJvbGUiOiJEcml2ZXIiLCJpYXQiOjE3NzgyNTYxMTYsImV4cCI6MTc3ODM0MjUxNn0.f602MgfyVThikS4TyPFrIPuikQHOAechstS5CeKRaxk";

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${driverToken}`
  }
});

async function testDriverAPI() {
  try {
    console.log('🔄 Testing Driver API endpoints...\n');

    // Test 1: Get driver profile
    console.log('1. Testing GET /driver/profile');
    try {
      const profile = await api.get('/driver/profile');
      console.log('✅ Profile:', JSON.stringify(profile.data, null, 2));
    } catch (error) {
      console.log('❌ Profile Error:', error.response?.data || error.message);
    }

    // Test 2: Get earnings overview
    console.log('\n2. Testing GET /driver/analytics/earnings/overview');
    try {
      const earnings = await api.get('/driver/analytics/earnings/overview');
      console.log('✅ Earnings Overview:', JSON.stringify(earnings.data, null, 2));
    } catch (error) {
      console.log('❌ Earnings Error:', error.response?.data || error.message);
    }

    // Test 3: Get performance metrics
    console.log('\n3. Testing GET /driver/analytics/performance/metrics');
    try {
      const performance = await api.get('/driver/analytics/performance/metrics');
      console.log('✅ Performance Metrics:', JSON.stringify(performance.data, null, 2));
    } catch (error) {
      console.log('❌ Performance Error:', error.response?.data || error.message);
    }

    // Test 4: Get driver rides
    console.log('\n4. Testing GET /driver/rides');
    try {
      const rides = await api.get('/driver/rides');
      console.log('✅ Driver Rides:', JSON.stringify(rides.data, null, 2));
    } catch (error) {
      console.log('❌ Rides Error:', error.response?.data || error.message);
    }

    // Test 5: Get wallet
    console.log('\n5. Testing GET /driver/wallet');
    try {
      const wallet = await api.get('/driver/wallet');
      console.log('✅ Wallet:', JSON.stringify(wallet.data, null, 2));
    } catch (error) {
      console.log('❌ Wallet Error:', error.response?.data || error.message);
    }

    // Test 6: Get incoming rides
    console.log('\n6. Testing GET /driver/rides/incoming');
    try {
      const incoming = await api.get('/driver/rides/incoming');
      console.log('✅ Incoming Rides:', JSON.stringify(incoming.data, null, 2));
    } catch (error) {
      console.log('❌ Incoming Rides Error:', error.response?.data || error.message);
    }

    // Test 7: Get ratings
    console.log('\n7. Testing GET /driver/ratings');
    try {
      const ratings = await api.get('/driver/ratings');
      console.log('✅ Ratings:', JSON.stringify(ratings.data, null, 2));
    } catch (error) {
      console.log('❌ Ratings Error:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
  }
}

testDriverAPI();
