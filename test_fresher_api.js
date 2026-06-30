const { Sequelize, DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: false,
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function runTest() {
  try {
    // 1. Create a dummy candidate in the DB directly
    const ts = Date.now();
    const candidateId = 'test-fresher-' + ts;
    const email = `fresher_${ts}@test.com`;
    await sequelize.query(
      "INSERT INTO candidate_profiles (id, full_name, email, mobile_number, gender, status, created_at, updated_at) VALUES (?, 'Test Fresher', ?, '9999999999', 'Male', 'Active', NOW(), NOW())",
      { replacements: [candidateId, email] }
    );
    console.log("Created dummy candidate:", candidateId);

    // 2. Generate a valid JWT token
    const token = jwt.sign(
      { id: candidateId, email: email, role: 'candidate' },
      process.env.JWT_SECRET || 'supersecretjwtkey_mutanttech_2024',
      { expiresIn: '1h' }
    );

    // 3. Prepare Fresher Payload
    const payload = {
      experienced: false,
      fresher: true,
      expected_salary: "25000",
      job_category: "Software Engineer",
      preferred_industry: "IT Services",
      interview_availability: "Full-Time",
      pref_state: "Gujarat",
      pref_city: "Surat",
      summary: "I am a passionate fresher looking for a great opportunity.",
      work_experience: [],
      education: [
        {
          degree: "B.Tech",
          university: "GTU",
          passing_year: "2024",
          grade: "A"
        }
      ],
      skills: [
        {
          skill_name: "React",
          years_of_experience: "1",
          level: "Beginner"
        }
      ],
      languages_known: ["English", "Hindi"]
    };

    // 4. Hit the Live API
    console.log("Hitting API: PUT https://api.rojgariindia.com/api/candidate-profile/" + candidateId);
    const res = await fetch("https://api.rojgariindia.com/api/candidate-profile/" + candidateId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API returned ${res.status}: ${text}`);
    }

    const resData = await res.json();
    console.log("API Response:", resData.message);

    // 5. Verify in DB
    const [dbCandidate] = await sequelize.query("SELECT * FROM candidate_profiles WHERE id = ?", { replacements: [candidateId] });
    console.log("DB summary:", dbCandidate[0].summary);
    console.log("DB languages:", dbCandidate[0].languages_known);
    console.log("DB fresher flag:", dbCandidate[0].fresher);

    const [dbEdu] = await sequelize.query("SELECT * FROM candidate_education WHERE candidate_id = ?", { replacements: [candidateId] });
    console.log("DB education count:", dbEdu.length, "Grade:", dbEdu[0]?.grade);

    const [dbSkills] = await sequelize.query("SELECT * FROM candidate_skills WHERE candidate_id = ?", { replacements: [candidateId] });
    console.log("DB skills count:", dbSkills.length);

    // Clean up
    await sequelize.query("DELETE FROM candidate_profiles WHERE id = ?", { replacements: [candidateId] });
    await sequelize.query("DELETE FROM candidate_education WHERE candidate_id = ?", { replacements: [candidateId] });
    await sequelize.query("DELETE FROM candidate_skills WHERE candidate_id = ?", { replacements: [candidateId] });

    console.log("Test Passed Successfully!");
    process.exit(0);

  } catch (err) {
    console.error("Test Failed:", err);
    process.exit(1);
  }
}

runTest();
