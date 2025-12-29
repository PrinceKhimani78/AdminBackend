# 🚀 Complete Backend Deployment Checklist - Rojgari India

**From Zero to Production in 21 Steps**

This document provides a complete, step-by-step guide with all configuration variables and settings needed to deploy your backend successfully.

---

## 📋 Pre-Deployment Checklist

Before you start, ensure you have:

- [ ] A server (VPS/Cloud) with Ubuntu 20.04 or 22.04
- [ ] Root or sudo access to the server
- [ ] Your domain name pointed to server IP (e.g., api.rojgariindia.com)
- [ ] GitHub repository access
- [ ] SMTP email credentials (for OTP emails)

---

## 🎯 PART 1: SERVER SETUP (Steps 1-10)

### Step 1: Initial Server Access

```bash
# SSH into your server
ssh root@YOUR_SERVER_IP

# Or if you have a username
ssh username@YOUR_SERVER_IP
```

**Replace:**

- `YOUR_SERVER_IP` → Your actual server IP (e.g., 192.168.1.100)

---

### Step 2: Update Server & Install Basic Tools

```bash
# Update package lists
sudo apt update

# Upgrade all packages
sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git vim nano software-properties-common ufw
```

**What this does:** Prepares server with latest security patches and tools.

---

### Step 3: Install Node.js 20.x

```bash
# Add Node.js repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js and npm
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

---

### Step 4: Install MySQL 8.0

```bash
# Install MySQL Server
sudo apt install -y mysql-server

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure MySQL installation
sudo mysql_secure_installation
```

**Answer these prompts:**

1. Would you like to setup VALIDATE PASSWORD component? → **YES** (or NO if you want simple passwords)
2. Password validation level (0=LOW, 1=MEDIUM, 2=STRONG) → **1** (MEDIUM)
3. New password → **Enter a STRONG password** (save this!)
4. Remove anonymous users? → **YES**
5. Disallow root login remotely? → **YES**
6. Remove test database? → **YES**
7. Reload privilege tables? → **YES**

**IMPORTANT:** Save your MySQL root password securely!

---

### Step 5: Create Database & User

```bash
# Login to MySQL as root
sudo mysql -u root -p
```

**Inside MySQL, run these commands:**

```sql
-- Create the database
CREATE DATABASE admin_rojgari CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create dedicated user
CREATE USER 'admin_rojgari'@'localhost' IDENTIFIED BY 'YourStrongPassword123!';

-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON admin_rojgari.* TO 'admin_rojgari'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Verify database exists
SHOW DATABASES;

-- Exit MySQL
EXIT;
```

**Save these credentials:**

- Database Name: `admin_rojgari`
- Database User: `admin_rojgari`
- Database Password: `YourStrongPassword123!` (change this to your own)

**Test the connection:**

```bash
mysql -u admin_rojgari -p admin_rojgari
# Enter password when prompted
# If successful, you'll see MySQL prompt
EXIT;
```

---

### Step 6: Install PM2 Process Manager

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

**What is PM2?** Keeps your Node.js app running 24/7, auto-restarts on crashes, manages logs.

---

### Step 7: Create Application Directory

```bash
# Create directory for your application
sudo mkdir -p /home/api.rojgariindia.com/app

# Change ownership to your user
sudo chown -R $USER:$USER /home/api.rojgariindia.com/app

# Navigate to directory
cd /home/api.rojgariindia.com/app
```

**Path Reference:** Your app will be at `/home/api.rojgariindia.com/app`

---

### Step 8: Clone Your Repository

**Option A: Using SSH (Recommended)**

```bash
# First, set up SSH key on server
ssh-keygen -t ed25519 -C "your-email@example.com" -f ~/.ssh/github_key -N ""

# Display your public key
cat ~/.ssh/github_key.pub

# Copy this and add to GitHub → Settings → SSH Keys
```

Then clone:

```bash
cd /home/api.rojgariindia.com/app
git clone git@github.com:PrinceKhimani78/AdminBackend.git .
```

**Option B: Using HTTPS**

```bash
cd /home/api.rojgariindia.com/app
git clone https://github.com/PrinceKhimani78/AdminBackend.git .
```

---

### Step 9: Install Application Dependencies

```bash
cd /home/api.rojgariindia.com/app

