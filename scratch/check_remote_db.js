const mysql = require('mysql2/promise');

async function run() {
  console.log("Connecting to remote database...");
  try {
    const connection = await mysql.createConnection({
      host: '172.96.14.2', // Remote VPS IP
      port: 3306,
      user: 'mutantte_rojgari_db',
      password: 'Hitesh@123',
      database: 'mutantte_rojgari_db'
    });

    console.log("Connection successful!");
    const [rows] = await connection.execute(
      'SELECT DISTINCT preferred_industry FROM candidate_profiles LIMIT 100'
    );
    console.log("Distinct preferred industries in DB:", rows);
    await connection.end();
  } catch (err) {
    console.error("Error:", err.message);
  }
}

run();
