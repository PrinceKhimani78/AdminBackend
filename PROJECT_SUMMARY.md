# 📊 Rojgari India Backend - Complete Project Summary

## 🎯 Project Overview

**Rojgari India Backend** is a robust Node.js/TypeScript API server designed for a comprehensive job portal platform. It manages candidate profiles, authentication, file uploads, and lookup data with a focus on performance, security, and scalability.

### 🌟 Core Purpose

Provide a reliable backend infrastructure for:

- Candidate registration and profile management
- Secure email-based OTP authentication
- Non-blocking file uploads and streaming downloads
- Location and job category lookup data
- Work experience and skills tracking

---

## 🏗️ Architecture

### Design Pattern: **Modular MVC Architecture**

```
┌─────────────────────────────────────────────────────┐
│                   Client (Frontend)                  │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP Requests
                       ↓
┌─────────────────────────────────────────────────────┐
│              Express.js Server Layer                 │
│  ┌──────────────────────────────────────────────┐  │
│  │         Routes (API Endpoints)                │  │
│  └────────────────┬─────────────────────────────┘  │
│                   ↓                                  │
│  ┌──────────────────────────────────────────────┐  │
│  │    Middleware (Validation, Upload, Auth)     │  │
│  └────────────────┬─────────────────────────────┘  │
│                   ↓                                  │
│  ┌──────────────────────────────────────────────┐  │
│  │         Controllers (Request Handlers)        │  │
│  └────────────────┬─────────────────────────────┘  │
└───────────────────┼──────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│          Services (Business Logic Layer)            │
│  ┌──────────────────────────────────────────────┐  │
│  │    Transaction Management & Validation        │  │
│  └────────────────┬─────────────────────────────┘  │
└───────────────────┼──────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│            Models (Data Access Layer)               │
│  ┌──────────────────────────────────────────────┐  │
│  │         Sequelize ORM Models                  │  │
│  └────────────────┬─────────────────────────────┘  │
└───────────────────┼──────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│                MySQL Database                        │
└─────────────────────────────────────────────────────┘

         ┌──────────────────────────┐
         │   Worker Threads Pool    │
         │  ┌───────────────────┐   │
         │  │ Image Processing  │   │
         │  │ Document Validation│  │
         │  └───────────────────┘   │
         └──────────────────────────┘
```

### Key Architectural Principles

1. **Separation of Concerns**: Clear boundaries between routes, controllers, services, and models
2. **Modular Design**: Each feature is a self-contained module
3. **Non-Blocking I/O**: Worker threads for CPU-intensive operations
4. **Type Safety**: Full TypeScript implementation
5. **Reusability**: Shared utilities and middleware
6. **Error Handling**: Centralized error management

---

## 📁 Detailed Project Structure

