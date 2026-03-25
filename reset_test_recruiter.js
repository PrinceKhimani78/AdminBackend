
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rojgari_db'
  });

  try {
    const [result] = await connection.execute('UPDATE recruiters SET status = "PendingApproval" WHERE email = "rowb7c9q6o@mrotzis.com"');
    console.log('Update Successful:', result.affectedRows > 0);
  } catch (err) {
    console.error('Error updating recruiter:', err);
  } finally {
    await connection.end();
  }
}

run();