# Install all npm packages (this may take 2-5 minutes)
npm install

# Verify node_modules folder was created
ls -la | grep node_modules
```

---

### Step 10: Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit with your settings
nano .env
```

**CRITICAL: Update these variables in .env file:**

```bash
# ====================================
# ENVIRONMENT
# ====================================
NODE_ENV=production                    # MUST be 'production' on server

# ====================================
# SERVER
# ====================================
PORT=3000                              # Your API port
BASE_URL=https://api.rojgariindia.com  # Your domain with https://

# ====================================
# DATABASE (MySQL)
# ====================================
DB_HOST=localhost
DB_PORT=3306
DB_NAME=admin_rojgari                  # Database you created in Step 5
DB_USER=admin_rojgari                  # User you created in Step 5
DB_PASSWORD=YourStrongPassword123!     # Password from Step 5
DB_DIALECT=mysql

# ====================================
# JWT AUTHENTICATION
# ====================================
# Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=PASTE_YOUR_GENERATED_SECRET_HERE
JWT_EXPIRES_IN=24h

# ====================================
# EMAIL (SMTP for OTP)
# ====================================
SMTP_HOST=smtp.gmail.com              # Gmail SMTP
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com        # Your Gmail
SMTP_PASSWORD=your-app-password       # Gmail App Password (NOT regular password)
SMTP_FROM_NAME=Rojgari India
SMTP_FROM_EMAIL=noreply@rojgariindia.com

# ====================================
# SECURITY
# ====================================
CORS_ORIGIN=https://rojgariindia.com,https://www.rojgariindia.com  # Your frontend domains

# ====================================
# FILE UPLOAD
# ====================================
UPLOAD_DIR=uploads
MAX_FILE_SIZE_PHOTO=5242880           # 5MB in bytes
MAX_FILE_SIZE_RESUME=10485760         # 10MB in bytes
```

**IMPORTANT NOTES:**

1. **Generate JWT_SECRET:**

   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

   Copy the output and paste it as JWT_SECRET

2. **Gmail App Password:**

   - Go to: https://myaccount.google.com/apppasswords
   - Create a new app password
   - Use that 16-character password (not your regular Gmail password)

3. **CORS_ORIGIN:**
   - List all your frontend domains separated by commas
   - Include both www and non-www versions if applicable

**Save the file:**

- Press `Ctrl + X`
- Press `Y` for Yes
- Press `Enter`

---

## 🎯 PART 2: DATABASE & BUILD (Steps 11-14)

### Step 11: Setup Database Tables

```bash
cd /home/api.rojgariindia.com/app

# Run database setup script
npm run setup-db
```

**Expected output:**

```
✅ Database connection successful
✅ Created tables: candidate_profiles, candidate_work_experience, candidate_skills
✅ Seeded lookup data: countries, states, cities, job_functions, job_skills
✅ Database setup completed successfully!
```

**What this creates:**

- All database tables with proper schema
- Indian states and cities data
- Job functions and skills master data

---

### Step 12: Build TypeScript Code

```bash
# Compile TypeScript to JavaScript
npm run build

# Verify dist folder was created
ls -la dist/
```

**Expected:** You should see compiled JavaScript files in `dist/` folder

---

### Step 13: Create Required Directories

```bash
cd /home/api.rojgariindia.com/app

# Create upload directories
mkdir -p uploads/profile_photo
mkdir -p uploads/resume
mkdir -p logs

# Set proper permissions
chmod -R 755 uploads
chmod -R 755 logs
```

---

### Step 14: Test Application Locally

```bash
# Start app with Node.js (test mode)
node dist/server.js
```

**You should see:**

```
🚀 Server running on http://localhost:3000
📝 Environment: production
```

**Test health endpoint (from another terminal):**

```bash
curl http://localhost:3000/api/health
```

**Expected response:**

```json
{ "status": "OK", "message": "Server is running" }
```

**Stop the test server:**

- Press `Ctrl + C`

---

## 🎯 PART 3: PM2 & WEB SERVER (Steps 15-17)

### Step 15: Start with PM2

