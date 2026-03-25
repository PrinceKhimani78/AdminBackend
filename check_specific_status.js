
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rojgari_db'
  });

  try {
    const [recruiter] = await connection.execute('SELECT email, status FROM recruiters WHERE email = "15e8o@sharebot.net"');
    console.log('Recruiter Status:', recruiter[0]);
  } catch (err) {
    console.error('Error fetching recruiter:', err);
  } finally {
    await connection.end();
  }
}

run();
