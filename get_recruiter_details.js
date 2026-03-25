
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rojgari_db'
  });

  try {
    const [recruiter] = await connection.execute('SELECT * FROM recruiters WHERE email = "rowb7c9q6o@mrotzis.com"');
    console.log('Recruiter Details:', recruiter[0]);
  } catch (err) {
    console.error('Error fetching recruiter:', err);
  } finally {
    await connection.end();
  }
}

run();
