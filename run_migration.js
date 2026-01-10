
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize({
    database: process.env.DB_NAME || 'rojgari_db',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: console.log,
});

const migrationCommands = [
    // candidate_profiles updates
    "ALTER TABLE candidate_profiles ADD COLUMN marital_status VARCHAR(50) NULL AFTER gender",
    "ALTER TABLE candidate_profiles ADD COLUMN alternate_mobile_number VARCHAR(20) NULL AFTER mobile_number",
    "ALTER TABLE candidate_profiles ADD COLUMN district VARCHAR(100) NULL AFTER state",
    "ALTER TABLE candidate_profiles ADD COLUMN village VARCHAR(100) NULL AFTER city",
    "ALTER TABLE candidate_profiles ADD COLUMN expected_salary_min INT NULL AFTER expected_salary",
    "ALTER TABLE candidate_profiles ADD COLUMN expected_salary_max INT NULL AFTER expected_salary_min",
    "ALTER TABLE candidate_profiles ADD COLUMN total_experience_years INT NULL AFTER start_date",
    // work_experience updates
    "ALTER TABLE candidate_work_experience ADD COLUMN current_wages DECIMAL(12, 2) NULL AFTER salary_period",
    "ALTER TABLE candidate_work_experience ADD COLUMN current_city VARCHAR(100) NULL AFTER current_wages",
    "ALTER TABLE candidate_work_experience ADD COLUMN current_village VARCHAR(100) NULL AFTER current_city"
];

async function runMigration() {
    console.log('🚀 Starting emergency migration...');

    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database.');

        for (const sql of migrationCommands) {
            try {
                await sequelize.query(sql);
                console.log(`✅ Success: ${sql}`);
            } catch (error) {
                if (error.original && error.original.code === 'ER_DUP_FIELDNAME') {
                    console.log(`⚠️  Skipped (Already exists): ${sql}`);
                } else {
                    console.error(`❌ Failed: ${sql}`, error.message);
                }
            }
        }

        console.log('🏁 Migration finished.');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
    } finally {
        await sequelize.close();
    }
}

runMigration();
