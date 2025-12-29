import { sequelize } from '../config/database';
import { QueryInterface } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { INDIAN_STATES_CITIES } from './indian-data';

/**
 * Complete Database Setup with Tables, Indexes, and Seed Data
 * This will drop all tables and recreate them with sample data
 */

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...\n');

    const queryInterface: QueryInterface = sequelize.getQueryInterface();

    // Step 1: Drop all existing tables
    console.log('🗑️  Dropping all existing tables...');
    
    await queryInterface.dropTable('candidate_skills', { cascade: true }).catch(() => {});
    await queryInterface.dropTable('candidate_work_experience', { cascade: true }).catch(() => {});
    await queryInterface.dropTable('candidate_profiles', { cascade: true }).catch(() => {});
    await queryInterface.dropTable('cities', { cascade: true }).catch(() => {});
    await queryInterface.dropTable('states', { cascade: true }).catch(() => {});
    await queryInterface.dropTable('countries', { cascade: true }).catch(() => {});
    
    console.log('✅ All tables dropped successfully\n');

    // Step 2: Create countries table
    console.log('📋 Creating countries table...');
    
    await queryInterface.createTable('countries', {
      id: {
        type: 'CHAR(36)',
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: 'VARCHAR(255)',
        allowNull: false,
        unique: true,
      },
      code: {
        type: 'VARCHAR(10)',
        allowNull: true,
      },
      created_at: {
        type: 'DATETIME',
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: 'DATETIME',
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes for countries
    await queryInterface.addIndex('countries', ['name'], { name: 'idx_country_name' });
    await queryInterface.addIndex('countries', ['code'], { name: 'idx_country_code' });
    
    console.log('✅ Countries table created with indexes\n');

    // Step 3: Create states table
    console.log('📋 Creating states table...');
    
    await queryInterface.createTable('states', {
      id: {
        type: 'CHAR(36)',
        primaryKey: true,
        allowNull: false,
      },
      country_id: {
        type: 'CHAR(36)',
        allowNull: false,
        references: {
          model: 'countries',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      name: {
        type: 'VARCHAR(255)',
        allowNull: false,
      },
      created_at: {
        type: 'DATETIME',
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: 'DATETIME',
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes for states
    await queryInterface.addIndex('states', ['country_id'], { name: 'idx_state_country_id' });
    await queryInterface.addIndex('states', ['name'], { name: 'idx_state_name' });
    await queryInterface.addIndex('states', ['country_id', 'name'], { name: 'idx_state_country_name' });
    
    console.log('✅ States table created with indexes\n');

    // Step 4: Create cities table
    console.log('📋 Creating cities table...');
    
    await queryInterface.createTable('cities', {
      id: {
        type: 'CHAR(36)',
        primaryKey: true,
        allowNull: false,
      },
      state_id: {
        type: 'CHAR(36)',
        allowNull: false,
        references: {
          model: 'states',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      name: {
        type: 'VARCHAR(255)',
        allowNull: false,
      },
      created_at: {
        type: 'DATETIME',
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: 'DATETIME',
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes for cities
    await queryInterface.addIndex('cities', ['state_id'], { name: 'idx_city_state_id' });
    await queryInterface.addIndex('cities', ['name'], { name: 'idx_city_name' });
    await queryInterface.addIndex('cities', ['state_id', 'name'], { name: 'idx_city_state_name' });
    
    console.log('✅ Cities table created with indexes\n');

    // Step 5: Create candidate_profiles table
    console.log('📋 Creating candidate_profiles table...');
    
    await queryInterface.createTable('candidate_profiles', {
      id: {
        type: 'CHAR(36)',
        primaryKey: true,
        allowNull: false,
      },
      full_name: {
        type: 'VARCHAR(255)',
        allowNull: false,
      },
      surname: {
        type: 'VARCHAR(255)',
        allowNull: true,
      },
      email: {
        type: 'VARCHAR(255)',
        allowNull: false,
        unique: true,
      },
      mobile_number: {
        type: 'VARCHAR(20)',
        allowNull: false,
      },
      gender: {
        type: "ENUM('Male', 'Female', 'Other')",
        allowNull: false,
      },
      date_of_birth: {
        type: 'DATE',
        allowNull: true,
      },
      address: {
        type: 'TEXT',
        allowNull: true,
      },
      country: {
        type: 'VARCHAR(100)',
        allowNull: true,
      },
      state: {
        type: 'VARCHAR(100)',
        allowNull: true,
      },
      city: {
        type: 'VARCHAR(100)',
        allowNull: true,
      },
      position: {
        type: 'VARCHAR(255)',
        allowNull: true,
      },
      experienced: {
        type: 'BOOLEAN',
        allowNull: true,
        defaultValue: false,
      },
      fresher: {
        type: 'BOOLEAN',
        allowNull: true,
        defaultValue: false,
      },
      expected_salary: {
        type: 'VARCHAR(50)',
        allowNull: true,
      },
      job_category: {
        type: 'VARCHAR(255)',
        allowNull: true,
      },
      current_location: {
        type: 'VARCHAR(255)',
        allowNull: true,
      },
      interview_availability: {
        type: 'VARCHAR(255)',
        allowNull: true,
      },
      availability_start: {
        type: 'DATE',
        allowNull: true,
      },
      availability_end: {
        type: 'DATE',
        allowNull: true,
      },
      preferred_shift: {
        type: 'VARCHAR(50)',
        allowNull: true,
      },
      profile_photo: {
        type: 'VARCHAR(500)',
        allowNull: true,
      },
      resume: {
        type: 'VARCHAR(500)',
        allowNull: true,
      },
      ip_address: {
        type: 'VARCHAR(50)',
        allowNull: true,
      },
      status: {
        type: "ENUM('Active', 'Inactive')",
        allowNull: false,
        defaultValue: 'Active',
      },
      created_at: {
        type: 'DATETIME',
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: 'DATETIME',
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes for candidate_profiles
    await queryInterface.addIndex('candidate_profiles', ['email'], { 
      name: 'idx_candidate_email',
      unique: true 
    });
    await queryInterface.addIndex('candidate_profiles', ['mobile_number'], { 
      name: 'idx_candidate_mobile' 
    });
    await queryInterface.addIndex('candidate_profiles', ['status'], { 
      name: 'idx_candidate_status' 
    });
    await queryInterface.addIndex('candidate_profiles', ['created_at'], { 
      name: 'idx_candidate_created_at' 
    });
    await queryInterface.addIndex('candidate_profiles', ['country', 'state', 'city'], { 
      name: 'idx_candidate_location' 
    });
    await queryInterface.addIndex('candidate_profiles', ['job_category'], { 
      name: 'idx_candidate_job_category' 
    });
    await queryInterface.addIndex('candidate_profiles', ['position'], { 
      name: 'idx_candidate_position' 
    });
    
    console.log('✅ Candidate profiles table created with indexes\n');

    // Step 6: Create candidate_work_experience table
    console.log('📋 Creating candidate_work_experience table...');
    
    await queryInterface.createTable('candidate_work_experience', {
      id: {
        type: 'CHAR(36)',
        primaryKey: true,
        allowNull: false,
      },
      candidate_id: {
        type: 'CHAR(36)',
        allowNull: false,
        references: {
          model: 'candidate_profiles',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      position: {
        type: 'VARCHAR(255)',
        allowNull: false,
      },
      company: {
        type: 'VARCHAR(255)',
        allowNull: false,
      },
      start_date: {
        type: 'DATE',
        allowNull: false,
      },
      end_date: {
        type: 'DATE',
        allowNull: true,
      },
      salary_period: {
        type: 'VARCHAR(50)',
        allowNull: true,
      },
      is_current: {
        type: 'BOOLEAN',
        allowNull: true,
        defaultValue: false,
      },
      created_at: {
        type: 'DATETIME',
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: 'DATETIME',
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes for work_experience
    await queryInterface.addIndex('candidate_work_experience', ['candidate_id'], { 
      name: 'idx_work_exp_candidate_id' 
    });
    await queryInterface.addIndex('candidate_work_experience', ['is_current'], { 
      name: 'idx_work_exp_is_current' 
    });
    await queryInterface.addIndex('candidate_work_experience', ['start_date'], { 
      name: 'idx_work_exp_start_date' 
    });
    
    console.log('✅ Work experience table created with indexes\n');

    // Step 7: Create candidate_skills table
    console.log('📋 Creating candidate_skills table...');
    
    await queryInterface.createTable('candidate_skills', {
      id: {
        type: 'CHAR(36)',
        primaryKey: true,
        allowNull: false,
      },
      candidate_id: {
        type: 'CHAR(36)',
        allowNull: false,
        references: {
          model: 'candidate_profiles',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      skill_name: {
        type: 'VARCHAR(255)',
        allowNull: false,
      },
      years_of_experience: {
        type: 'INTEGER',
        allowNull: true,
      },
      created_at: {
        type: 'DATETIME',
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: 'DATETIME',
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes for skills
    await queryInterface.addIndex('candidate_skills', ['candidate_id'], { 
      name: 'idx_skill_candidate_id' 
    });
    await queryInterface.addIndex('candidate_skills', ['skill_name'], { 
      name: 'idx_skill_name' 
    });
    
    console.log('✅ Skills table created with indexes\n');

    // Step 8: Insert seed data with UUIDs
    console.log('🌱 Inserting seed data...\n');

    // Generate UUIDs for countries
    const indiaId = uuidv4();
    const usaId = uuidv4();
    const ukId = uuidv4();

    // Insert Countries
    console.log('  → Inserting countries...');
    await queryInterface.bulkInsert('countries', [
      { id: indiaId, name: 'India', code: 'IN', created_at: new Date(), updated_at: new Date() },
      { id: usaId, name: 'United States', code: 'US', created_at: new Date(), updated_at: new Date() },
      { id: ukId, name: 'United Kingdom', code: 'UK', created_at: new Date(), updated_at: new Date() },
    ]);

    // Insert All Indian States and Cities
    console.log('  → Inserting Indian states and cities...');
    console.log(`  → Total: ${INDIAN_STATES_CITIES.length} states/UTs with 600+ cities`);
    
    for (const stateData of INDIAN_STATES_CITIES) {
      const stateId = uuidv4();
      
      // Insert state
      await queryInterface.bulkInsert('states', [
        { 
          id: stateId, 
          country_id: indiaId, 
          name: stateData.state, 
          created_at: new Date(), 
          updated_at: new Date() 
        }
      ]);
      
      // Insert all cities for this state
      const cityRecords = stateData.cities.map(city => ({
        id: uuidv4(),
        state_id: stateId,
        name: city,
        created_at: new Date(),
        updated_at: new Date()
      }));
      
      await queryInterface.bulkInsert('cities', cityRecords);
    }

    // Insert some US and UK states/cities for completeness
    console.log('  → Inserting US and UK states...');
    const californiaId = uuidv4();
    const newYorkId = uuidv4();
    const englandId = uuidv4();

    await queryInterface.bulkInsert('states', [
      { id: californiaId, country_id: usaId, name: 'California', created_at: new Date(), updated_at: new Date() },
      { id: newYorkId, country_id: usaId, name: 'New York', created_at: new Date(), updated_at: new Date() },
      { id: englandId, country_id: ukId, name: 'England', created_at: new Date(), updated_at: new Date() },
    ]);

    await queryInterface.bulkInsert('cities', [
      { id: uuidv4(), state_id: californiaId, name: 'San Francisco', created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), state_id: californiaId, name: 'Los Angeles', created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), state_id: newYorkId, name: 'New York City', created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), state_id: englandId, name: 'London', created_at: new Date(), updated_at: new Date() },
    ]);

    // Generate UUIDs for sample candidates
    const candidate1Id = uuidv4();
    const candidate2Id = uuidv4();
    const candidate3Id = uuidv4();

    // Insert Sample Candidate Profiles
    console.log('  → Inserting candidate profiles...');
    await queryInterface.bulkInsert('candidate_profiles', [
      {
        id: candidate1Id,
        full_name: 'Rahul',
        surname: 'Sharma',
        email: 'rahul.sharma@example.com',
        mobile_number: '9876543210',
        gender: 'Male',
        date_of_birth: '1995-05-15',
        address: '123 MG Road',
        country: 'India',
        state: 'Gujarat',
        city: 'Ahmedabad',
        position: 'Software Developer',
        experienced: true,
        fresher: false,
        expected_salary: '800000',
        job_category: 'IT',
        current_location: 'Ahmedabad',
        interview_availability: 'Weekdays',
        availability_start: '2025-01-15',
        availability_end: '2025-12-31',
        preferred_shift: 'Day',
        status: 'Active',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: candidate2Id,
        full_name: 'Priya',
        surname: 'Patel',
        email: 'priya.patel@example.com',
        mobile_number: '9876543211',
        gender: 'Female',
        date_of_birth: '1997-08-20',
        address: '456 SG Highway',
        country: 'India',
        state: 'Gujarat',
        city: 'Ahmedabad',
        position: 'UI/UX Designer',
        experienced: true,
        fresher: false,
        expected_salary: '600000',
        job_category: 'Design',
        current_location: 'Ahmedabad',
        interview_availability: 'Flexible',
        availability_start: '2025-02-01',
        availability_end: '2025-12-31',
        preferred_shift: 'Day',
        status: 'Active',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: candidate3Id,
        full_name: 'Amit',
        surname: 'Kumar',
        email: 'amit.kumar@example.com',
        mobile_number: '9876543212',
        gender: 'Male',
        date_of_birth: '1999-03-10',
        address: '789 Camp Road',
        country: 'India',
        state: 'Maharashtra',
        city: 'Pune',
        position: 'Data Analyst',
        experienced: false,
        fresher: true,
        expected_salary: '400000',
        job_category: 'Analytics',
        current_location: 'Pune',
        interview_availability: 'Weekends',
        availability_start: '2025-01-01',
        availability_end: '2025-12-31',
        preferred_shift: 'Day',
        status: 'Active',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // Insert Work Experience
    console.log('  → Inserting work experience...');
    await queryInterface.bulkInsert('candidate_work_experience', [
      {
        id: uuidv4(),
        candidate_id: candidate1Id,
        position: 'Junior Developer',
        company: 'Tech Solutions',
        start_date: '2018-06-01',
        end_date: '2020-12-31',
        salary_period: 'Monthly',
        is_current: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        candidate_id: candidate1Id,
        position: 'Senior Developer',
        company: 'Software Inc',
        start_date: '2021-01-01',
        end_date: null,
        salary_period: 'Monthly',
        is_current: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        candidate_id: candidate2Id,
        position: 'UI Designer',
        company: 'Creative Studio',
        start_date: '2019-03-01',
        end_date: '2022-12-31',
        salary_period: 'Monthly',
        is_current: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        candidate_id: candidate2Id,
        position: 'Senior Designer',
        company: 'Design Agency',
        start_date: '2023-01-01',
        end_date: null,
        salary_period: 'Monthly',
        is_current: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // Insert Skills
    console.log('  → Inserting skills...');
    await queryInterface.bulkInsert('candidate_skills', [
      { id: uuidv4(), candidate_id: candidate1Id, skill_name: 'JavaScript', years_of_experience: 5, created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), candidate_id: candidate1Id, skill_name: 'TypeScript', years_of_experience: 3, created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), candidate_id: candidate1Id, skill_name: 'Node.js', years_of_experience: 4, created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), candidate_id: candidate1Id, skill_name: 'React', years_of_experience: 3, created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), candidate_id: candidate2Id, skill_name: 'Figma', years_of_experience: 4, created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), candidate_id: candidate2Id, skill_name: 'Adobe XD', years_of_experience: 3, created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), candidate_id: candidate2Id, skill_name: 'Sketch', years_of_experience: 4, created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), candidate_id: candidate3Id, skill_name: 'Python', years_of_experience: 1, created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), candidate_id: candidate3Id, skill_name: 'SQL', years_of_experience: 1, created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), candidate_id: candidate3Id, skill_name: 'Excel', years_of_experience: 2, created_at: new Date(), updated_at: new Date() },
    ]);

    console.log('\n✅ Seed data inserted successfully\n');

    // Step 9: Verify setup
    console.log('🔍 Verifying database setup...\n');

    const tables = await queryInterface.showAllTables();
    console.log(`✅ Total tables created: ${tables.length}`);
    tables.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table}`);
    });

    console.log('\n📊 Record counts:');
    const [countriesCount] = await sequelize.query('SELECT COUNT(*) as count FROM countries') as any;
    const [statesCount] = await sequelize.query('SELECT COUNT(*) as count FROM states') as any;
    const [citiesCount] = await sequelize.query('SELECT COUNT(*) as count FROM cities') as any;
    const [candidatesCount] = await sequelize.query('SELECT COUNT(*) as count FROM candidate_profiles') as any;
    const [workExpCount] = await sequelize.query('SELECT COUNT(*) as count FROM candidate_work_experience') as any;
    const [skillsCount] = await sequelize.query('SELECT COUNT(*) as count FROM candidate_skills') as any;

    console.log(`   Countries: ${countriesCount[0].count}`);
    console.log(`   States: ${statesCount[0].count}`);
    console.log(`   Cities: ${citiesCount[0].count}`);
    console.log(`   Candidates: ${candidatesCount[0].count}`);
    console.log(`   Work Experience: ${workExpCount[0].count}`);
    console.log(`   Skills: ${skillsCount[0].count}`);

    console.log('\n🎉 Database setup completed successfully!\n');
    console.log('📝 Summary:');
    console.log('   - All tables created with proper structure');
    console.log('   - Indexes added for performance optimization');
    console.log('   - Foreign keys configured with CASCADE');
    console.log('   - Sample data inserted for testing');
    console.log('\n🚀 You can now start the server with: npm run dev\n');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the setup
setupDatabase()
  .then(() => {
    console.log('✅ Setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });
