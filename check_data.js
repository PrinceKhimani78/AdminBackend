const { sequelize } = require('./src/config/database');
const CandidateProfile = require('./src/models/candidateProfile.model').default;
const Recruiter = require('./src/models/recruiter.model').default;
const IndustryModel = require('./src/models/industry.model').default;

async function checkData() {
    try {
        console.log('--- Recruiter Check ---');
        const recruiters = await Recruiter.findAll({
            include: [{
                model: IndustryModel,
                as: 'industries'
            }]
        });
        
        recruiters.forEach(r => {
            console.log(`Recruiter: ${r.email}, Status: ${r.status}`);
            console.log(`Approved Industries: ${r.industries.map(i => i.name).join(', ')}`);
            console.log('---');
        });

        console.log('\n--- Candidate Check ---');
        const candidates = await CandidateProfile.findAll({
            attributes: ['id', 'full_name', 'job_category'],
            limit: 20
        });
        
        candidates.forEach(c => {
            console.log(`Candidate: ${c.full_name}, Category: ${c.job_category}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkData();