```
AdminBackend/
│
├── src/                                    # Source code
│   │
│   ├── server.ts                          # Application entry point
│   │   └── Initializes Express, middleware, routes, database
│   │
│   ├── config/                            # Configuration files
│   │   ├── database.ts                   # Sequelize setup & connection
│   │   └── fileUpload.config.ts          # Upload limits & settings
│   │
│   ├── constants/                         # Application constants
│   │   ├── index.ts                      # General constants
│   │   ├── messages.ts                   # Response messages
│   │   └── candidateProfile.constants.ts # Candidate-specific constants
│   │
│   ├── middleware/                        # Express middlewares
│   │   ├── errorHandler.ts               # Global error handler
│   │   ├── notFoundHandler.ts            # 404 handler
│   │   ├── upload.middleware.ts          # Multer configuration
│   │   ├── multerError.middleware.ts     # File upload errors
│   │   ├── validate.middleware.ts        # Request validation
│   │   ├── fieldTransformer.middleware.ts # Field transformation
│   │   ├── inputValidator.ts             # Input sanitization
│   │   └── virusScanner.ts               # File scanning
│   │
│   ├── models/                            # Sequelize models (shared)
│   │   ├── candidateProfile.model.ts     # Main candidate table
│   │   ├── workExperience.model.ts       # Work experience table
│   │   ├── candidateSkill.model.ts       # Skills table
│   │   ├── country.model.ts              # Countries lookup
│   │   ├── state.model.ts                # States lookup
│   │   ├── city.model.ts                 # Cities lookup
│   │   ├── jobFunction.model.ts          # Job functions lookup
│   │   └── jobSkill.model.ts             # Job skills lookup
│   │
│   ├── modules/                           # Feature modules
│   │   │
│   │   ├── auth/                         # Authentication module
│   │   │   ├── otp.controller.ts        # OTP request handlers
│   │   │   ├── otp.service.ts           # OTP business logic
│   │   │   ├── otp.routes.ts            # OTP endpoints
│   │   │   ├── otp.validator.ts         # OTP validation schemas
│   │   │   └── otp.types.ts             # OTP TypeScript types
│   │   │
│   │   ├── candidate/                    # Candidate module
│   │   │   ├── candidateProfile.controller.ts  # HTTP handlers
│   │   │   ├── candidateProfile.service.ts     # Business logic
│   │   │   ├── candidateProfile.routes.ts      # Route definitions
│   │   │   ├── candidateProfile.validator.ts   # Validation schemas
│   │   │   ├── candidateTypes.ts              # TypeScript types
│   │   │   └── workExperience.types.ts        # Work exp types
│   │   │
│   │   └── lookup/                       # Lookup data module
│   │       ├── lookup.controller.ts     # Lookup handlers
│   │       ├── lookup.service.ts        # Lookup logic
│   │       ├── lookup.routes.ts         # Lookup endpoints
│   │       └── lookup.types.ts          # Lookup types
│   │
│   ├── routes/                            # Route aggregators
│   │   ├── index.ts                      # Main route combiner
│   │   └── upload.routes.ts              # Upload routes
│   │
│   ├── services/                          # Shared services
│   │   └── (future: email, SMS, notifications)
│   │
│   ├── utils/                             # Utility functions
│   │   ├── serviceHandlerUtil.ts         # Service error wrapper
│   │   ├── responseUtil.ts               # Response formatting
│   │   ├── validationUtil.ts             # Validation helpers
│   │   ├── imageProcessingUtil.ts        # Image worker manager
│   │   └── documentProcessingUtil.ts     # Document worker manager
│   │
│   ├── validators/                        # Validation schemas
│   │   └── (Joi schemas moved to modules)
│   │
│   ├── workers/                           # Worker threads
│   │   ├── imageProcessor.worker.ts      # Image resize/compress
│   │   └── documentProcessor.worker.ts   # Document validation
│   │
│   └── database/                          # Database utilities
│       ├── migrations/                   # Database migrations
│       │   ├── 001_create_users_table.ts
│       │   ├── 002_create_candidates_table.ts
│       │   ├── 003_create_lookup_tables.ts
│       │   └── 004_create_all_rojgar_tables.ts
│       ├── indian-data.ts               # Indian location seed data
│       └── setup-complete.ts            # Database setup script
│
├── uploads/                               # File storage
│   ├── profile_photo/                    # Profile photos by ID
│   └── resume/                           # Resumes by ID
│
├── dist/                                  # Compiled JavaScript
│
├── logs/                                  # Application logs
│
├── Documentation                          # Documentation files
│   ├── README.md                         # Quick start guide
│   ├── PROJECT_SUMMARY.md                # This file
│   ├── API_DOCUMENTATION.md              # API reference
│   └── DEPLOYMENT.md                     # Deployment guide
│
├── Configuration files
│   ├── .env                              # Environment variables (not in git)
│   ├── .env.example                      # Environment template
│   ├── .gitignore                        # Git ignore rules
│   ├── package.json                      # Dependencies & scripts
│   ├── tsconfig.json                     # TypeScript config
│   ├── eslint.config.mjs                 # ESLint config (v9 flat)
│   ├── nodemon.json                      # Nodemon config
│   ├── jsconfig.json                     # JavaScript config
│   ├── ecosystem.config.js               # PM2 config
│   ├── start.sh                          # Production start script
│   └── test-db-connection.js             # Database test script
│
└── Database
    └── rojgar_india.sql                  # Database schema export
```

---

## 🚀 Core Features

### 1. **OTP-Based Authentication**

**Location:** `src/modules/auth/`

#### Features:

- Email-based OTP verification
- 6-digit random code generation
- 10-minute expiry with TTL
- Maximum 5 verification attempts
- In-memory caching (NodeCache)
- Rate limiting per email

#### Flow:

```
1. User requests OTP → Email sent with code
2. User submits OTP → Validation against cache
3. Success → OTP deleted | Failure → Attempt counter incremented
4. Max attempts → Lockout, require new OTP
```

#### Endpoints:

- `POST /api/send-otp` - Generate and send OTP
- `POST /api/verify-otp` - Verify submitted OTP

---

### 2. **Candidate Profile Management**

**Location:** `src/modules/candidate/`

#### Features:

