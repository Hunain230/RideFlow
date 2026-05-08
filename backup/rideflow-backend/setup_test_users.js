const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Database Configuration
const dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'DIPLOM@t98',
    database: 'rideflow'
};

// Test Users Configuration
const testUsers = [
    {
        email: 'test.admin@rideflow.com',
        password: 'admin123',
        role: 'Admin',
        firstName: 'Test',
        lastName: 'Admin',
        phone: '3001234561'
    },
    {
        email: 'test.rider@rideflow.com',
        password: 'rider123',
        role: 'Rider',
        firstName: 'Test',
        lastName: 'Rider',
        phone: '3001234562'
    },
    {
        email: 'test.driver@rideflow.com',
        password: 'driver123',
        role: 'Driver',
        firstName: 'Test',
        lastName: 'Driver',
        phone: '3001234563',
        licenseNumber: 'DL-TEST-001',
        cnic: '12345-6789012-1'
    }
];

async function setupTestUsers() {
    let connection;
    
    try {
        console.log('🔧 Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Database connected successfully');
        
        // Clean existing test data
        console.log('🧹 Cleaning existing test data...');
        await connection.execute(`
            DELETE FROM RATINGS WHERE RatedBy IN (SELECT UserID FROM USERS WHERE Email LIKE '%@rideflow.com')
        `);
        await connection.execute(`
            DELETE FROM RATINGS WHERE RatedUserID IN (SELECT UserID FROM USERS WHERE Email LIKE '%@rideflow.com')
        `);
        await connection.execute(`
            DELETE FROM RIDE_TIMELINE WHERE RideID IN (SELECT RideID FROM RIDES WHERE CustomerID IN (SELECT UserID FROM USERS WHERE Email LIKE '%@rideflow.com'))
        `);
        await connection.execute(`
            DELETE FROM PAYMENTS WHERE RideID IN (SELECT RideID FROM RIDES WHERE CustomerID IN (SELECT UserID FROM USERS WHERE Email LIKE '%@rideflow.com'))
        `);
        await connection.execute(`
            DELETE FROM RIDES WHERE CustomerID IN (SELECT UserID FROM USERS WHERE Email LIKE '%@rideflow.com')
        `);
        await connection.execute(`
            DELETE FROM DRIVER_DOCUMENTS WHERE DriverID IN (SELECT DriverID FROM DRIVERS WHERE UserID IN (SELECT UserID FROM USERS WHERE Email LIKE '%@rideflow.com'))
        `);
        await connection.execute(`
            DELETE FROM VEHICLES WHERE DriverID IN (SELECT DriverID FROM DRIVERS WHERE UserID IN (SELECT UserID FROM USERS WHERE Email LIKE '%@rideflow.com'))
        `);
        await connection.execute(`
            DELETE FROM DRIVERS WHERE UserID IN (SELECT UserID FROM USERS WHERE Email LIKE '%@rideflow.com')
        `);
        await connection.execute(`
            DELETE FROM USER_PHONES WHERE UserID IN (SELECT UserID FROM USERS WHERE Email LIKE '%@rideflow.com')
        `);
        await connection.execute(`
            DELETE FROM USERS WHERE Email LIKE '%@rideflow.com'
        `);
        console.log('✅ Existing test data cleaned');
        
        // Create test users
        console.log('👥 Creating test users...');
        
        for (const user of testUsers) {
            // Hash password
            const hashedPassword = await bcrypt.hash(user.password, 10);
            console.log(`🔐 Hashed password for ${user.email}`);
            
            // Insert user
            const [userResult] = await connection.execute(`
                INSERT INTO USERS (Email, Password, Role, FirstName, LastName, RegistrationDate)
                VALUES (?, ?, ?, ?, ?, NOW())
            `, [user.email, hashedPassword, user.role, user.firstName, user.lastName]);
            
            const userId = userResult.insertId;
            console.log(`✅ Created user: ${user.email} (ID: ${userId})`);
            
            // Add phone number
            await connection.execute(`
                INSERT INTO USER_PHONES (UserID, PhoneNumber)
                VALUES (?, ?)
            `, [userId, user.phone]);
            
            console.log(`📱 Added phone: ${user.phone}`);
            
            // Create driver record for driver user
            if (user.role === 'Driver') {
                const [driverResult] = await connection.execute(`
                    INSERT INTO DRIVERS (UserID, LicenseNumber, CNIC, VerificationStatus)
                    VALUES (?, ?, ?, 'Unverified')
                `, [userId, user.licenseNumber, user.cnic]);
                
                const driverId = driverResult.insertId;
                console.log(`🚗 Created driver record (ID: ${driverId})`);
                
                // Create a test vehicle for the driver
                const [vehicleResult] = await connection.execute(`
                    INSERT INTO VEHICLES (DriverID, Make, Model, Year, Color, LicensePlate, VehicleType, VerificationStatus)
                    VALUES (?, 'Toyota', 'Corolla', 2022, 'Silver', 'TEST-123', 'Economy', 'Pending')
                `, [driverId]);
                
                const vehicleId = vehicleResult.insertId;
                console.log(`🚙 Created test vehicle (ID: ${vehicleId})`);
            }
        }
        
        console.log('\n🎉 Test users setup completed successfully!');
        console.log('\n📋 Created Users:');
        console.log('├── Admin: test.admin@rideflow.com / admin123');
        console.log('├── Rider: test.rider@rideflow.com / rider123');
        console.log('└── Driver: test.driver@rideflow.com / driver123');
        
        // Verify users were created
        console.log('\n🔍 Verifying created users...');
        const [users] = await connection.execute(`
            SELECT UserID, Email, Role, FirstName, LastName, RegistrationDate
            FROM USERS 
            WHERE Email LIKE '%@rideflow.com'
            ORDER BY Role, Email
        `);
        
        console.log('\n📊 Users in Database:');
        users.forEach(user => {
            console.log(`├── ${user.Role}: ${user.Email} (${user.FirstName} ${user.LastName}) - ID: ${user.UserID}`);
        });
        
        // Show password hashes (for verification)
        console.log('\n🔐 Password Hashes (for verification):');
        const [hashes] = await connection.execute(`
            SELECT Email, Password FROM USERS WHERE Email LIKE '%@rideflow.com'
        `);
        
        hashes.forEach(user => {
            console.log(`├── ${user.Email}: ${user.Password.substring(0, 50)}...`);
        });
        
    } catch (error) {
        console.error('❌ Error setting up test users:', error.message);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n📝 Database connection closed');
        }
    }
}

// Function to verify passwords work correctly
async function verifyPasswords() {
    let connection;
    
    try {
        console.log('\n🔍 Verifying password hashes...');
        connection = await mysql.createConnection(dbConfig);
        
        const [users] = await connection.execute(`
            SELECT Email, Password FROM USERS WHERE Email LIKE '%@rideflow.com'
        `);
        
        for (const user of users) {
            const originalPassword = user.email.replace('test.', '').replace('@rideflow.com', '') + '123';
            const isValid = await bcrypt.compare(originalPassword, user.Password);
            
            if (isValid) {
                console.log(`✅ Password verification passed for ${user.email}`);
            } else {
                console.log(`❌ Password verification failed for ${user.email}`);
            }
        }
        
    } catch (error) {
        console.error('❌ Error verifying passwords:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Main execution
async function main() {
    try {
        await setupTestUsers();
        await verifyPasswords();
        
        console.log('\n🎯 Setup Complete!');
        console.log('You can now run the comprehensive tests with: node test/comprehensive_test.js');
        
    } catch (error) {
        console.error('💥 Setup failed:', error.message);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main();
}

module.exports = {
    setupTestUsers,
    verifyPasswords
};
