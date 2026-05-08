const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'DIPLOM@t98',
    database: 'RideFlow'
};

async function checkSchema() {
    let connection;
    
    try {
        console.log('🔍 Checking database schema...');
        connection = await mysql.createConnection(dbConfig);
        
        // Get all tables
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('\n📋 Tables in database:');
        tables.forEach(table => {
            console.log(`├── ${Object.values(table)[0]}`);
        });
        
        // Check USERS table structure
        console.log('\n👤 USERS table structure:');
        const [usersColumns] = await connection.execute('DESCRIBE USERS');
        usersColumns.forEach(column => {
            console.log(`├── ${column.Field} (${column.Type})`);
        });
        
        // Check if there are any existing users
        const [users] = await connection.execute('SELECT * FROM USERS LIMIT 5');
        console.log('\n👥 Existing users:');
        if (users.length === 0) {
            console.log('├── No users found');
        } else {
            users.forEach(user => {
                console.log(`├── ${JSON.stringify(user, null, 2)}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error checking schema:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

checkSchema();