- Full CRUD operations
- Pagination (default 10, max 100 per page)
- Nested data handling (work experience, skills)
- Email uniqueness validation
- Cascade delete (removes related data)
- IP address tracking

#### Data Structure:

```typescript
CandidateProfile {
  // Personal Information
  id, full_name, surname, email, mobile_number
  gender, date_of_birth, address

  // Location
  country, state, city

  // Job Preferences
  position, experienced, fresher
  expected_salary, job_category
  current_location, preferred_shift

  // Availability
  interview_availability
  availability_start, availability_end

  // Files
  profile_photo, resume

  // System
  ip_address, status, created_at, updated_at
}

WorkExperience[] {
  position, company, start_date, end_date
  salary_period, is_current
}

Skills[] {
  skill_name, years_of_experience
}
```

#### Endpoints:

- `GET /api/candidate-profile` - List with pagination
- `GET /api/candidate-profile/:id` - Get single with relations
- `POST /api/candidate-profile` - Create with nested data
- `PUT /api/candidate-profile/:id` - Update profile
- `DELETE /api/candidate-profile/:id` - Delete with cascade

---

### 3. **Advanced File Upload System**

**Location:** `src/middleware/upload.middleware.ts`, `src/workers/`

#### Features:

- **Non-blocking uploads** using worker threads
- Dual file support (profile photo + resume)
- File type validation (MIME + extension)
- Size limits (5MB photos, 10MB resumes)
- Automatic image optimization (Sharp)
- Old file cleanup
- Organized storage by candidate ID

#### Processing:

```
Upload Flow:
1. Multer receives files → Temp storage
2. Validation (type, size, virus scan)
3. Worker thread spawned → Non-blocking
4. Image: Resize to 800x800, 85% quality
5. Move to final location (uploads/{id}/)
6. Update database with file paths
7. Delete old files if replacing
```

#### File Organization:

```
uploads/
├── profile_photo/
│   └── {candidate_id}/
│       └── profile_photo_{id}_{timestamp}.jpg
└── resume/
    └── {candidate_id}/
        └── resume_{id}_{timestamp}.pdf
```

#### Endpoints:

- `POST /api/candidate-profile/:id/upload` - Upload files
- `GET /api/candidate-profile/:id/documents` - Get file metadata
- `GET /api/candidate-profile/:id/download/photo` - Stream photo
- `GET /api/candidate-profile/:id/download/resume` - Stream resume

---

### 4. **Lookup Data APIs**

**Location:** `src/modules/lookup/`

#### Features:

- Country, State, City cascading
- Job functions and skills master data
- Efficient caching
- Filter by parent ID

#### Data Sets:

- **Countries**: 250+ countries
- **States**: Indian states (36) + other countries
- **Cities**: Major Indian cities (100+)
- **Job Functions**: IT, Marketing, Sales, HR, etc.
- **Job Skills**: Technology, management, domain skills

#### Endpoints:

- `GET /api/lookup/countries` - All countries
- `GET /api/lookup/states?country_id=X` - States by country
- `GET /api/lookup/cities?state_id=X` - Cities by state
- `GET /api/lookup/job-functions` - Job categories
- `GET /api/lookup/job-skills` - Available skills

---

## 🛠️ Technology Stack

### Core Technologies

| Category      | Technology | Version | Purpose              |
| ------------- | ---------- | ------- | -------------------- |
| **Runtime**   | Node.js    | ≥18.0.0 | JavaScript runtime   |
| **Language**  | TypeScript | ^5.7.3  | Type-safe JavaScript |
| **Framework** | Express.js | ^5.1.0  | Web framework        |
| **Database**  | MySQL      | 5.7+    | Relational database  |
| **ORM**       | Sequelize  | ^6.37.5 | Database abstraction |

### File Handling

| Package                 | Purpose                         |
| ----------------------- | ------------------------------- |
| **Multer**              | Multipart form-data parsing     |
| **Sharp**               | Image processing & optimization |
| **Worker Threads**      | Non-blocking CPU operations     |
| **fs.createReadStream** | Memory-efficient file streaming |

### Validation & Security

| Package                | Purpose                       |
| ---------------------- | ----------------------------- |
| **Joi**                | Schema validation             |
| **Validator**          | String validation             |
| **CORS**               | Cross-origin resource sharing |
| **Helmet**             | HTTP headers security         |
| **express-rate-limit** | Rate limiting (future)        |

### Development Tools

