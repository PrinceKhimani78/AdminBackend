const { sequelize } = require('./src/config/database');
const CandidateModel = require('./src/models/candidateProfile.model').default;
const Recruiter = require('./src/models/recruiter.model').default;
const IndustryModel = require('./src/models/industry.model').default;
const { Op } = require('sequelize');

async function debug() {
    try {
        console.log('--- RECRUITERS ---');
        const recruiters = await Recruiter.findAll({
            include: [{
                model: IndustryModel,
                as: 'industries'
            }]
        });
        
        for (const r of recruiters) {
            console.log(`Recruiter: ${r.full_name} (${r.email}) [${r.id}] Status: ${r.status}`);
            const industryNames = r.industries.map(i => i.name);
            console.log(`Approved Industries: ${industryNames.join(', ')}`);
            
            if (industryNames.length > 0) {
                const matcher = {
                    [Op.or]: [
                        { preferred_industry: { [Op.in]: industryNames } },
                        { job_category: { [Op.in]: industryNames } }
                    ]
                };
                const matchingCandidates = await CandidateModel.count({ where: matcher });
                console.log(`Matching Candidates count for this recruiter: ${matchingCandidates}`);
            }
            console.log('---');
        }

        console.log('\n--- ALL CANDIDATES ---');
        const candidates = await CandidateModel.findAll({
            attributes: ['full_name', 'job_category', 'preferred_industry'],
            limit: 20
        });
        candidates.forEach(c => {
            console.log(`Candidate: ${c.full_name}, Job Category: ${c.job_category}, Pref Industry: ${c.preferred_industry}`);
        });

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

debug();
