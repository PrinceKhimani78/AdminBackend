
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rojgari_db'
  });

  try {
    const [admins] = await connection.execute('SELECT email FROM admins LIMIT 1');
    console.log('Admin Email:', admins[0]?.email);
  } catch (err) {
    console.error('Error fetching admin:', err);
  } finally {
    await connection.end();
  }
}

run();
