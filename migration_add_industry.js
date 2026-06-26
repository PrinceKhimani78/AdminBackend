const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: console.log,
});

async function migrate() {
  try {
    await sequelize.query("ALTER TABLE candidate_work_experience ADD COLUMN industry VARCHAR(255) DEFAULT NULL;");
    console.log("Migration successful");
  } catch (err) {
    console.log("Error or already exists:", err.message);
  }
  process.exit();
}
migrate();