```bash
cd /home/api.rojgariindia.com/app

# Start application with PM2
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs rojgari-backend --lines 20

# Save PM2 process list
pm2 save

# Setup PM2 to start on server boot
pm2 startup
# Copy and run the command PM2 displays
```

**Verify PM2 is running:**

```bash
pm2 status
```

**Expected output:**

```
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┤
│ 0  │ rojgari-backend    │ fork     │ 0    │ online    │ 0%       │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┘
```

---

### Step 16: Install & Configure Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

**Create Nginx configuration:**

```bash
sudo nano /etc/nginx/sites-available/rojgari-api
```

**Paste this configuration:**

```nginx
# Upstream to Node.js backend
upstream nodejs_backend {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name api.rojgariindia.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Client upload size (20MB for file uploads)
    client_max_body_size 20M;

    # Logging
    access_log /var/log/nginx/rojgari-api-access.log;
    error_log /var/log/nginx/rojgari-api-error.log;

    # Proxy to Node.js
    location / {
        proxy_pass http://nodejs_backend;
        proxy_http_version 1.1;

        # Headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Cache bypass
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Replace:** `api.rojgariindia.com` with your actual domain

**Save and enable:**

```bash
# Save file (Ctrl+X, Y, Enter)

# Enable the site
sudo ln -s /etc/nginx/sites-available/rojgari-api /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

### Step 17: Setup SSL Certificate (HTTPS)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.rojgariindia.com

# Follow prompts:
# 1. Enter email: your-email@example.com
# 2. Agree to Terms: Y
# 3. Share email: N (optional)
# 4. Redirect HTTP to HTTPS: 2 (recommended)
```

**Replace:** `api.rojgariindia.com` with your domain

**Test auto-renewal:**

```bash
sudo certbot renew --dry-run
```

**Your API is now available at:** `https://api.rojgariindia.com`

---

## 🎯 PART 4: SECURITY & AUTOMATION (Steps 18-21)

### Step 18: Configure Firewall

```bash
# Allow SSH (IMPORTANT - do this first!)
sudo ufw allow 22/tcp
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

**Expected output:**

```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

---

### Step 19: Setup GitHub Actions (Auto-Deployment)

**A. Generate SSH Key on Server:**

```bash
# Generate key for GitHub Actions
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github_actions_key -N ""

# Add to authorized_keys
cat ~/.ssh/github_actions_key.pub >> ~/.ssh/authorized_keys

# Display private key (you'll need this)
cat ~/.ssh/github_actions_key
```

**Copy the ENTIRE private key output (including BEGIN and END lines)**

**B. Add Secrets to GitHub:**

1. Go to: https://github.com/PrinceKhimani78/AdminBackend/settings/secrets/actions
2. Click "New repository secret"
3. Add these 4 secrets:

**Secret 1: BACKEND_DEPLOY_HOST**

```
Name: BACKEND_DEPLOY_HOST
Value: api.rojgariindia.com
```

(Or your server IP if domain not ready)

**Secret 2: BACKEND_DEPLOY_USERNAME**

```
Name: BACKEND_DEPLOY_USERNAME
Value: ubuntu
```

(Or your server username - check with `whoami` command)

**Secret 3: BACKEND_SSH_PRIVATE_KEY**

```
Name: BACKEND_SSH_PRIVATE_KEY
Value: (Paste the ENTIRE private key from above)
```

**Secret 4: BACKEND_SSH_PORT** (Optional)

```
Name: BACKEND_SSH_PORT
Value: 22
```

**C. Verify Secrets:**

Go to repository → Settings → Secrets and variables → Actions

You should see:

- ✅ BACKEND_DEPLOY_HOST
- ✅ BACKEND_DEPLOY_USERNAME
- ✅ BACKEND_SSH_PRIVATE_KEY
- ✅ BACKEND_SSH_PORT (optional)

---

### Step 20: Setup Automated Backups

**Create backup script:**

```bash
sudo mkdir -p /home/scripts
sudo nano /home/scripts/backup-rojgari.sh
```

**Paste this script:**

