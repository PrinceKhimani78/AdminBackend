import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { DB_MESSAGES } from '../constants';

dotenv.config();

// Create Sequelize instance
export const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'rojgari_db',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Test database connection
export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log(`✅ ${DB_MESSAGES.CONNECTION_SUCCESS}`);
  } catch (error) {
    console.error(`❌ ${DB_MESSAGES.CONNECTION_FAILED}:`, error);
    process.exit(1);
  }
};

export default sequelize;
