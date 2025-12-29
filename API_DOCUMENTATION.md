# 🚀 Rojgari India Backend - API Documentation

Complete API reference with examples for testing.

---

## 🌐 Base URL

```
Development: http://localhost:3000
Production: https://api.rojgariindia.com
```

---

## 📋 Table of Contents

1. [Health Check](#health-check)
2. [Authentication APIs](#authentication-apis)
   - [Send OTP](#1-send-otp)
   - [Verify OTP](#2-verify-otp)
3. [Candidate Profile APIs](#candidate-profile-apis)
   - [List All Profiles](#1-list-all-profiles)
   - [Get Single Profile](#2-get-single-profile)
   - [Create Profile](#3-create-profile)
   - [Update Profile](#4-update-profile)
   - [Delete Profile](#5-delete-profile)
   - [Get Documents Info](#6-get-documents-info)
   - [Upload Files](#7-upload-files)
   - [Download Profile Photo](#8-download-profile-photo)
   - [Download Resume](#9-download-resume)
4. [Lookup APIs](#lookup-apis)
5. [Error Responses](#error-responses)

---

## Authentication APIs

### 1. Send OTP

Send a 6-digit OTP to user's email for verification.

**Endpoint:** `POST /api/send-otp`

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": "Invalid email format"
}
```

**Error Response (500):**

```json
{
  "success": false,
  "error": "Failed to send email"
}
```

**Notes:**

- OTP is valid for 10 minutes
- OTP is stored in memory cache
- Email is sent via SMTP (configure in .env)

---

### 2. Verify OTP

Verify the OTP code entered by the user.

**Endpoint:** `POST /api/verify-otp`

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","otp":"123456"}'
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

**Error Responses:**

Invalid OTP (400):

```json
{
  "success": false,
  "message": "Invalid OTP"
}
```

Expired OTP (400):

```json
{
  "success": false,
  "message": "OTP expired"
}
```

Missing Fields (400):

```json
{
  "success": false,
  "message": "Missing fields"
}
```

Max Attempts Exceeded (400):

```json
{
  "success": false,
  "message": "Maximum verification attempts exceeded. Please request a new OTP"
}
```

**Notes:**

- Maximum 5 verification attempts per email
- OTP is deleted after successful verification
- OTP expires after 10 minutes

---

## Health Check

### GET /api/health

Check if API is running.

**Request:**

```bash
curl http://localhost:3000/api/health
```

**Response:**

```json
{
  "success": true,
  "message": "API is running",
  "data": {
    "status": "healthy",
    "timestamp": "2025-12-14T14:03:50.781Z",
    "version": "1.0.0"
  }
}
```

---

## Candidate Profile APIs

### 1. List All Profiles

Get paginated list of all candidate profiles.

**Endpoint:** `GET /api/candidate-profile`

**Query Parameters:**

- `page` (optional) - Page number, default: 1
- `limit` (optional) - Items per page, default: 10, max: 100

**Request:**

```bash
curl "http://localhost:3000/api/candidate-profile?page=1&limit=5"
```

**Response:**

```json
{
  "success": true,
  "message": "Profiles retrieved successfully",
  "data": {
    "profiles": [
      {
        "id": 7,
        "full_name": "John Doe",
        "surname": "Doe",
        "email": "john.doe@example.com",
        "mobile_number": "9876543210",
        "gender": "Male",
        "date_of_birth": "1995-05-15",
        "address": "123 Main Street",
        "country": "India",
        "state": "Gujarat",
        "city": "Ahmedabad",
        "position": "Software Developer",
        "experienced": true,
        "fresher": false,
        "expected_salary": "800000",
        "job_category": "IT",
        "current_location": "Ahmedabad",
        "interview_availability": "Weekdays",
        "availability_start": "2025-01-15",
        "availability_end": "2025-12-31",
        "preferred_shift": "Day",
        "profile_photo": "7/profile_photo_7_1765483239.jpg",
        "resume": "7/resume_7_1765483239.docx",
        "ip_address": "::1",
        "status": "Active",
        "created_at": "2025-12-11T20:00:02.000Z",
        "updated_at": "2025-12-11T20:00:39.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 5,
      "total": 7,
      "total_pages": 2
    }
  }
}
```

---

### 2. Get Single Profile

Get detailed candidate profile with work experience and skills.

**Endpoint:** `GET /api/candidate-profile/:id`

**Path Parameters:**

- `id` (required) - Candidate ID

**Request:**

```bash
curl http://localhost:3000/api/candidate-profile/7
```

**Response:**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 7,
    "full_name": "John Doe",
    "surname": "Doe",
    "email": "john.doe@example.com",
    "mobile_number": "9876543210",
    "gender": "Male",
    "date_of_birth": "1995-05-15",
    "position": "Software Developer",
    "expected_salary": "800000",
    "profile_photo": "7/profile_photo_7_1765483239.jpg",
    "resume": "7/resume_7_1765483239.docx",
    "status": "Active",
    "work_experience": [
      {
        "id": 15,
        "candidate_id": 7,
        "position": "Senior Developer",
        "company": "Tech Corp",
        "start_date": "2020-01-15",
        "end_date": "2023-12-31",
        "salary_period": "Monthly",
        "is_current": false
      },
      {
        "id": 16,
        "candidate_id": 7,
        "position": "Team Lead",
        "company": "Software Inc",
        "start_date": "2024-01-01",
        "end_date": null,
        "salary_period": "Monthly",
        "is_current": true
      }
    ],
    "skills": [
      {
        "id": 23,
        "candidate_id": 7,
        "skill_name": "JavaScript",
        "years_of_experience": 5
      },
      {
        "id": 24,
        "candidate_id": 7,
        "skill_name": "TypeScript",
        "years_of_experience": 3
      },
      {
        "id": 25,
        "candidate_id": 7,
        "skill_name": "Node.js",
        "years_of_experience": 4
      }
    ]
  }
}
```

---

### 3. Create Profile

Create new candidate profile with optional work experience and skills.

**Endpoint:** `POST /api/candidate-profile`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "full_name": "Jane Smith",
  "surname": "Smith",
  "email": "jane.smith@example.com",
  "mobile_number": "9876543210",
  "gender": "Female",
  "date_of_birth": "1992-03-20",
  "address": "456 Oak Avenue",
  "country": "India",
  "state": "Maharashtra",
  "city": "Mumbai",
  "position": "UI/UX Designer",
  "experienced": true,
  "fresher": false,
  "expected_salary": "600000",
  "job_category": "Design",
  "current_location": "Mumbai",
  "interview_availability": "Flexible",
  "availability_start": "2025-01-01",
  "availability_end": "2025-12-31",
  "preferred_shift": "Day",
  "work_experience": [
    {
      "position": "UI Designer",
      "company": "Design Studio",
      "start_date": "2020-06-01",
      "end_date": "2023-12-31",
      "salary_period": "Monthly",
      "is_current": false
    },
    {
      "position": "Senior Designer",
      "company": "Creative Agency",
      "start_date": "2024-01-01",
      "end_date": null,
      "salary_period": "Monthly",
      "is_current": true
    }
  ],
  "skills": ["Figma", "Adobe XD", "Sketch", "Prototyping"]
}
```

**Request:**

```bash
curl -X POST http://localhost:3000/api/candidate-profile \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Jane Smith",
    "surname": "Smith",
    "email": "jane.smith@example.com",
    "mobile_number": "9876543210",
    "gender": "Female",
    "date_of_birth": "1992-03-20",
    "position": "UI/UX Designer",
    "expected_salary": "600000"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Profile created successfully",
  "data": {
    "id": 8
  }
}
```

**Error Response (Duplicate Email):**

```json
{
  "success": false,
  "message": "Email already exists",
  "status": 409
}
```

---

### 4. Update Profile

Update existing candidate profile.

**Endpoint:** `PUT /api/candidate-profile/:id`

**Path Parameters:**

- `id` (required) - Candidate ID

**Headers:**

```
Content-Type: application/json
```

**Request Body:** (all fields optional)

```json
{
  "full_name": "Jane Smith Updated",
  "position": "Lead UI/UX Designer",
  "expected_salary": "900000",
  "current_location": "Pune"
}
```

**Request:**

```bash
curl -X PUT http://localhost:3000/api/candidate-profile/8 \
  -H "Content-Type: application/json" \
  -d '{
    "position": "Lead UI/UX Designer",
    "expected_salary": "900000"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

---

### 5. Delete Profile

Delete candidate profile (cascade deletes work experience and skills).

**Endpoint:** `DELETE /api/candidate-profile/:id`

**Path Parameters:**

- `id` (required) - Candidate ID

**Request:**

```bash
curl -X DELETE http://localhost:3000/api/candidate-profile/8
```

**Response:**

```json
{
  "success": true,
  "message": "Profile deleted successfully"
}
```

---

### 6. Get Documents Info

Get document metadata (file paths and download URLs).

**Endpoint:** `GET /api/candidate-profile/:id/documents`

**Request:**

```bash
curl http://localhost:3000/api/candidate-profile/7/documents
```

**Response:**

```json
{
  "success": true,
  "message": "Documents retrieved successfully",
  "data": {
    "profile_photo": {
      "path": "7/profile_photo_7_1765483239.jpg",
      "url": "http://localhost:3000/api/candidate-profile/7/download/photo",
      "exists": true
    },
    "resume": {
      "path": "7/resume_7_1765483239.docx",
      "url": "http://localhost:3000/api/candidate-profile/7/download/resume",
      "exists": true
    }
  }
}
```

---

### 7. Upload Files

Upload profile photo and/or resume (non-blocking with worker threads).

**Endpoint:** `POST /api/candidate-profile/:id/upload`

**Path Parameters:**

- `id` (required) - Candidate ID

**Headers:**

```
Content-Type: multipart/form-data
```

**Form Fields:**

- `profile_photo` (optional) - Image file (JPG, PNG, GIF, WEBP) - Max 5MB
- `resume` (optional) - Document file (PDF, DOC, DOCX) - Max 10MB

**Request:**

```bash
# Upload both files
curl -X POST http://localhost:3000/api/candidate-profile/7/upload \
  -F "profile_photo=@/path/to/photo.jpg" \
  -F "resume=@/path/to/resume.pdf"

# Upload only photo
curl -X POST http://localhost:3000/api/candidate-profile/7/upload \
  -F "profile_photo=@/path/to/photo.jpg"

# Upload only resume
curl -X POST http://localhost:3000/api/candidate-profile/7/upload \
  -F "resume=@/path/to/resume.pdf"
```

**Response (Both Files):**

```json
{
  "success": true,
  "message": "Both profile photo and resume uploaded successfully",
  "data": {
    "profile_photo": "7/profile_photo_7_1734183050.jpg",
    "resume": "7/resume_7_1734183050.pdf",
    "processing": {
      "image": "Processing in background (resize to 800x800, 85% quality)",
      "resume": "Uploaded successfully"
    }
  }
}
```

**Response (Photo Only):**

```json
{
  "success": true,
  "message": "Profile photo uploaded successfully",
  "data": {
    "profile_photo": "7/profile_photo_7_1734183050.jpg",
    "processing": {
      "image": "Processing in background"
    }
  }
}
```

**File Upload Limits:**

- Profile Photo: Max 5MB, Types: .jpg, .jpeg, .png, .gif, .webp
- Resume: Max 10MB, Types: .pdf, .doc, .docx
- Processing: Images resized to 800x800px at 85% quality in worker thread
- Old files are automatically deleted

---

### 8. Download Profile Photo

Download profile photo (streaming for memory efficiency).

**Endpoint:** `GET /api/candidate-profile/:id/download/photo`

**Request:**

```bash
curl http://localhost:3000/api/candidate-profile/7/download/photo --output photo.jpg
```

**Response:**

- Content-Type: image/jpeg (or image/png, image/gif based on file)
- Content-Disposition: inline
- Cache-Control: public, max-age=31536000
- File stream with 64KB chunks

---

### 9. Download Resume

Download resume (streaming for memory efficiency).

**Endpoint:** `GET /api/candidate-profile/:id/download/resume`

**Request:**

```bash
curl http://localhost:3000/api/candidate-profile/7/download/resume --output resume.pdf
```

**Response:**

- Content-Type: application/pdf (or application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document)
- Content-Disposition: attachment; filename="resume_7.pdf"
- Cache-Control: no-cache, no-store, must-revalidate
- File stream with 64KB chunks

---

## Lookup APIs

### 1. Get All Countries

**Endpoint:** `GET /api/lookup/countries`

**Request:**

```bash
curl http://localhost:3000/api/lookup/countries
```

**Response:**

```json
{
  "success": true,
  "message": "Countries retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "India",
      "code": "IN"
    },
    {
      "id": 2,
      "name": "United States",
      "code": "US"
    }
  ]
}
```

---

### 2. Get States by Country

**Endpoint:** `GET /api/lookup/states`

**Query Parameters:**

- `country_id` (required) - Country ID

**Request:**

```bash
curl "http://localhost:3000/api/lookup/states?country_id=1"
```

**Response:**

```json
{
  "success": true,
  "message": "States retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Gujarat",
      "country_id": 1
    },
    {
      "id": 2,
      "name": "Maharashtra",
      "country_id": 1
    }
  ]
}
```

---

### 3. Get Cities by State

**Endpoint:** `GET /api/lookup/cities`

**Query Parameters:**

- `state_id` (required) - State ID

**Request:**

```bash
curl "http://localhost:3000/api/lookup/cities?state_id=1"
```

**Response:**

```json
{
  "success": true,
  "message": "Cities retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Ahmedabad",
      "state_id": 1
    },
    {
      "id": 2,
      "name": "Surat",
      "state_id": 1
    }
  ]
}
```

---

## Error Responses

### Standard Error Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "status": 400
}
```

### Common Error Codes

**400 Bad Request**

```json
{
  "success": false,
  "message": "Invalid request data",
  "status": 400
}
```

**404 Not Found**

```json
{
  "success": false,
  "message": "Profile not found",
  "status": 404
}
```

**409 Conflict** (Duplicate Email)

```json
{
  "success": false,
  "message": "Email already exists",
  "status": 409
}
```

**413 Payload Too Large**

```json
{
  "success": false,
  "message": "File too large. Maximum size: 5MB for photos, 10MB for resumes",
  "status": 413
}
```

**415 Unsupported Media Type**

```json
{
  "success": false,
  "message": "Invalid file type. Allowed types for profile photo: jpg, jpeg, png, gif, webp",
  "status": 415
}
```

**500 Internal Server Error**

```json
{
  "success": false,
  "message": "Internal server error",
  "status": 500
}
```

---

## 🧪 Testing Guide

### Using cURL (Command Line)

All examples in this document use cURL. You can copy-paste them directly into your terminal.

**Set base URL for easy testing:**

```bash
export BASE_URL="http://localhost:3000"
```

Then use `$BASE_URL` in commands:

```bash
curl "$BASE_URL/api/health"
```

### Using HTTP Clients

You can also test with:

- **HTTPie**: `http GET localhost:3000/api/health`
- **Insomnia**: Import cURL commands
- **Thunder Client** (VS Code): Import cURL commands
- **Postman**: Import cURL commands or use Postman Collection

### Test Scenarios Checklist

#### ✅ Authentication Flow

1. Send OTP to valid email
2. Verify OTP with correct code
3. Verify OTP with wrong code (should fail)
4. Verify expired OTP (wait 10 minutes)
5. Exceed max attempts (5 tries)

#### ✅ Profile Management

1. Create profile with minimum fields
2. Create profile with all fields + work experience + skills
3. Try duplicate email (should return 409)
4. Get profile list with pagination
5. Get single profile by ID
6. Update profile fields
7. Delete profile

#### ✅ File Operations

1. Upload profile photo only
2. Upload resume only
3. Upload both files together
4. Download profile photo
5. Download resume
6. Get document metadata
7. Replace existing files
8. Try invalid file types (should fail)
9. Try oversized files (should fail)

#### ✅ Lookup Data

1. Get all countries
2. Get states for India (country_id=1)
3. Get cities for Gujarat (state_id=1)
4. Get job functions
5. Get job skills

---

## 🔐 Authentication (Future)

Currently, all endpoints are open. JWT authentication will be added in future versions.

**Planned:**

```
Authorization: Bearer <token>
```

---

## 📊 Rate Limiting (Future)

Rate limiting will be implemented in production:

- 100 requests per 15 minutes per IP
- 10 file uploads per hour per IP

---

## 🚀 Performance Notes

- **Non-Blocking**: File uploads processed in worker threads
- **Streaming**: File downloads use 64KB chunks (memory efficient)
- **Pagination**: Default 10 items per page, max 100
- **Caching**: Profile photos cached for 1 year (immutable URLs recommended)
- **Database**: Sequelize with connection pooling (max 5 connections)

---

## 📞 Support

For issues or questions, contact the development team.

**Next:** Check [TECH_STACK.md](./TECH_STACK.md) to understand which libraries are used for what purpose.