```bash
#!/bin/bash

# Configuration
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/backups"
DB_NAME="admin_rojgari"
DB_USER="admin_rojgari"
DB_PASS="YourStrongPassword123!"  # Your database password from Step 5
APP_DIR="/home/api.rojgariindia.com/app"

# Create backup directories
mkdir -p $BACKUP_DIR/database
mkdir -p $BACKUP_DIR/uploads

# Backup database
echo "Backing up database..."
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/database/backup_$DATE.sql.gz

# Backup uploaded files
echo "Backing up uploads..."
tar -czf $BACKUP_DIR/uploads/uploads_$DATE.tar.gz -C $APP_DIR uploads/

# Keep only last 30 days of backups
find $BACKUP_DIR/database -name "backup_*.sql.gz" -mtime +30 -delete
find $BACKUP_DIR/uploads -name "uploads_*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

**Make it executable:**

```bash
sudo chmod +x /home/scripts/backup-rojgari.sh
```

**Test the backup:**

```bash
sudo /home/scripts/backup-rojgari.sh
```

**Schedule daily backups (2 AM):**

```bash
# Open crontab
crontab -e

# Add this line at the end:
0 2 * * * /home/scripts/backup-rojgari.sh >> /home/backups/backup.log 2>&1
```

---

### Step 21: Final Verification & Testing

**A. Check all services:**

```bash
# 1. Check MySQL
sudo systemctl status mysql

# 2. Check Nginx
sudo systemctl status nginx

# 3. Check PM2
pm2 status

# 4. Check application logs
pm2 logs rojgari-backend --lines 20
```

**B. Test API endpoints:**

```bash
# Health check
curl https://api.rojgariindia.com/api/health

# Get countries
curl https://api.rojgariindia.com/api/lookup/countries

# Get states for India (country_id=1)
curl https://api.rojgariindia.com/api/lookup/states?country_id=1
```

**C. Test from browser:**

Open: `https://api.rojgariindia.com/api/health`

**Expected:** JSON response with status "OK"

---

## 📊 CONFIGURATION REFERENCE

### Environment Variables (.env) - Complete List

```bash
# Server
NODE_ENV=production
PORT=3000
BASE_URL=https://api.rojgariindia.com

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=admin_rojgari
DB_USER=admin_rojgari
DB_PASSWORD=YourStrongPassword123!
DB_DIALECT=mysql

# JWT
JWT_SECRET=(Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_EXPIRES_IN=24h

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
SMTP_FROM_NAME=Rojgari India
SMTP_FROM_EMAIL=noreply@rojgariindia.com

# Security
CORS_ORIGIN=https://rojgariindia.com,https://www.rojgariindia.com

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE_PHOTO=5242880
MAX_FILE_SIZE_RESUME=10485760
```

---

### GitHub Actions Secrets

| Secret Name               | Value                                | Where to Find               |
| ------------------------- | ------------------------------------ | --------------------------- |
| `BACKEND_DEPLOY_HOST`     | `api.rojgariindia.com`               | Your domain or server IP    |
| `BACKEND_DEPLOY_USERNAME` | `ubuntu`                             | Run `whoami` on server      |
| `BACKEND_SSH_PRIVATE_KEY` | `-----BEGIN RSA PRIVATE KEY-----...` | Generated in Step 19        |
| `BACKEND_SSH_PORT`        | `22`                                 | Default SSH port (optional) |

---

### Server Paths Reference

```
Application Directory:    /home/api.rojgariindia.com/app/
Source Code:             /home/api.rojgariindia.com/app/src/
Compiled Code:           /home/api.rojgariindia.com/app/dist/
Uploads:                 /home/api.rojgariindia.com/app/uploads/
Logs:                    /home/api.rojgariindia.com/app/logs/
Backups (Database):      /home/backups/database/
Backups (Uploads):       /home/backups/uploads/
Nginx Config:            /etc/nginx/sites-available/rojgari-api
Nginx Logs:              /var/log/nginx/rojgari-api-*.log
SSL Certificates:        /etc/letsencrypt/live/api.rojgariindia.com/
```

---

### Port Reference

| Service     | Port | Access                           |
| ----------- | ---- | -------------------------------- |
| Node.js App | 3000 | Internal only (proxied by Nginx) |
| MySQL       | 3306 | Localhost only                   |
| Nginx HTTP  | 80   | Public (redirects to HTTPS)      |
| Nginx HTTPS | 443  | Public                           |
| SSH         | 22   | Public (firewall protected)      |

