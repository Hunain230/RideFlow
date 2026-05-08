const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Direct database configuration
const dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'DIPLOM@t98',
    database: 'RideFlow'
};

async function testConnection() {
    let connection;
    
    try {
        console.log('🔧 Testing database connection...');
        console.log('Config:', { ...dbConfig, password: '***' });
        
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Database connected successfully');
        
        // Test basic query
        const [rows] = await connection.execute('SELECT VERSION() as version');
        console.log(`📊 MySQL Version: ${rows[0].version}`);
        
        // Check if USERS table exists
        const [tables] = await connection.execute("SHOW TABLES LIKE 'USERS'");
        if (tables.length > 0) {
            console.log('✅ USERS table exists');
        } else {
            console.log('❌ USERS table does not exist');
        }
        
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
            console.log('📝 Database connection closed');
        }
    }
}

testConnection().catch(console.error);
