const { sequelize } = require('./src/config/database');
const CandidateModel = require('./src/models/candidateProfile.model').default;

async function checkCategories() {
    try {
        const categories = await CandidateModel.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('job_category')), 'job_category']
            ],
            raw: true
        });
        console.log('--- Unique Job Categories in DB ---');
        console.log(categories.map(c => c.job_category).filter(Boolean));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
// checkCategories();
