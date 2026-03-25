const Recruiter = require('./src/models/recruiter.model').default;
const { sequelize } = require('./src/config/database');
const { Op } = require('sequelize');

async function checkRecruiters() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        const recruiters = await Recruiter.findAll({
            where: {
                [Op.and]: [
                    { pending_industries: { [Op.ne]: null } }
                ]
            }
        });
        console.log(`Found ${recruiters.length} recruiters with pending industries.`);
        recruiters.forEach(r => {
            console.log(`- ID: ${r.id}`);
            console.log(`  Type: ${typeof r.pending_industries}`);
            console.log(`  Value:`, r.pending_industries);
            console.log(`  IsArray: ${Array.isArray(r.pending_industries)}`);
        });
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkRecruiters();
