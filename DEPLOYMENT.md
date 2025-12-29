# 🚀 Rojgari India Backend - Deployment Guide

Complete deployment guide for production environments, including automatic GitHub Actions deployment and manual setup.

---

## 📋 Table of Contents

1. [Quick Deploy](#quick-deploy)
2. [Automatic Deployment (GitHub Actions)](#automatic-deployment-github-actions)
3. [Manual Deployment](#manual-deployment)
4. [Server Setup](#server-setup)
5. [PM2 Process Management](#pm2-process-management)
6. [Nginx Configuration](#nginx-configuration)
7. [SSL/TLS Setup](#ssltls-setup)
8. [Environment Variables](#environment-variables)
9. [Monitoring & Logs](#monitoring--logs)
10. [Troubleshooting](#troubleshooting)
11. [Backup & Recovery](#backup--recovery)

---

## ⚡ Quick Deploy

### For GitHub Actions (Recommended)

```bash
git push origin main
```

That's it! Automatic deployment will start.

### For Manual Deploy

```bash
npm run build
pm2 restart ecosystem.config.js
```

---

## 🚀 Automatic Deployment (GitHub Actions)

The backend automatically deploys to production when you push to the `main` branch.

### Prerequisites

Set up the following GitHub Secrets in your repository:

- `BACKEND_DEPLOY_HOST` - Server IP or domain (e.g., api.rojgariindia.com)
- `BACKEND_DEPLOY_USERNAME` - SSH username (e.g., root or ubuntu)
- `BACKEND_SSH_PRIVATE_KEY` - SSH private key for server access

### Deployment Process

1. **Push to main branch**

   ```bash
   git push origin main
   ```

2. **GitHub Actions will automatically:**

   - ✅ Checkout code
   - ✅ Install dependencies
   - ✅ Build TypeScript to JavaScript
   - ✅ Create production bundle
   - ✅ Upload to server
   - ✅ Stop old PM2 process
   - ✅ Deploy new version
   - ✅ Start new PM2 process
   - ✅ Run health check

3. **Monitor deployment:**
   - Go to GitHub Actions tab
   - Watch the deployment workflow

## 📦 Manual Deployment

### First Time Setup on Server

1. **Install Node.js and PM2**

   ```bash
   # Install Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2 globally
   sudo npm install -g pm2
   ```

2. **Create application directory**

   ```bash
   sudo mkdir -p /home/api.rojgariindia.com/app
   cd /home/api.rojgariindia.com/app
   ```

3. **Setup environment variables**

   ```bash
   # Copy .env.example to .env
   cp .env.example .env

   # Edit .env with your production values
   nano .env
   ```

4. **Create required directories**
   ```bash
   mkdir -p uploads/profile_photo
   mkdir -p uploads/resume
   mkdir -p logs
   ```

### Deploy Manually

1. **Build locally**

   ```bash
   npm ci
   npm run build
   ```

2. **Create release package**

   ```bash
   tar -czf release.tar.gz dist node_modules package.json ecosystem.config.js start.sh
   ```

3. **Upload to server**

   ```bash
   scp release.tar.gz user@api.rojgariindia.com:/home/api.rojgariindia.com/app/
   ```

4. **Extract and start on server**
   ```bash
   ssh user@api.rojgariindia.com
   cd /home/api.rojgariindia.com/app
   tar -xzf release.tar.gz
   chmod +x start.sh
   ./start.sh
   ```

## 🔧 PM2 Commands

```bash
# Start application
pm2 start ecosystem.config.js

# Or use the start script
./start.sh

# View status
pm2 status

# View logs
pm2 logs rojgari-backend

# Restart
pm2 restart rojgari-backend

# Stop
pm2 stop rojgari-backend

# Delete
pm2 delete rojgari-backend

# Save PM2 process list
pm2 save

# Setup PM2 startup script
pm2 startup
```

## 🔍 Health Check

```bash
# Check if backend is running
curl http://localhost:3000/health

# Expected response:
# {"status":"ok","timestamp":"2025-12-29T..."}
```

## 📊 Monitoring

```bash
# Monitor all PM2 processes
pm2 monit

# View logs in real-time
pm2 logs rojgari-backend --lines 100

# Check server resources
pm2 list
```

## 🔐 Security Checklist

- [ ] Change JWT_SECRET in .env
- [ ] Update database credentials
- [ ] Configure CORS_ORIGIN to production domain
- [ ] Set up SSL/TLS certificate
- [ ] Configure firewall rules
- [ ] Enable fail2ban
- [ ] Regular backups of database
- [ ] Regular backups of uploads folder

## 🐛 Troubleshooting

### Backend not starting

```bash
# Check PM2 logs
pm2 logs rojgari-backend --err

# Check if port 3000 is in use
sudo lsof -i :3000

# Restart PM2
pm2 restart rojgari-backend
```

### Database connection issues

```bash
# Test MySQL connection
mysql -h localhost -u admin_rojgari -p -D admin_rojgari

# Check .env file
cat .env | grep DB_
```

### File upload issues

```bash
# Check uploads directory permissions
ls -la uploads/
sudo chmod -R 755 uploads/
```

## 📁 Directory Structure

```
/home/api.rojgariindia.com/app/
├── dist/                  # Compiled JavaScript
├── node_modules/          # Dependencies
├── uploads/               # User uploads
│   ├── profile_photo/
│   └── resume/
├── logs/                  # Application logs
├── .env                   # Environment variables
├── ecosystem.config.js    # PM2 configuration
├── start.sh              # Start script
└── package.json          # Dependencies list
```

---

## 🌐 Nginx Configuration (Reverse Proxy)

### Install Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

### Configure Virtual Host

Create configuration file:

```bash
sudo nano /etc/nginx/sites-available/rojgari-backend
```

Add configuration:

```nginx
# Upstream Node.js backend
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

    # Logging
    access_log /var/log/nginx/rojgari-api-access.log;
    error_log /var/log/nginx/rojgari-api-error.log;

    # Client upload size
    client_max_body_size 20M;

    # Proxy to Node.js
    location / {
        proxy_pass http://nodejs_backend;
        proxy_http_version 1.1;

        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        # Headers
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

    # Static file caching (for uploads)
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|pdf|doc|docx)$ {
        proxy_pass http://nodejs_backend;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/rojgari-backend /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🔒 SSL/TLS Setup (HTTPS)

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d api.rojgariindia.com

# Auto-renewal is set up automatically
# Test renewal
sudo certbot renew --dry-run
```

### Manual Certificate Installation

If you have a certificate from a CA:

```bash
# Copy certificates
sudo cp your-cert.crt /etc/ssl/certs/
sudo cp your-key.key /etc/ssl/private/

# Update Nginx config
sudo nano /etc/nginx/sites-available/rojgari-backend
```

Add to Nginx config:

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.rojgariindia.com;

    ssl_certificate /etc/ssl/certs/your-cert.crt;
    ssl_certificate_key /etc/ssl/private/your-key.key;

    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... rest of your config
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name api.rojgariindia.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 🔧 Environment Variables

### Production .env File

Create `/home/api.rojgariindia.com/app/.env`:

```env
# Environment
NODE_ENV=production

# Server
PORT=3000
BASE_URL=https://api.rojgariindia.com

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=admin_rojgari
DB_USER=admin_rojgari
DB_PASSWORD=YOUR_SECURE_PASSWORD_HERE
DB_DIALECT=mysql

# JWT (Change this!)
JWT_SECRET=CHANGE_THIS_TO_RANDOM_256_BIT_STRING
JWT_EXPIRES_IN=24h

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@rojgariindia.com
SMTP_PASSWORD=YOUR_APP_PASSWORD_HERE
SMTP_FROM_NAME=Rojgari India
SMTP_FROM_EMAIL=noreply@rojgariindia.com

# CORS
CORS_ORIGIN=https://rojgariindia.com,https://www.rojgariindia.com

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE_PHOTO=5242880
MAX_FILE_SIZE_RESUME=10485760

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

### Generate Secure JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📊 Monitoring & Logs

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# Process status
pm2 status

# Application metrics
pm2 describe rojgari-backend

# Logs (last 100 lines)
pm2 logs rojgari-backend --lines 100

# Error logs only
pm2 logs rojgari-backend --err

# Clear logs
pm2 flush
```

### Application Logs

```bash
# View recent logs
tail -f /home/api.rojgariindia.com/app/logs/app.log

# Search for errors
grep "ERROR" /home/api.rojgariindia.com/app/logs/app.log

# View logs by date
cat /home/api.rojgariindia.com/app/logs/app.log | grep "2025-12-29"
```

### Nginx Logs

```bash
# Access logs
tail -f /var/log/nginx/rojgari-api-access.log

# Error logs
tail -f /var/log/nginx/rojgari-api-error.log

# Find 500 errors
grep " 500 " /var/log/nginx/rojgari-api-access.log
```

### System Resources

```bash
# CPU and Memory usage
htop

# Disk usage
df -h

# Check specific directory
du -sh /home/api.rojgariindia.com/app/*
```

---

## 🐛 Troubleshooting

### Application Not Starting

```bash
# Check PM2 logs
pm2 logs rojgari-backend --err --lines 50

# Check if port is in use
sudo lsof -i :3000

# Kill process on port 3000
sudo kill -9 $(lsof -ti:3000)

# Restart PM2
pm2 restart rojgari-backend

# Restart from scratch
pm2 delete rojgari-backend
pm2 start ecosystem.config.js
```

### Database Connection Issues

```bash
# Test MySQL connection
mysql -h localhost -u admin_rojgari -p admin_rojgari

# Check MySQL status
sudo systemctl status mysql

# Restart MySQL
sudo systemctl restart mysql

# Check database credentials
cat .env | grep DB_

# Test connection from Node
node -e "const mysql = require('mysql2'); const conn = mysql.createConnection({host:'localhost',user:'admin_rojgari',password:'YOUR_PASSWORD',database:'admin_rojgari'}); conn.connect(err => console.log(err || 'Connected!'));"
```

### File Upload Issues

```bash
# Check directory permissions
ls -la /home/api.rojgariindia.com/app/uploads/

# Fix permissions
sudo chown -R $USER:$USER /home/api.rojgariindia.com/app/uploads/
sudo chmod -R 755 /home/api.rojgariindia.com/app/uploads/

# Check disk space
df -h

# Clear old uploads (manual cleanup)
find uploads/ -type f -mtime +90 -delete
```

### Nginx Issues

```bash
# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Check Nginx status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### High Memory Usage

```bash
# Check memory usage
free -h

# Find memory-heavy processes
ps aux --sort=-%mem | head -n 10

# Restart PM2
pm2 restart rojgari-backend

# Optimize PM2 settings
pm2 start ecosystem.config.js --max-memory-restart 500M
```

### SSL Certificate Issues

```bash
# Check certificate expiry
sudo certbot certificates

# Renew manually
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

---

## 💾 Backup & Recovery

### Database Backup

**Automated Daily Backup:**

Create backup script `/home/scripts/backup-db.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/backups/database"
DB_NAME="admin_rojgari"
DB_USER="admin_rojgari"
DB_PASS="YOUR_PASSWORD"

mkdir -p $BACKUP_DIR

mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

Make executable:

```bash
chmod +x /home/scripts/backup-db.sh
```

Add to crontab (daily at 2 AM):

```bash
crontab -e
# Add line:
0 2 * * * /home/scripts/backup-db.sh
```

**Manual Backup:**

```bash
mysqldump -u admin_rojgari -p admin_rojgari > backup_$(date +%Y%m%d).sql
gzip backup_$(date +%Y%m%d).sql
```

### Database Restore

```bash
# Restore from backup
gunzip -c backup_20251229.sql.gz | mysql -u admin_rojgari -p admin_rojgari
```

### File Uploads Backup

**Automated Daily Backup:**

```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
tar -czf /home/backups/uploads/uploads_$DATE.tar.gz /home/api.rojgariindia.com/app/uploads/
find /home/backups/uploads/ -name "uploads_*.tar.gz" -mtime +30 -delete
```

**Manual Backup:**

```bash
tar -czf uploads_backup.tar.gz /home/api.rojgariindia.com/app/uploads/
```

### Application Backup

```bash
# Full application backup
tar -czf app_backup_$(date +%Y%m%d).tar.gz \
  /home/api.rojgariindia.com/app/ \
  --exclude=/home/api.rojgariindia.com/app/node_modules \
  --exclude=/home/api.rojgariindia.com/app/dist
```

### Disaster Recovery

**Complete System Restore:**

```bash
# 1. Restore database
gunzip -c backup.sql.gz | mysql -u admin_rojgari -p admin_rojgari

# 2. Restore uploads
tar -xzf uploads_backup.tar.gz -C /

# 3. Restore application
cd /home/api.rojgariindia.com/app
git pull origin main
npm ci
npm run build

# 4. Restart services
pm2 restart rojgari-backend
```

---

## 🔐 Security Checklist

### Before Going Live

- [ ] Change default `JWT_SECRET` to random 256-bit string
- [ ] Update database password from default
- [ ] Set strong MySQL root password
- [ ] Configure CORS_ORIGIN to production domain only
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Set up firewall (UFW)
- [ ] Disable SSH password authentication (use keys only)
- [ ] Enable fail2ban for brute-force protection
- [ ] Set up automated database backups
- [ ] Set up automated file backups
- [ ] Configure rate limiting
- [ ] Enable virus scanning for uploads
- [ ] Review and minimize exposed ports
- [ ] Set up monitoring and alerts
- [ ] Configure log rotation
- [ ] Test disaster recovery procedure

### Firewall Configuration (UFW)

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Allow MySQL only from localhost
sudo ufw allow from 127.0.0.1 to any port 3306

# Check status
sudo ufw status verbose
```

### Fail2Ban Setup

```bash
# Install fail2ban
sudo apt install fail2ban -y

# Create jail for Nginx
sudo nano /etc/fail2ban/jail.local
```

Add:

```ini
[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 5
findtime = 600
bantime = 3600
```

```bash
# Restart fail2ban
sudo systemctl restart fail2ban

# Check status
sudo fail2ban-client status
```

---

## 📈 Performance Optimization

### PM2 Cluster Mode

For multi-core servers:

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "rojgari-backend",
      script: "./dist/server.js",
      instances: "max", // Use all CPU cores
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
```

### Database Optimization

```sql
-- Add indexes for frequently queried columns
ALTER TABLE candidate_profiles ADD INDEX idx_email (email);
ALTER TABLE candidate_profiles ADD INDEX idx_status (status);
ALTER TABLE candidate_profiles ADD INDEX idx_created_at (created_at);

-- Optimize tables
OPTIMIZE TABLE candidate_profiles;
OPTIMIZE TABLE candidate_work_experience;
OPTIMIZE TABLE candidate_skills;
```

### Node.js Memory Settings

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" pm2 start ecosystem.config.js
```

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks

**Daily:**

- Check PM2 status: `pm2 status`
- Check error logs: `pm2 logs --err`
- Monitor disk space: `df -h`

**Weekly:**

- Review access logs for anomalies
- Check SSL certificate expiry
- Verify backups are working
- Update dependencies (security patches)

**Monthly:**

- Full system update: `sudo apt update && sudo apt upgrade`
- Database optimization
- Clean old logs: `pm2 flush`
- Review and archive old backups

### Getting Help

- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Check README.md, API_DOCUMENTATION.md
- **Logs**: Always check logs first for error details

---

## 🎯 Quick Reference

### Common Commands

```bash
# Application
pm2 start ecosystem.config.js
pm2 restart rojgari-backend
pm2 stop rojgari-backend
pm2 logs rojgari-backend

# Nginx
sudo systemctl restart nginx
sudo nginx -t

# Database
mysql -u admin_rojgari -p
mysqldump -u admin_rojgari -p admin_rojgari > backup.sql

# Certificates
sudo certbot renew
sudo certbot certificates

# Monitoring
pm2 monit
htop
df -h

# Logs
tail -f logs/app.log
tail -f /var/log/nginx/error.log
```

---

**Last Updated**: December 29, 2025  
**Deployment Status**: Production Ready ✅  
**CI/CD**: GitHub Actions Enabled ✅
