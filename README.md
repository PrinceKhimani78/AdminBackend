# 🚀 Rojgari India - Backend API

Complete Node.js backend system for the Rojgari India job portal, featuring candidate profile management, OTP authentication, file uploads with worker threads, and streaming downloads.

---

## 📚 Documentation

- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete project overview, architecture, tech stack, and features
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Detailed API reference with examples and testing guides
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment instructions for production servers
- **[SERVER_SETUP_GUIDE.md](./SERVER_SETUP_GUIDE.md)** - Step-by-step server setup (Node.js, MySQL, Nginx, SSL) in simple words
- **[GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)** - Setup automatic deployment with GitHub Actions

---

## ⚡ Quick Start

### Prerequisites

- Node.js >= 18.0.0
- MySQL 5.7+ or MariaDB
- npm >= 9.0.0

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd AdminBackend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your database credentials
# Edit .env file with your settings

# Setup database (creates tables and seed data)
npm run setup-db

# Start development server
npm run dev
```

Server will start at `http://localhost:3000`

---

## 🏗️ Project Structure

```
AdminBackend/
├── src/
│   ├── server.ts              # Application entry point
│   ├── config/                # Configuration files
│   ├── constants/             # Application constants
│   ├── middleware/            # Express middlewares
│   ├── models/                # Sequelize database models
│   ├── modules/               # Feature modules
│   │   ├── auth/             # OTP authentication
│   │   ├── candidate/        # Candidate profile management
│   │   └── lookup/           # Lookup data (countries, states, cities)
│   ├── routes/               # Route aggregators
│   ├── utils/                # Utility functions
│   └── workers/              # Worker threads for file processing
├── uploads/                  # File storage (profile photos, resumes)
├── dist/                     # Compiled JavaScript (production)
└── Documentation files
```

---

## 🔑 Key Features

### ✅ Authentication

- **OTP-based email verification** (6-digit code, 10-minute expiry)
- Maximum 5 attempts with automatic lockout
- In-memory caching with TTL

### 👤 Candidate Profile Management

- Full CRUD operations with pagination
- Work experience tracking (multiple entries per candidate)
- Skills management with years of experience
- Location data (country, state, city cascading)
- Job preferences and salary expectations

### 📁 Advanced File Handling

- **Non-blocking uploads** using worker threads
- Profile photos (JPG, PNG, GIF, WEBP) - Max 5MB
- Resumes (PDF, DOC, DOCX) - Max 10MB
- Automatic image optimization (800x800px, 85% quality)
- Streaming downloads for memory efficiency
- Automatic old file cleanup

### 🗂️ Lookup Data APIs

- Countries, states, and cities
- Job functions and skills
- Cascading filters for location selection

### 🛡️ Security & Performance

- Input validation with Joi
- SQL injection prevention (Sequelize ORM)
- File type and size validation
- Worker threads for CPU-intensive tasks
- Database connection pooling
- Error handling middleware

---

## 📋 Available Scripts

```bash
npm run dev          # Start development server (hot reload)
npm run build        # Compile TypeScript to JavaScript
npm start            # Run production build
npm run setup-db     # Setup database (tables + seed data)
npm run lint         # Check code quality
npm run lint:fix     # Fix linting issues
npm run clean        # Remove dist folder
npm run rebuild      # Clean and rebuild
```

---

## 🔌 API Endpoints

### Authentication

- `POST /api/send-otp` - Send OTP to email
- `POST /api/verify-otp` - Verify OTP code

### Candidate Profile

- `GET /api/candidate-profile` - List all profiles (paginated)
- `GET /api/candidate-profile/:id` - Get single profile with relations
- `POST /api/candidate-profile` - Create new profile
- `PUT /api/candidate-profile/:id` - Update profile
- `DELETE /api/candidate-profile/:id` - Delete profile
- `GET /api/candidate-profile/:id/documents` - Get document URLs
- `POST /api/candidate-profile/:id/upload` - Upload files
- `GET /api/candidate-profile/:id/download/photo` - Download photo
- `GET /api/candidate-profile/:id/download/resume` - Download resume

