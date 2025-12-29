import { QueryInterface, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export const up = async (): Promise<void> => {
  const queryInterface: QueryInterface = sequelize.getQueryInterface();

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
};

export const down = async (): Promise<void> => {
  const queryInterface: QueryInterface = sequelize.getQueryInterface();
  await queryInterface.dropTable('candidates');
  console.log('✅ Candidates table dropped');
};