| Tool                  | Purpose                      |
| --------------------- | ---------------------------- |
| **Nodemon**           | Auto-restart on file changes |
| **ts-node**           | TypeScript execution         |
| **ESLint**            | Code linting                 |
| **TypeScript ESLint** | TypeScript-specific linting  |

### Production Tools

| Tool               | Purpose                      |
| ------------------ | ---------------------------- |
| **PM2**            | Process manager & monitoring |
| **GitHub Actions** | CI/CD automation             |
| **Nginx**          | Reverse proxy (optional)     |

### Utilities

| Package        | Purpose               |
| -------------- | --------------------- |
| **dotenv**     | Environment variables |
| **morgan**     | HTTP request logging  |
| **node-cache** | In-memory caching     |
| **uuid**       | Unique ID generation  |
| **nodemailer** | Email sending         |

---

## 🔄 Request Lifecycle

### Complete Flow Example: Create Candidate with Photo

```
1. Client sends POST request
   ↓
2. Express receives request at /api/candidate-profile/:id/upload
   ↓
3. CORS middleware validates origin
   ↓
4. Body parser middleware parses JSON
   ↓
5. Multer middleware handles file upload
   ├── Validates file types
   ├── Checks file sizes
   └── Stores in temp location
   ↓
6. Route matches and calls controller
   ↓
7. Controller validates candidate ID exists
   ↓
8. Service layer starts transaction
   ├── Spawns worker thread for image processing
   ├── Updates database with file path
   └── Commits transaction
   ↓
9. Worker thread (parallel)
   ├── Reads temp image
   ├── Resizes to 800x800
   ├── Compresses to 85%
   ├── Saves to final location
   └── Deletes temp file
   ↓
10. Response sent to client immediately
    └── Success message + file metadata
    ↓
11. Error handler middleware (if error occurs)
    ├── Rolls back transaction
    ├── Deletes uploaded files
    └── Sends error response
```

---

## 🗄️ Database Design

### Entity Relationship Diagram

```
┌─────────────────────────┐
│   candidate_profiles    │
│─────────────────────────│
│ id (PK)                │
│ full_name              │
│ surname                │
│ email (UNIQUE)         │
│ mobile_number          │
│ ... (26 fields total)  │
└──────────┬──────────────┘
           │
           │ 1:N
           │
    ┌──────┴────────┬─────────────────┐
    │               │                 │
    ↓               ↓                 ↓
┌─────────────┐  ┌──────────────┐  ┌──────────┐
│  work_exp   │  │   skills     │  │  (files) │
│─────────────│  │──────────────│  │──────────│
│ id (PK)     │  │ id (PK)      │  │ photos/  │
│ candidate_id│  │ candidate_id │  │ resumes/ │
│ position    │  │ skill_name   │  └──────────┘
│ company     │  │ years_exp    │
│ start_date  │  └──────────────┘
│ end_date    │
│ is_current  │
└─────────────┘

┌──────────┐      ┌──────────┐      ┌──────────┐
│ countries│ 1:N  │  states  │ 1:N  │  cities  │
│──────────│─────→│──────────│─────→│──────────│
│ id (PK)  │      │ id (PK)  │      │ id (PK)  │
│ name     │      │ name     │      │ name     │
│ code     │      │country_id│      │ state_id │
└──────────┘      └──────────┘      └──────────┘

┌──────────────┐    ┌──────────────┐
│job_functions │    │  job_skills  │
│──────────────│    │──────────────│
│ id (PK)      │    │ id (PK)      │
│ name         │    │ name         │
│ description  │    │ category     │
└──────────────┘    └──────────────┘
```

### Table Details

#### candidate_profiles (26 columns)

- **Primary Key**: `id` (auto-increment)
- **Unique Constraint**: `email`
- **Indexes**: `email`, `mobile_number`, `status`
- **Timestamps**: `created_at`, `updated_at`

#### candidate_work_experience

- **Foreign Key**: `candidate_id` → `candidate_profiles.id` (CASCADE DELETE)
- **Validation**: `end_date` ≥ `start_date` if not current

#### candidate_skills

- **Foreign Key**: `candidate_id` → `candidate_profiles.id` (CASCADE DELETE)
- **Validation**: `years_of_experience` ≥ 0

---

## ⚡ Performance Optimizations

### 1. **Non-Blocking Architecture**

- Worker threads for image processing
- Async/await for all I/O operations
- Streaming for large file downloads

### 2. **Database Optimization**

- Connection pooling (max 5 concurrent)
- Indexed columns for fast queries
- Eager loading for related data
- Transaction management

### 3. **Caching Strategy**

