const { sequelize } = require('./src/config/database');

async function checkSchema() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        const [results] = await sequelize.query("DESCRIBE industries");
        console.log('Columns in industries table:');
        results.forEach(col => {
            console.log(`- ${col.Field}: ${col.Type}`);
        });
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkSchema();
