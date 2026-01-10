import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import router from './routes';
import { sequelize } from './config/database';

dotenv.config();

const app: Application = express();
// Trust Proxy is required when running behind Nginx. 
// Without this, express-rate-limit will crash because it cannot trust the X-Forwarded-For header.
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;

// Rate limiting to prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
})); // Security headers
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }));

// Enable HTTP request logging only in production
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')); // Production: detailed logs
}

app.use(limiter); // Apply rate limiting
app.use(express.json({ limit: '10mb' })); // Limit JSON body size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (uploaded photos and resumes)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// EMERGENCY DATABASE FIX ROUTE
app.get('/fix-db-schema', async (req, res) => {
  try {
    const queries = [
      "ALTER TABLE candidate_profiles ADD COLUMN marital_status VARCHAR(50) NULL AFTER gender",
      "ALTER TABLE candidate_profiles ADD COLUMN alternate_mobile_number VARCHAR(20) NULL AFTER mobile_number",
      "ALTER TABLE candidate_profiles ADD COLUMN district VARCHAR(100) NULL AFTER state",
      "ALTER TABLE candidate_profiles ADD COLUMN village VARCHAR(100) NULL AFTER city",
      "ALTER TABLE candidate_profiles ADD COLUMN expected_salary_min INT NULL AFTER expected_salary",
      "ALTER TABLE candidate_profiles ADD COLUMN expected_salary_max INT NULL AFTER expected_salary_min",
      "ALTER TABLE candidate_profiles ADD COLUMN total_experience_years INT NULL AFTER expected_salary_max",
      "ALTER TABLE candidate_work_experience ADD COLUMN current_wages DECIMAL(12, 2) NULL AFTER salary_period",
      "ALTER TABLE candidate_work_experience ADD COLUMN current_city VARCHAR(100) NULL AFTER current_wages",
      "ALTER TABLE candidate_work_experience ADD COLUMN current_village VARCHAR(100) NULL AFTER current_city"
    ];

    const results = [];
    for (const sql of queries) {
      try {
        await sequelize.query(sql);
        results.push({ sql, status: 'Success' });
      } catch (error: any) {
        results.push({ sql, status: 'Failed/Skipped', error: error.message });
      }
    }
    res.json({ success: true, results });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api', router);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