- In-memory cache for OTP (TTL-based)
- HTTP cache headers for static files
- Query result caching (future)

### 4. **File Handling**

- Chunked streaming (64KB chunks)
- Automatic image optimization
- Old file cleanup
- Efficient storage structure

### 5. **Memory Management**

- Stream-based file reading
- Worker threads for CPU tasks
- Garbage collection optimization

---

## 🛡️ Security Features

### Current Implementation

1. **Input Validation**

   - Joi schema validation
   - SQL injection prevention (Sequelize)
   - XSS protection (input sanitization)

2. **File Security**

   - File type validation (MIME + extension)
   - Size limits enforcement
   - Virus scanning ready (ClamAV integration)

3. **Error Handling**

   - Centralized error management
   - No stack traces in production
   - Sanitized error messages

4. **CORS Configuration**
   - Origin validation
   - Allowed methods restriction
   - Credentials handling

### Future Enhancements

- [ ] JWT authentication
- [ ] Rate limiting per IP
- [ ] Request throttling
- [ ] API key authentication
- [ ] Encrypted file storage
- [ ] Audit logging
- [ ] SQL injection testing
- [ ] Penetration testing

---

## 📊 API Statistics

### Total Endpoints: **19**

| Category          | Count |
| ----------------- | ----- |
| Authentication    | 2     |
| Candidate Profile | 9     |
| Lookup Data       | 5     |
| File Operations   | 3     |
| System            | 1     |

### Request Methods Distribution

- **GET**: 10 endpoints
- **POST**: 4 endpoints
- **PUT**: 1 endpoint
- **DELETE**: 1 endpoint

---

## 🧩 Module Breakdown

### Module: `auth`

- **Lines of Code**: ~250
- **Files**: 5
- **Dependencies**: nodemailer, node-cache
- **External APIs**: SMTP server

### Module: `candidate`

- **Lines of Code**: ~800
- **Files**: 6
- **Database Tables**: 3 (profiles, work_exp, skills)
- **File Storage**: 2 directories

### Module: `lookup`

- **Lines of Code**: ~200
- **Files**: 4
- **Database Tables**: 5 (countries, states, cities, job_functions, job_skills)

---

## 🔮 Future Roadmap

### Phase 1: Security & Testing (Q1 2026)

- [ ] JWT authentication implementation
- [ ] Rate limiting middleware
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] API documentation (Swagger/OpenAPI)

### Phase 2: Features (Q2 2026)

- [ ] Admin dashboard
- [ ] Employer module
- [ ] Job posting system
- [ ] Application tracking
- [ ] Email templates

### Phase 3: Scalability (Q3 2026)

- [ ] Redis caching
- [ ] Database replication
- [ ] Load balancing
- [ ] CDN integration
- [ ] Message queue (RabbitMQ)

### Phase 4: Analytics (Q4 2026)

- [ ] User analytics
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)
- [ ] Logging aggregation (ELK stack)
- [ ] Reporting dashboard

---

## 📚 Learning Resources

### For Developers New to This Project

1. **Start with**: `README.md` - Quick setup
2. **Understand**: `PROJECT_SUMMARY.md` - This file (architecture)
3. **Test**: `API_DOCUMENTATION.md` - API examples
4. **Deploy**: `DEPLOYMENT.md` - Production setup

### Code Navigation Tips

- **Need to add a feature?** → Create new module in `src/modules/`
- **Need to change validation?** → Check `{module}.validator.ts`
- **Need to modify database?** → Update models in `src/models/`
- **Need to change messages?** → Edit `src/constants/messages.ts`

---

## 🤝 Contributing Guidelines

### Code Structure Rules

1. Follow the modular pattern (controller → service → model)
2. Use TypeScript strict mode
3. Add JSDoc comments for functions
4. Validate all inputs with Joi
5. Handle errors properly (try-catch)
6. Use constants instead of magic strings

### File Naming Conventions

- Models: `{entity}.model.ts`
- Controllers: `{module}.controller.ts`
- Services: `{module}.service.ts`
- Routes: `{module}.routes.ts`
- Types: `{module}.types.ts`

### Git Workflow

1. Create feature branch from `main`
2. Follow commit message convention
3. Write tests for new features
4. Update documentation
5. Create pull request

---

## 📞 Contact & Support

**Development Team**: Kishan  
**Repository**: [GitHub Link]  
**Issues**: Use GitHub Issues for bug reports  
**Documentation**: This file + API_DOCUMENTATION.md

---

## 📄 License

ISC License - Free to use and modify

---

**Last Updated**: December 29, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
