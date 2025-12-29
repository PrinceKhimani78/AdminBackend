require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    console.log('\n🔍 Testing XAMPP MySQL connection...\n');
    console.log('Configuration:');
    console.log('  Host:', process.env.DB_HOST || 'localhost');
    console.log('  Port:', process.env.DB_PORT || '3306');
    console.log('  Database:', process.env.DB_NAME || 'rojgari_india');
    console.log('  User:', process.env.DB_USER || 'root');
    console.log('  Password:', process.env.DB_PASSWORD ? '***' : '(empty)');
    console.log('\n');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'rojgari_india',
    });
    
    console.log('✅ Connected to XAMPP MySQL successfully!\n');
    
    // Test query
    const [rows] = await connection.execute('SELECT 1 + 1 AS result, NOW() as server_time');
    console.log('✅ Test query executed successfully');
    console.log('   Result:', rows[0].result);
    console.log('   Server Time:', rows[0].server_time);
    console.log('\n');
    
    // Show database info
    const [dbInfo] = await connection.execute('SELECT DATABASE() as db_name, VERSION() as version');
    console.log('📊 Database Information:');
    console.log('   Current Database:', dbInfo[0].db_name);
    console.log('   MySQL Version:', dbInfo[0].version);
    console.log('\n');
    
    // Show tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Tables in database:', tables.length);
    if (tables.length > 0) {
      tables.forEach((table, index) => {
        const tableName = Object.values(table)[0];
        console.log(`   ${index + 1}. ${tableName}`);
      });
    } else {
      console.log('   (No tables found - run migrations to create tables)');
    }
    console.log('\n');
    
    await connection.end();
    console.log('✅ Connection test completed successfully!\n');
    console.log('Next steps:');
    console.log('  1. Run migrations: npm run migrate');
    console.log('  2. Start server: npm run dev');
    console.log('  3. Test API: curl http://localhost:3000/api/health\n');
    
  } catch (error) {
    console.error('\n❌ Connection failed!\n');
    console.error('Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('  1. Check if XAMPP MySQL is running');
    console.error('  2. Verify .env file exists with correct credentials');
    console.error('  3. Ensure database "rojgari_india" exists');
    console.error('  4. Check if port 3306 is available\n');
    process.exit(1);
  }
}

testConnection();
