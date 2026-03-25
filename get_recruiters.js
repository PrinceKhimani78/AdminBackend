
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rojgari_db'
  });

  try {
    const [recruiters] = await connection.execute('SELECT email, status FROM recruiters');
    console.log('Recruiters:', recruiters);
  } catch (err) {
    console.error('Error fetching recruiters:', err);
  } finally {
    await connection.end();
  }
}

run();
