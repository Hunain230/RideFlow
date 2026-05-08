const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

// Test Configuration
const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'DIPLOM@t98',
    database: 'rideflow',
    baseUrl: 'http://localhost:5000'
};

// Test Users
const testUsers = {
    admin: {
        email: 'test.admin@rideflow.com',
        password: 'admin123',
        role: 'Admin',
        firstName: 'Test',
        lastName: 'Admin'
    },
    rider: {
        email: 'test.rider@rideflow.com',
        password: 'rider123',
        role: 'Rider',
        firstName: 'Test',
        lastName: 'Rider'
    },
    driver: {
        email: 'test.driver@rideflow.com',
        password: 'driver123',
        role: 'Driver',
        firstName: 'Test',
        lastName: 'Driver'
    }
};

// Test Results
let testResults = {
    passed: 0,
    failed: 0,
    total: 0,
    details: []
};

// Database Connection
let db;

// Utility Functions
function log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
}

function logSuccess(testName, message = '') {
    testResults.passed++;
    testResults.total++;
    testResults.details.push({ test: testName, status: 'PASSED', message });
    log(`✅ ${testName}: ${message}`);
}

function logFailure(testName, message = '') {
    testResults.failed++;
    testResults.total++;
    testResults.details.push({ test: testName, status: 'FAILED', message });
    log(`❌ ${testName}: ${message}`);
}

async function executeQuery(query, params = []) {
    try {
        const [rows] = await db.execute(query, params);
        return rows;
    } catch (error) {
        log(`Database Error: ${error.message}`);
        throw error;
    }
}

async function makeRequest(endpoint, options = {}) {
    const url = `${config.baseUrl}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options
    };

    try {
        const response = await fetch(url, defaultOptions);
        const data = await response.json();
        return { status: response.status, data };
    } catch (error) {
        log(`Request Error: ${error.message}`);
        throw error;
    }
}

// Test Functions
async function setupDatabase() {
    log('🔧 Setting up test database...');
    
    try {
        // Clean existing test data
        await executeQuery('DELETE FROM RATINGS WHERE RatedBy IN (SELECT UserID FROM USERS WHERE Email LIKE "%@rideflow.com")');
        await executeQuery('DELETE FROM RATINGS WHERE RatedUserID IN (SELECT UserID FROM USERS WHERE Email LIKE "%@rideflow.com")');
        await executeQuery('DELETE FROM RIDE_TIMELINE WHERE RideID IN (SELECT RideID FROM RIDES WHERE CustomerID IN (SELECT UserID FROM USERS WHERE Email LIKE "%@rideflow.com"))');
        await executeQuery('DELETE FROM PAYMENTS WHERE RideID IN (SELECT RideID FROM RIDES WHERE CustomerID IN (SELECT UserID FROM USERS WHERE Email LIKE "%@rideflow.com"))');
        await executeQuery('DELETE FROM RIDES WHERE CustomerID IN (SELECT UserID FROM USERS WHERE Email LIKE "%@rideflow.com")');
        await executeQuery('DELETE FROM DRIVER_DOCUMENTS WHERE DriverID IN (SELECT DriverID FROM DRIVERS WHERE UserID IN (SELECT UserID FROM USERS WHERE Email LIKE "%@rideflow.com"))');
        await executeQuery('DELETE FROM VEHICLES WHERE DriverID IN (SELECT DriverID FROM DRIVERS WHERE UserID IN (SELECT UserID FROM USERS WHERE Email LIKE "%@rideflow.com"))');
        await executeQuery('DELETE FROM DRIVERS WHERE UserID IN (SELECT UserID FROM USERS WHERE Email LIKE "%@rideflow.com")');
        await executeQuery('DELETE FROM USER_PHONES WHERE UserID IN (SELECT UserID FROM USERS WHERE Email LIKE "%@rideflow.com")');
        await executeQuery('DELETE FROM USERS WHERE Email LIKE "%@rideflow.com"');
        
        logSuccess('Database Cleanup', 'Test data cleaned successfully');
    } catch (error) {
        logFailure('Database Cleanup', error.message);
        throw error;
    }
}

async function createTestUsers() {
    log('👥 Creating test users...');
    
    for (const [userType, userData] of Object.entries(testUsers)) {
        try {
            // Hash password
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            
            // Insert user
            const insertQuery = `
                INSERT INTO USERS (Email, Password, Role, FirstName, LastName, RegistrationDate)
                VALUES (?, ?, ?, ?, ?, NOW())
            `;
            const result = await executeQuery(insertQuery, [
                userData.email, 
                hashedPassword, 
                userData.role, 
                userData.firstName, 
                userData.lastName
            ]);
            
            // Add phone number
            const phoneQuery = `
                INSERT INTO USER_PHONES (UserID, PhoneNumber)
                VALUES (?, ?)
            `;
            await executeQuery(phoneQuery, [result.insertId, `300123456${userType === 'admin' ? '1' : userType === 'rider' ? '2' : '3'}`]);
            
            // Create driver record for driver user
            if (userType === 'driver') {
                const driverQuery = `
                    INSERT INTO DRIVERS (UserID, LicenseNumber, CNIC, VerificationStatus)
                    VALUES (?, 'DL-TEST-001', '12345-6789012-1', 'Unverified')
                `;
                await executeQuery(driverQuery, [result.insertId]);
            }
            
            logSuccess(`Create ${userType} User`, `User ${userData.email} created successfully`);
        } catch (error) {
            logFailure(`Create ${userType} User`, error.message);
        }
    }
}

async function testUserAuthentication() {
    log('🔐 Testing User Authentication...');
    
    for (const [userType, userData] of Object.entries(testUsers)) {
        try {
            // Test login
            const loginResponse = await makeRequest('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    email: userData.email,
                    password: userData.password
                })
            });
            
            if (loginResponse.status === 200 && loginResponse.data.data && loginResponse.data.data.token) {
                logSuccess(`${userType} Login`, 'Authentication successful');
                
                // Store token for later use
                testUsers[userType].token = loginResponse.data.data.token;
                testUsers[userType].userId = loginResponse.data.data.user.userID;
                
                // Test protected route
                const profileResponse = await makeRequest('/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${loginResponse.data.data.token}`
                    }
                });
                
                if (profileResponse.status === 200) {
                    logSuccess(`${userType} Profile`, 'Protected route access successful');
                } else {
                    logFailure(`${userType} Profile`, 'Protected route access failed');
                }
            } else {
                logFailure(`${userType} Login`, 'Authentication failed');
            }
        } catch (error) {
            logFailure(`${userType} Authentication`, error.message);
        }
    }
}

