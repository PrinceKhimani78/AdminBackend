import { QueryInterface, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export const up = async (): Promise<void> => {
  const queryInterface: QueryInterface = sequelize.getQueryInterface();

  // Check and create countries table
  const tables = await queryInterface.showAllTables();
  
  if (!tables.includes('countries')) {
    await queryInterface.createTable('countries', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      countryCode: { type: DataTypes.CHAR(2), allowNull: false },
      name: { type: DataTypes.STRING(45), allowNull: false },
    });
    console.log('✅ Countries table created');
  } else {
    console.log('⏭️  Countries table already exists');
  }

  if (!tables.includes('states')) {
    await queryInterface.createTable('states', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(255), allowNull: false },
      country_id: { type: DataTypes.INTEGER, allowNull: false },
    });
    console.log('✅ States table created');
  } else {
    console.log('⏭️  States table already exists');
  }

  if (!tables.includes('cities')) {
    await queryInterface.createTable('cities', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(255), allowNull: false },
      state_id: { type: DataTypes.INTEGER, allowNull: false },
    });
    console.log('✅ Cities table created');
  } else {
    console.log('⏭️  Cities table already exists');
  }

  if (!tables.includes('job_functions')) {
    await queryInterface.createTable('job_functions', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      job_function_name: { type: DataTypes.STRING(255), allowNull: false },
      status: { type: DataTypes.ENUM('Active', 'Inactive'), defaultValue: 'Active' },
    });
    console.log('✅ Job functions table created');
  } else {
    console.log('⏭️  Job functions table already exists');
  }

  if (!tables.includes('job_skills')) {
    await queryInterface.createTable('job_skills', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      skill_name: { type: DataTypes.TEXT('long'), allowNull: false },
      status: { type: DataTypes.ENUM('Active', 'Inactive'), defaultValue: 'Active' },
    });
    console.log('✅ Job skills table created');
  } else {
    console.log('⏭️  Job skills table already exists');
  }

  if (!tables.includes('job_industry')) {
    await queryInterface.createTable('job_industry', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(255), allowNull: false },
      status: { type: DataTypes.ENUM('Active', 'Inactive'), defaultValue: 'Active' },
    });
    console.log('✅ Job industry table created');
  } else {
    console.log('⏭️  Job industry table already exists');
  }

  if (!tables.includes('candidates')) {
    await queryInterface.createTable('candidates', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: false,
      },
      fullname: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      experience_year_month: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      education: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      job_function_area: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      key_skills: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      salary: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      phone_no: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      country: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      state: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      location: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      resume: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        defaultValue: '',
      },
      profile_photo: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        defaultValue: '',
      },
      status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
      },
      date_created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      ref_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      ip_address: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: '',
      },
      email_verfiy_code: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
      },
      email_code_expire: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      email_verified: {
        type: DataTypes.ENUM('Yes', 'No'),
        allowNull: false,
        defaultValue: 'No',
      },
    });
    console.log('✅ Candidates table created');
  } else {
    console.log('⏭️  Candidates table already exists');
  }

  if (!tables.includes('job_posts')) {
    await queryInterface.createTable('job_posts', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      job_title: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
      },
      job_location_country: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      job_location_state: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      job_location: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      min_exp: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      max_exp: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      job_type: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      education: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      min_salary: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      max_salary: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      industry_types: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      job_functions: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      key_skills: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      company_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      contact_email: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      mobile_no: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      whatsapp_no: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      additional_links: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
      },
      date_added: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
    console.log('✅ Job posts table created');
  } else {
    console.log('⏭️  Job posts table already exists');
  }

  if (!tables.includes('contact_inquiry')) {
    await queryInterface.createTable('contact_inquiry', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      fullname: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      phone_no: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
      },
      date_added: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
    console.log('✅ Contact inquiry table created');
  } else {
    console.log('⏭️  Contact inquiry table already exists');
  }

  if (!tables.includes('admin_settings')) {
    await queryInterface.createTable('admin_settings', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    });
    console.log('✅ Admin settings table created');
  } else {
    console.log('⏭️  Admin settings table already exists');
  }

  if (!tables.includes('webpages')) {
    await queryInterface.createTable('webpages', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      page_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      page_content: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
      },
    });
    console.log('✅ Webpages table created');
  } else {
    console.log('⏭️  Webpages table already exists');
  }
};

export const down = async (): Promise<void> => {
  const queryInterface: QueryInterface = sequelize.getQueryInterface();
  
  await queryInterface.dropTable('webpages');
  await queryInterface.dropTable('admin_settings');
  await queryInterface.dropTable('contact_inquiry');
  await queryInterface.dropTable('job_posts');
  await queryInterface.dropTable('candidates');
  await queryInterface.dropTable('job_industry');
  await queryInterface.dropTable('job_skills');
  await queryInterface.dropTable('job_functions');
  await queryInterface.dropTable('cities');
  await queryInterface.dropTable('states');
  await queryInterface.dropTable('countries');
  
  console.log('✅ All tables dropped');
};
