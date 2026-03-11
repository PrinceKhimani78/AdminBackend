const mysql = require('mysql2/promise');

async function run() {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'rojgari_user',
      password: 'RojgariSecure789!',
      database: 'rojgari_db',
      port: 3306
    });

    console.log("Connected to database...");

    const [jobsSchema] = await connection.execute("DESCRIBE jobs;");
    console.log("Jobs Schema:", jobsSchema);

    const [candidatesSchema] = await connection.execute("DESCRIBE candidate_profiles;");
    console.log("Candidate Profiles Schema:", candidatesSchema);

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed:", error);
    process.exit(1);
  }
}

run();
