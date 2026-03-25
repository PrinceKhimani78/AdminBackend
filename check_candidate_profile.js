
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rojgari_db'
  });

  try {
    const [candidates] = await connection.execute('SELECT email FROM candidate_profiles WHERE email = "rowb7c9q6o@mrotzis.com"');
    console.log('Is in Candidate Profiles:', candidates.length > 0);
  } catch (err) {
    console.error('Error fetching candidates:', err);
  } finally {
    await connection.end();
  }
}

run();
