import { sequelize } from './config/database';

const createTables = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const createIndustries = `
      CREATE TABLE IF NOT EXISTS industries (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(150) NOT NULL,
          slug VARCHAR(150) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

        const createCategories = `
      CREATE TABLE IF NOT EXISTS categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          industry_id INT NOT NULL,
          name VARCHAR(150) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (industry_id) REFERENCES industries(id) ON DELETE CASCADE
      );
    `;

        const createJobRoles = `
      CREATE TABLE IF NOT EXISTS job_roles (
          id INT AUTO_INCREMENT PRIMARY KEY,
          category_id INT NOT NULL,
          name VARCHAR(150) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      );
    `;

        await sequelize.query(createIndustries);
        console.log('Industries table created.');

        await sequelize.query(createCategories);
        console.log('Categories table created.');

        await sequelize.query(createJobRoles);
        console.log('Job roles table created.');

        // Seed some initial data for testing
        await sequelize.query(`INSERT IGNORE INTO industries (id, name, slug) VALUES (1, 'Information Technology', 'information-technology')`);
        await sequelize.query(`INSERT IGNORE INTO categories (id, industry_id, name) VALUES (1, 1, 'Software Development')`);
        await sequelize.query(`INSERT IGNORE INTO job_roles (id, category_id, name) VALUES (1, 1, 'Frontend Developer'), (2, 1, 'Backend Developer')`);
        console.log('Seed data inserted.');

        process.exit(0);
    } catch (error) {
        console.error('Error creating tables:', error);
        process.exit(1);
    }
};

createTables();