---

## 🔧 MAINTENANCE COMMANDS

### Daily Checks

```bash
# Check application status
pm2 status

# View recent logs
pm2 logs rojgari-backend --lines 50

# Check disk space
df -h

# Check memory usage
free -h
```

### Weekly Tasks

```bash
# Update server packages
sudo apt update && sudo apt upgrade -y

# Restart application
pm2 restart rojgari-backend

# Check SSL certificate expiry
sudo certbot certificates

# Review nginx logs
sudo tail -100 /var/log/nginx/rojgari-api-error.log
```

### Deployment Commands

```bash
# Manual deployment (if not using GitHub Actions)
cd /home/api.rojgariindia.com/app
git pull origin main
npm install
npm run build
pm2 restart rojgari-backend

# Or use GitHub Actions - just push to main branch:
git push origin main
# Automatic deployment will start!
```

---

## 🚨 TROUBLESHOOTING

### Application won't start

```bash
# Check logs
pm2 logs rojgari-backend --err

# Check if port is in use
sudo lsof -i :3000

# Restart PM2
pm2 restart rojgari-backend
```

### Database connection failed

```bash
# Test MySQL connection
mysql -u admin_rojgari -p admin_rojgari

# Check MySQL status
sudo systemctl status mysql

# Check .env file has correct credentials
cat .env | grep DB_
```

### SSL certificate issues

```bash
# Check certificate status
sudo certbot certificates

# Renew manually
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

### Nginx not working

```bash
# Test configuration
sudo nginx -t

# Check status
sudo systemctl status nginx

# Restart Nginx
sudo systemctl restart nginx

# View error logs
sudo tail -50 /var/log/nginx/error.log
```

---

## ✅ FINAL CHECKLIST

Before going live, verify:

- [ ] Server is accessible via SSH
- [ ] Node.js 20.x installed
- [ ] MySQL installed and secured
- [ ] Database created with correct credentials
- [ ] Application cloned from GitHub
- [ ] Dependencies installed (`node_modules/` exists)
- [ ] `.env` file configured with production values
- [ ] JWT_SECRET generated and set
- [ ] SMTP credentials configured and tested
- [ ] Database tables created (`npm run setup-db`)
- [ ] Application built (`npm run build`)
- [ ] PM2 running application (status: online)
- [ ] PM2 startup script configured
- [ ] Nginx installed and configured
- [ ] Domain pointing to server IP
- [ ] SSL certificate installed (HTTPS working)
- [ ] Firewall configured (UFW enabled)
- [ ] GitHub Actions secrets added (4 secrets)
- [ ] Automated backups scheduled
- [ ] Health endpoint responding: `https://api.rojgariindia.com/api/health`
- [ ] CORS configured for your frontend domain
- [ ] Test API endpoints working
- [ ] Logs being generated properly

---

## 🎉 SUCCESS!

If all checkboxes are checked, your backend is now:

- ✅ **Running in production** at `https://api.rojgariindia.com`
- ✅ **Secured with HTTPS** (Let's Encrypt SSL)
- ✅ **Auto-restarts** on crashes (PM2)
- ✅ **Auto-deploys** on git push (GitHub Actions)
- ✅ **Auto-backs up** daily at 2 AM
- ✅ **Protected by firewall** (UFW)
- ✅ **Monitored with logs** (PM2 + Nginx)

---

## 📞 Support

**Documentation Files:**

- `README.md` - Quick start guide
- `PROJECT_SUMMARY.md` - Architecture details
- `API_DOCUMENTATION.md` - API endpoints reference
- `SERVER_SETUP_GUIDE.md` - Server setup steps
- `GITHUB_ACTIONS_SETUP.md` - CI/CD setup
- `DEPLOYMENT.md` - Advanced deployment

**Logs Location:**

- Application: `pm2 logs rojgari-backend`
- Nginx: `/var/log/nginx/rojgari-api-*.log`
- Backup: `/home/backups/backup.log`

---

**Document Version:** 1.0  
**Last Updated:** December 29, 2025  
**Status:** Production Ready ✅
