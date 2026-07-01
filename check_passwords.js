const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: false,
});

async function run() {
  try {
    const [candidateResults] = await sequelize.query(`
      SELECT COUNT(*) as count 
      FROM candidate_profiles 
      WHERE password IS NULL OR password = ''
    `);
    
    const [recruiterResults] = await sequelize.query(`
      SELECT COUNT(*) as count 
      FROM recruiters 
      WHERE password IS NULL OR password = ''
    `);
    
    console.log(`Candidates needing passwords: ${candidateResults[0].count}`);
    console.log(`Recruiters needing passwords: ${recruiterResults[0].count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();