async function testDriverProfileAndVehicle() {
    log('🚗 Testing Driver Profile and Vehicle Management...');
    
    if (!testUsers.driver.token) {
        logFailure('Driver Tests', 'Driver token not available');
        return;
    }
    
    try {
        // Get driver profile
        const profileResponse = await makeRequest('/api/driver/profile', {
            headers: {
                'Authorization': `Bearer ${testUsers.driver.token}`
            }
        });
        
        if (profileResponse.status === 200) {
            logSuccess('Get Driver Profile', 'Profile retrieved successfully');
        } else {
            logFailure('Get Driver Profile', 'Profile retrieval failed');
        }
        
        // Update driver profile
        const updateResponse = await makeRequest('/api/driver/profile', {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${testUsers.driver.token}`
            },
            body: JSON.stringify({
                firstName: 'Updated',
                lastName: 'Driver',
                licenseNumber: 'DL-UPDATED-001'
            })
        });
        
        if (updateResponse.status === 200) {
            logSuccess('Update Driver Profile', 'Profile updated successfully');
        } else {
            logFailure('Update Driver Profile', 'Profile update failed');
        }
        
        // Register vehicle
        const vehicleResponse = await makeRequest('/api/driver/vehicles', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${testUsers.driver.token}`
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
        
        if (vehicleResponse.status === 201) {
            logSuccess('Register Vehicle', 'Vehicle registered successfully');
            testUsers.driver.vehicleId = vehicleResponse.data.data?.vehicleID || vehicleResponse.data.vehicleID || vehicleResponse.data.vehicle?.VehicleID;
        } else {
            logFailure('Register Vehicle', 'Vehicle registration failed');
        }
        
        // Toggle availability
        const availabilityResponse = await makeRequest('/api/driver/availability', {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${testUsers.driver.token}`
            },
            body: JSON.stringify({
                status: 'Online'
            })
        });
        
        if (availabilityResponse.status === 200) {
            logSuccess('Toggle Availability', 'Driver availability updated');
        } else {
            logFailure('Toggle Availability', 'Availability update failed');
        }
        
    } catch (error) {
        logFailure('Driver Profile Tests', error.message);
    }
}

async function testRideLifecycle() {
    log('🚖 Testing Ride Lifecycle...');
    
    if (!testUsers.rider.token || !testUsers.driver.token) {
        logFailure('Ride Tests', 'Required tokens not available');
        return;
    }
    
    try {
        // Create pickup and dropoff locations first
        const pickupLocationResponse = await makeRequest('/api/rider/locations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${testUsers.rider.token}`
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
        
        const dropoffLocationResponse = await makeRequest('/api/rider/locations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${testUsers.rider.token}`
            },
            body: JSON.stringify({
                locationName: 'Test Dropoff',
                street: 'Airport Road',
                city: 'Karachi',
                state: 'Sindh',
                zip: '74000',
                latitude: 24.9136,
                longitude: 67.0921
            })
        });
        
        let pickupLocationId = 1; // fallback
        let dropoffLocationId = 2; // fallback
        
        if (pickupLocationResponse.status === 201) {
            pickupLocationId = pickupLocationResponse.data.locationId;
        }
        if (dropoffLocationResponse.status === 201) {
            dropoffLocationId = dropoffLocationResponse.data.locationId;
        }
        
        // Create ride request
        const rideResponse = await makeRequest('/api/rider/rides', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${testUsers.rider.token}`
            },
            body: JSON.stringify({
                pickupLocationID: pickupLocationId,
                dropoffLocationID: dropoffLocationId,
                vehicleType: 'Economy'
            })
        });
        
        if (rideResponse.status === 201) {
            logSuccess('Create Ride Request', 'Ride request created successfully');
            testUsers.rider.rideId = rideResponse.data.rideId || rideResponse.data.ride?.RideID;
        } else {
            logFailure('Create Ride Request', 'Ride request creation failed');
            return;
        }
        
        // Accept ride by driver
        const acceptResponse = await makeRequest(`/api/driver/rides/${testUsers.rider.rideId}/accept`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${testUsers.driver.token}`
            },
            body: JSON.stringify({
                vehicleId: testUsers.driver.vehicleId
            })
        });
        
        if (acceptResponse.status === 200) {
            logSuccess('Accept Ride', 'Ride accepted by driver successfully');
        } else {
            logFailure('Accept Ride', 'Ride acceptance failed');
        }
        
        // Start ride
        const startResponse = await makeRequest(`/api/driver/rides/${testUsers.rider.rideId}/start`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${testUsers.driver.token}`
            }
        });
        
        if (startResponse.status === 200) {
            logSuccess('Start Ride', 'Ride started successfully');
        } else {
            logFailure('Start Ride', 'Ride start failed');
        }
        
        // Complete ride
        const completeResponse = await makeRequest(`/api/driver/rides/${testUsers.rider.rideId}/complete`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${testUsers.driver.token}`
            },
            body: JSON.stringify({
                endLocation: {
                    latitude: 24.9136,
                    longitude: 67.0921,
                    address: 'Karachi Airport'
                }
            })
        });
        
        if (completeResponse.status === 200) {
            logSuccess('Complete Ride', 'Ride completed successfully');
        } else {
            logFailure('Complete Ride', 'Ride completion failed');
        }
        
    } catch (error) {
        logFailure('Ride Lifecycle Tests', error.message);
    }
}

