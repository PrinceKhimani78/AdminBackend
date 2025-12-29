import { QueryInterface, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export const up = async (): Promise<void> => {
  const queryInterface: QueryInterface = sequelize.getQueryInterface();

  // Create countries table
  await queryInterface.createTable('countries', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    countryCode: { type: DataTypes.CHAR(2), allowNull: false },
    name: { type: DataTypes.STRING(45), allowNull: false },
  });

  // Create states table
  await queryInterface.createTable('states', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    country_id: { type: DataTypes.INTEGER, allowNull: false },
  });

  // Create cities table
  await queryInterface.createTable('cities', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    state_id: { type: DataTypes.INTEGER, allowNull: false },
  });

  // Create job_functions table
  await queryInterface.createTable('job_functions', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    job_function_name: { type: DataTypes.STRING(255), allowNull: false },
    status: { type: DataTypes.ENUM('Active', 'Inactive'), defaultValue: 'Active' },
  });

  // Create job_skills table
  await queryInterface.createTable('job_skills', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    skill_name: { type: DataTypes.TEXT('long'), allowNull: false },
    status: { type: DataTypes.ENUM('Active', 'Inactive'), defaultValue: 'Active' },
  });

  console.log('✅ Lookup tables created (countries, states, cities, job_functions, job_skills)');
};

export const down = async (): Promise<void> => {
  const queryInterface: QueryInterface = sequelize.getQueryInterface();
  
  await queryInterface.dropTable('job_skills');
  await queryInterface.dropTable('job_functions');
  await queryInterface.dropTable('cities');
  await queryInterface.dropTable('states');
  await queryInterface.dropTable('countries');
  
  console.log('✅ Lookup tables dropped');
};
