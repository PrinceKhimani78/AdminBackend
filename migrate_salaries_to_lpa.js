const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: false,
});

async function run() {
  try {
    // 1. Fetch all jobs
    const [jobs] = await sequelize.query(`SELECT id, salary_min, salary_max FROM jobs`);

    console.log(`Found ${jobs.length} jobs to process.`);

    if (jobs.length === 0) {
      console.log('No jobs to process. Exiting.');
      process.exit(0);
    }

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      const id = job.id;
      const salaryMin = parseFloat(job.salary_min);
      const salaryMax = parseFloat(job.salary_max);

      // Check if it's already converted (heuristic: if it's less than 100, it's likely LPA)
      if ((salaryMin && salaryMin < 100) || (salaryMax && salaryMax < 100)) {
        skippedCount++;
        continue;
      }

      const newMin = salaryMin ? (salaryMin * 12) / 100000 : null;
      const newMax = salaryMax ? (salaryMax * 12) / 100000 : null;

      try {
        await sequelize.query(
          "UPDATE jobs SET salary_min = ?, salary_max = ? WHERE id = ?",
          { replacements: [newMin, newMax, id] }
        );
        successCount++;
      } catch (err) {
        console.error(`Failed to process job ${id}:`, err.message);
        errorCount++;
      }
    }

    console.log(`\nFinished! Successfully migrated: ${successCount}, Skipped (already LPA): ${skippedCount}, Failed: ${errorCount}`);
    process.exit(0);
  } catch (error) {
    console.error('Fatal Error:', error);
    process.exit(1);
  }
}

run();