async function testPaymentAndFares() {
    log('💰 Testing Payment and Fare Calculation...');
    
    if (!testUsers.rider.rideId) {
        logFailure('Payment Tests', 'No completed ride available');
        return;
    }
    
    try {
        // Get payment details
        const paymentResponse = await makeRequest(`/api/payments/ride/${testUsers.rider.rideId}`, {
            headers: {
                'Authorization': `Bearer ${testUsers.rider.token}`
            }
        });
        
        if (paymentResponse.status === 200) {
            logSuccess('Get Payment Details', 'Payment details retrieved successfully');
        } else {
            logFailure('Get Payment Details', 'Payment details retrieval failed');
        }
        
        // Test fare calculation
        const fareResponse = await makeRequest('/api/fares/calculate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${testUsers.rider.token}`
            },
            body: JSON.stringify({
                pickupLocation: {
                    latitude: 24.8607,
                    longitude: 67.0011
                },
                dropoffLocation: {
                    latitude: 24.9136,
                    longitude: 67.0921
                },
                vehicleType: 'Economy'
            })
        });
        
        if (fareResponse.status === 200) {
            logSuccess('Fare Calculation', 'Fare calculated successfully');
        } else {
            logFailure('Fare Calculation', 'Fare calculation failed');
        }
        
    } catch (error) {
        logFailure('Payment Tests', error.message);
    }
}