### Lookup Data

- `GET /api/lookup/countries` - Get all countries
- `GET /api/lookup/states?country_id=X` - Get states by country
- `GET /api/lookup/cities?state_id=X` - Get cities by state
- `GET /api/lookup/job-functions` - Get job functions
- `GET /api/lookup/job-skills` - Get job skills

### System

- `GET /api/health` - Health check

**See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed examples and testing instructions.**

---

## 🛠️ Tech Stack

### Core

- **Node.js** - Runtime environment
- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web framework

### Database

- **MySQL** - Relational database
- **Sequelize** - ORM for database operations

### File Handling

- **Multer** - Multipart form data handling
- **Sharp** - Image processing (resize, compress)
- **Worker Threads** - Non-blocking CPU operations

### Validation & Security

- **Joi** - Schema validation
- **Validator** - String validation
- **CORS** - Cross-origin resource sharing

### Development

- **Nodemon** - Auto-restart on changes
- **ESLint** - Code linting
- **ts-node** - TypeScript execution

### Production

- **PM2** - Process manager
- **GitHub Actions** - CI/CD pipeline

---

## 🗄️ Database Schema

### Tables

- `candidate_profiles` - Main candidate information
- `candidate_work_experience` - Work history (1-to-many)
- `candidate_skills` - Skills list (1-to-many)
- `countries` - Country master data
- `states` - State master data
- `cities` - City master data
- `job_functions` - Job function master data
- `job_skills` - Job skills master data

**Relationships:**

- One candidate → Many work experiences
- One candidate → Many skills
- Country → State → City (cascading)

---

## 🌍 Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
BASE_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=admin_rojgari
DB_USER=admin_rojgari
DB_PASSWORD=admin@123
DB_DIALECT=mysql

# JWT (Future Use)
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRES_IN=24h

# Email Configuration (for OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# CORS
CORS_ORIGIN=http://localhost:3000

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE_PHOTO=5242880
MAX_FILE_SIZE_RESUME=10485760
```

---

## 🧪 Testing

### Manual Testing with cURL

```bash
# Health check
curl http://localhost:3000/api/health

# Send OTP
curl -X POST http://localhost:3000/api/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Create profile
curl -X POST http://localhost:3000/api/candidate-profile \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John",
    "surname": "Doe",
    "email": "john@example.com",
    "mobile_number": "9876543210",
    "gender": "Male"
  }'

# Upload files
curl -X POST http://localhost:3000/api/candidate-profile/1/upload \
  -F "profile_photo=@photo.jpg" \
  -F "resume=@resume.pdf"
```

**See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete testing examples.**

---

## 📦 Deployment

### Production Build

```bash
npm run build
npm start
```

### Using PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### GitHub Actions (Automatic)

Push to `main` branch triggers automatic deployment. Configure these secrets:

- `BACKEND_DEPLOY_HOST`
- `BACKEND_DEPLOY_USERNAME`
- `BACKEND_SSH_PRIVATE_KEY`

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.**

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Code Style

- **Linting:** ESLint with TypeScript rules
- **Formatting:** Consistent with project standards
- **Naming:** camelCase for variables/functions, PascalCase for classes/types
- **File naming:** `{entity}.{type}.ts` (e.g., `candidateProfile.service.ts`)

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test database connection
node test-db-connection.js
```

### Port Already in Use

```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### File Upload Issues

```bash
# Check upload directory permissions
ls -la uploads/
chmod -R 755 uploads/
```

---

## 📞 Support

For issues, questions, or contributions, please contact the development team or create an issue in the repository.

---

## 📄 License

ISC

---

## 🎯 Roadmap

- [ ] JWT authentication implementation
- [ ] Rate limiting
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Admin dashboard
- [ ] Email templates
- [ ] Advanced search and filtering
- [ ] Analytics and reporting

---

**Built with ❤️ by the Rojgari India Team**
