import { sequelize } from './src/config/database';
import Job from './src/models/job.model';
import Candidate from './src/models/candidateProfile.model';

async function check() {
  try {
    const jobCount = await Job.count();
    const candidateCount = await Candidate.count();
    console.log('--- DATABASE CHECK ---');
    console.log('Job Count:', jobCount);
    console.log('Candidate Count:', candidateCount);
    process.exit(0);
  } catch (err) {
    console.error('ERROR CHECKING DB:', err);
    process.exit(1);
  }
}
check();
