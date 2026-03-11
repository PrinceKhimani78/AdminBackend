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

    const query = `
      CREATE TABLE IF NOT EXISTS job_applications (
        id CHAR(36) PRIMARY KEY,
        job_id CHAR(36) NOT NULL,
        candidate_id CHAR(36) NOT NULL,
        status ENUM('Applied', 'Shortlisted', 'Interviewed', 'Rejected', 'Selected') NOT NULL DEFAULT 'Applied',
        applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE
      );
    `;

    await connection.execute(query);
    console.log("✅ job_applications table created successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

run();