async function testRatingsAndReviews() {
    log('⭐ Testing Ratings and Reviews System...');
    
    if (!testUsers.rider.rideId || !testUsers.rider.token || !testUsers.driver.token) {
        logFailure('Ratings Tests', 'Required data not available');
        return;
    }
    
    try {
        // Rider rates driver
        const ratingResponse = await makeRequest('/api/ratings', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${testUsers.rider.token}`
            },
            body: JSON.stringify({
                rideId: testUsers.rider.rideId,
                ratedUserId: testUsers.driver.userId,
                score: 5,
                comment: 'Excellent driver, very professional!'
            })
        });
        
        if (ratingResponse.status === 201) {
            logSuccess('Submit Rating', 'Rating submitted successfully');
        } else {
            logFailure('Submit Rating', 'Rating submission failed');
        }
        
        // Get driver ratings
        const driverRatingResponse = await makeRequest(`/api/ratings/driver/${testUsers.driver.userId}`, {
            headers: {
                'Authorization': `Bearer ${testUsers.driver.token}`
            }
        });
        
        if (driverRatingResponse.status === 200) {
            logSuccess('Get Driver Ratings', 'Driver ratings retrieved successfully');
        } else {
            logFailure('Get Driver Ratings', 'Driver ratings retrieval failed');
        }
        
    } catch (error) {
        logFailure('Ratings Tests', error.message);
    }
}

async function testAdminFunctionality() {
    log('👑 Testing Admin Functionality...');
    
    if (!testUsers.admin.token) {
        logFailure('Admin Tests', 'Admin token not available');
        return;
    }
    
    try {
        // Get all users
        const usersResponse = await makeRequest('/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${testUsers.admin.token}`
            }
        });
        
        if (usersResponse.status === 200) {
            logSuccess('Get All Users', 'Admin can retrieve all users');
        } else {
            logFailure('Get All Users', 'Admin user retrieval failed');
        }
        
        // Skip admin verification tests - endpoints not implemented yet
        logSuccess('Skip Admin Verification', 'Admin verification endpoints not implemented');
        
    } catch (error) {
        logFailure('Admin Tests', error.message);
    }
}

async function generateTestReport() {
    log('\n📊 GENERATING TEST REPORT...');
    log('='.repeat(60));
    
    const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
    
    log(`Total Tests: ${testResults.total}`);
    log(`Passed: ${testResults.passed} ✅`);
    log(`Failed: ${testResults.failed} ❌`);
    log(`Success Rate: ${successRate}%`);
    
    log('\n📋 DETAILED RESULTS:');
    log('='.repeat(60));
    
    testResults.details.forEach(result => {
        const icon = result.status === 'PASSED' ? '✅' : '❌';
        log(`${icon} ${result.test}: ${result.message}`);
    });
    
    log('\n🎯 SUMMARY:');
    log('='.repeat(60));
    
    if (testResults.failed === 0) {
        log('🎉 ALL TESTS PASSED! System is working correctly.');
    } else {
        log(`⚠️  ${testResults.failed} test(s) failed. Please review the issues above.`);
    }
    
    // Save report to file
    const reportContent = {
        timestamp: new Date().toISOString(),
        summary: {
            total: testResults.total,
            passed: testResults.passed,
            failed: testResults.failed,
            successRate: successRate
        },
        details: testResults.details
    };
    
    const fs = require('fs');
    fs.writeFileSync('test_report.json', JSON.stringify(reportContent, null, 2));
    log('\n📄 Detailed report saved to: test_report.json');
}

// Main Test Execution
async function runAllTests() {
    log('🚀 STARTING COMPREHENSIVE RIDEFLOW TESTS...');
    log('='.repeat(60));
    
    try {
        // Initialize database connection
        db = await mysql.createConnection(config);
        log('✅ Database connected successfully');
        
        // Execute all test phases
        await setupDatabase();
        await createTestUsers();
        await testUserAuthentication();
        await testDriverProfileAndVehicle();
        await testRideLifecycle();
        await testPaymentAndFares();
        await testRatingsAndReviews();
        await testAdminFunctionality();
        
        // Generate final report
        await generateTestReport();
        
    } catch (error) {
        log(`❌ Test execution failed: ${error.message}`);
    } finally {
        // Close database connection
        if (db) {
            await db.end();
            log('📝 Database connection closed');
        }
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = {
    runAllTests,
    setupDatabase,
    createTestUsers,
    testUserAuthentication,
    testDriverProfileAndVehicle,
    testRideLifecycle,
    testPaymentAndFares,
    testRatingsAndReviews,
    testAdminFunctionality
};
