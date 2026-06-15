import { sequelize } from './src/config/database';
import NewsletterModel from './src/models/newsletter.model';

async function syncSchema() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Sync NewsletterModel specifically, it will create the table if it doesn't exist
    await NewsletterModel.sync({ alter: true });
    console.log('Newsletter table has been synced successfully.');

  } catch (error) {
    console.error('Unable to connect to the database or sync schema:', error);
  } finally {
    await sequelize.close();
  }
}

syncSchema();
