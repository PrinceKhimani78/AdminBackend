const { sequelize } = require('./src/config/database');
const CandidateModel = require('./src/models/candidateProfile.model').default;

async function checkCount() {
    try {
        const count = await CandidateModel.count();
        console.log(`Total Candidates in database: ${count}`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkCount();
