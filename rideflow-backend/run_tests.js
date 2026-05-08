#!/usr/bin/env node

const { setupTestUsers } = require('./setup_test_users');
const { runAllTests } = require('./test/comprehensive_test');

console.log('🚀 RideFlow Test Suite');
console.log('========================\n');

async function main() {
    try {
        console.log('Step 1: Setting up test users and database...');
        await setupTestUsers();
        
        console.log('\nStep 2: Running comprehensive tests...');
        await runAllTests();
        
        console.log('\n🎉 All tests completed!');
        
    } catch (error) {
        console.error('💥 Test execution failed:', error.message);
        process.exit(1);
    }
}

// Run the test suite
if (require.main === module) {
    main();
}

module.exports = { main };
