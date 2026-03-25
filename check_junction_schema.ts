import { sequelize } from './src/config/database';

async function checkSchema() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        const [results]: any[] = await sequelize.query("DESCRIBE recruiter_industries");
        console.log('Columns in recruiter_industries table:');
        results.forEach((col: any) => {
            console.log(`- ${col.Field}: ${col.Type}`);
        });
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkSchema();
