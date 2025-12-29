# 🖥️ Complete Server Setup Guide - Rojgari India Backend

**Simple step-by-step guide to set up your backend on a fresh server**

---

## 📋 What You'll Need

- A fresh Ubuntu server (20.04 or 22.04)
- SSH access to the server (root or sudo user)
- Your domain name (e.g., api.rojgariindia.com)
- Basic terminal knowledge

**Time needed:** About 30-45 minutes

---

## 🚀 Step 1: Connect to Your Server

```bash
# Connect via SSH (from your computer)
ssh root@your-server-ip

# Or if you have a username
ssh username@your-server-ip
```

**Example:**

```bash
ssh root@192.168.1.100
```

---

## 🔄 Step 2: Update Your Server

First, make sure everything is up to date:

```bash
# Update package list
sudo apt update

# Upgrade all packages
sudo apt upgrade -y

# Install basic tools
sudo apt install -y curl wget git vim software-properties-common
```

**What this does:** Gets your server ready with latest security updates and basic tools.

---

## 🟢 Step 3: Install Node.js

We need Node.js version 18 or higher.

```bash
# Download and run Node.js setup script
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Check if installed correctly
node --version
npm --version
```

**Expected output:**

```
v20.x.x
10.x.x
```

---

## 🗄️ Step 4: Install MySQL Database

### Install MySQL Server

```bash
# Install MySQL
sudo apt install -y mysql-server

# Start MySQL service
sudo systemctl start mysql

# Enable MySQL to start on boot
sudo systemctl enable mysql

# Check if running
sudo systemctl status mysql
```

### Secure MySQL Installation

```bash
# Run security script
sudo mysql_secure_installation
```

**During setup, answer these questions:**

1. **Set root password?** → YES → Enter a strong password
2. **Remove anonymous users?** → YES
3. **Disallow root login remotely?** → YES
4. **Remove test database?** → YES
5. **Reload privilege tables?** → YES

### Create Database and User

```bash
# Login to MySQL as root
sudo mysql -u root -p
```

**Inside MySQL, run these commands:**

```sql
-- Create database
CREATE DATABASE admin_rojgari;

-- Create user with password
CREATE USER 'admin_rojgari'@'localhost' IDENTIFIED BY 'YourStrongPassword123!';

-- Give user all permissions on the database
GRANT ALL PRIVILEGES ON admin_rojgari.* TO 'admin_rojgari'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Check if database was created
SHOW DATABASES;

-- Exit MySQL
EXIT;
```

### Test Database Connection

```bash
# Try logging in with new user
mysql -u admin_rojgari -p admin_rojgari
```

Enter the password you set. If it works, type `EXIT;` to logout.

---

## 🔧 Step 5: Install PM2 (Process Manager)

PM2 keeps your Node.js app running forever, even after server restarts.

```bash
# Install PM2 globally
sudo npm install -g pm2

# Check if installed
pm2 --version
```

---

## 📁 Step 6: Create Application Directory

```bash
# Create directory for your app
sudo mkdir -p /home/api.rojgariindia.com/app

# Change ownership to your user (replace 'ubuntu' with your username)
sudo chown -R $USER:$USER /home/api.rojgariindia.com/app

# Go to the directory
cd /home/api.rojgariindia.com/app
```

---

## 📥 Step 7: Get Your Application Code

### Option A: Using Git (Recommended)

```bash
# Go to app directory
cd /home/api.rojgariindia.com/app

# Clone your repository
git clone https://github.com/PrinceKhimani78/AdminBackend.git .

# Note: The dot (.) at the end clones into current directory
```

### Option B: Upload Files Manually

```bash
# From your local computer, upload files
scp -r /path/to/your/AdminBackend/* username@your-server-ip:/home/api.rojgariindia.com/app/
```

---

## ⚙️ Step 8: Install Application Dependencies

```bash
# Make sure you're in the app directory
cd /home/api.rojgariindia.com/app

# Install all npm packages
npm install

# This will take 2-5 minutes
```

---

## 🔐 Step 9: Setup Environment Variables

```bash
# Copy example file to .env
cp .env.example .env

# Edit the .env file
nano .env
```

**Update these important values in .env:**

```env
# Change to production
NODE_ENV=production

# Your server port
PORT=3000

# Your domain (or server IP if no domain)
BASE_URL=https://api.rojgariindia.com

# Database settings (use what you created in Step 4)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=admin_rojgari
DB_USER=admin_rojgari
DB_PASSWORD=YourStrongPassword123!

# Generate a strong JWT secret
# Run this command: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Then paste the output here:
JWT_SECRET=paste-the-generated-secret-here

# Email settings (use your SMTP details)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Your frontend domain
CORS_ORIGIN=https://rojgariindia.com
```

**To save in nano:**

- Press `Ctrl + X`
- Press `Y` for Yes
- Press `Enter`

### Generate JWT Secret

```bash
# Generate a secure random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copy the output and paste it in your .env file as JWT_SECRET
```

---

## 🗃️ Step 10: Setup Database Tables

```bash
# Run database setup script
npm run setup-db
```

**This will:**

- Create all tables (candidates, work_experience, skills, etc.)
- Add lookup data (countries, states, cities)
- Add job functions and skills

**Expected output:** You should see "Database setup completed successfully!"

---

## 🏗️ Step 11: Build the Application

```bash
# Compile TypeScript to JavaScript
npm run build

# Check if dist folder was created
ls -la dist/
```

You should see a `dist` folder with compiled JavaScript files.

---

## 📂 Step 12: Create Upload Directories

```bash
# Create directories for file uploads
mkdir -p uploads/profile_photo
mkdir -p uploads/resume
mkdir -p logs

# Set proper permissions
chmod -R 755 uploads
chmod -R 755 logs
```

---

## 🚀 Step 13: Start Application with PM2

```bash
# Start the app
pm2 start dist/server.js --name "rojgari-backend"

# Check if running
pm2 status

# View logs
pm2 logs rojgari-backend
```

**You should see:**

```
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┤
│ 0  │ rojgari-backend    │ fork     │ 0    │ online    │ 0%       │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┘
```

### Make PM2 Start on Server Reboot

```bash
# Save PM2 process list
pm2 save

# Generate startup script
pm2 startup

# Copy and run the command PM2 shows you
# It will look like: sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup...
```

---

## 🧪 Step 14: Test Your API

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Expected response:
# {"success":true,"message":"API is running","data":{"status":"healthy",...}}
```

**If you see the JSON response above, congratulations! Your API is working! 🎉**

---

## 🌐 Step 15: Install and Configure Nginx (Web Server)

Nginx will act as a reverse proxy, handling HTTPS and forwarding requests to your Node.js app.

### Install Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx

# Enable on boot
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

### Configure Nginx for Your API

```bash
# Create configuration file
sudo nano /etc/nginx/sites-available/rojgari-api
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    server_name api.rojgariindia.com;

    # Increase upload size limit
    client_max_body_size 20M;

    # Logs
    access_log /var/log/nginx/rojgari-api-access.log;
    error_log /var/log/nginx/rojgari-api-error.log;

    location / {
        # Forward to Node.js app
        proxy_pass http://localhost:3000;

        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

**Save the file** (Ctrl+X, Y, Enter)

### Enable the Site

```bash
# Create symbolic link to enable site
sudo ln -s /etc/nginx/sites-available/rojgari-api /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

---

## 🔒 Step 16: Setup SSL Certificate (HTTPS)

### Using Let's Encrypt (Free SSL)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.rojgariindia.com

# Follow the prompts:
# 1. Enter your email address
# 2. Agree to terms (Y)
# 3. Choose whether to redirect HTTP to HTTPS (recommended: 2)
```

**What this does:**

- Gets a free SSL certificate
- Automatically configures Nginx for HTTPS
- Sets up auto-renewal

### Test Auto-Renewal

```bash
# Test if auto-renewal works
sudo certbot renew --dry-run
```

If successful, your certificate will auto-renew before expiry!

---

## 🔥 Step 17: Configure Firewall

```bash
# Allow SSH (important - don't lock yourself out!)
sudo ufw allow ssh
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

**You should see:**

```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

---

## ✅ Step 18: Verify Everything Works

### Test from the server:

```bash
# Test local connection
curl http://localhost:3000/api/health

# Test through Nginx
curl http://localhost/api/health

# Test with domain (if DNS is set up)
curl https://api.rojgariindia.com/api/health
```

### Test from your computer:

Open your browser and go to:

```
https://api.rojgariindia.com/api/health
```

You should see:

```json
{
  "success": true,
  "message": "API is running",
  "data": {
    "status": "healthy",
    "timestamp": "2025-12-29T..."
  }
}
```

**If you see this, your server is fully set up and working! 🎉**

---

## 📊 Step 19: Useful Commands for Managing Your Server

### PM2 Commands

```bash
# View all running apps
pm2 list

# View logs in real-time
pm2 logs rojgari-backend

# Restart app
pm2 restart rojgari-backend

# Stop app
pm2 stop rojgari-backend

# View detailed info
pm2 show rojgari-backend

# Monitor CPU and memory
pm2 monit
```

### Nginx Commands

```bash
# Test configuration
sudo nginx -t

# Reload (after config changes)
sudo systemctl reload nginx

# Restart
sudo systemctl restart nginx

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### MySQL Commands

```bash
# Login to MySQL
mysql -u admin_rojgari -p admin_rojgari

# Backup database
mysqldump -u admin_rojgari -p admin_rojgari > backup.sql

# Restore database
mysql -u admin_rojgari -p admin_rojgari < backup.sql
```

### Check Logs

```bash
# Application logs
pm2 logs rojgari-backend

# Nginx access logs
sudo tail -f /var/log/nginx/rojgari-api-access.log

# Nginx error logs
sudo tail -f /var/log/nginx/rojgari-api-error.log

# System logs
sudo journalctl -u nginx -f
```

---

## 🔄 Step 20: How to Deploy Updates

When you make changes to your code and want to update the server:

```bash
# Method 1: Using Git (if you pushed to GitHub)
cd /home/api.rojgariindia.com/app
git pull origin main
npm install
npm run build
pm2 restart rojgari-backend

# Method 2: Upload new files
# From your computer:
scp -r dist/* username@your-server-ip:/home/api.rojgariindia.com/app/dist/
# Then on server:
pm2 restart rojgari-backend
```

---

## 🛡️ Security Checklist

Before going live, make sure:

- [ ] Changed default database password
- [ ] Generated strong JWT_SECRET
- [ ] Configured CORS_ORIGIN to your actual domain
- [ ] Enabled HTTPS (SSL certificate)
- [ ] Configured firewall (ufw)
- [ ] Changed all default passwords
- [ ] Set up database backups
- [ ] Tested all API endpoints
- [ ] Reviewed environment variables

---

## 🐛 Troubleshooting Common Issues

### Issue 1: "npm: command not found"

**Solution:** Node.js not installed properly. Repeat Step 3.

### Issue 2: "Cannot connect to MySQL"

**Solution:**

```bash
# Check if MySQL is running
sudo systemctl status mysql

# If not running, start it
sudo systemctl start mysql

# Check your credentials in .env file
```

### Issue 3: "Port 3000 already in use"

**Solution:**

```bash
# Find what's using port 3000
sudo lsof -i :3000

# Kill the process (replace PID with the actual number)
sudo kill -9 PID

# Or change PORT in .env file to 3001 or another port
```

### Issue 4: "502 Bad Gateway" from Nginx

**Solution:**

```bash
# Check if Node.js app is running
pm2 status

# If not online, start it
pm2 start dist/server.js --name rojgari-backend

# Check Node.js app logs
pm2 logs rojgari-backend
```

### Issue 5: "Permission denied" for uploads

**Solution:**

```bash
# Fix upload directory permissions
cd /home/api.rojgariindia.com/app
sudo chown -R $USER:$USER uploads/
chmod -R 755 uploads/
```

### Issue 6: "Database connection failed"

**Solution:**

```bash
# Test database connection
mysql -u admin_rojgari -p admin_rojgari

# If login fails, reset password
sudo mysql -u root -p
```

Then in MySQL:

```sql
ALTER USER 'admin_rojgari'@'localhost' IDENTIFIED BY 'NewPassword123!';
FLUSH PRIVILEGES;
EXIT;
```

Update password in `.env` file.

---

## 📱 Step 21: Point Your Domain to Server

If you haven't already:

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find DNS settings
3. Add an **A Record**:
   - **Host/Name:** api
   - **Points to:** Your server IP address
   - **TTL:** 3600 (or default)

**Example:**

```
Type: A
Host: api
Value: 192.168.1.100
TTL: 3600
```

Wait 5-60 minutes for DNS to propagate, then your domain will work!

---

## 📊 Daily Maintenance

### Things to check daily:

```bash
# 1. Check if app is running
pm2 status

# 2. Check for errors in logs
pm2 logs rojgari-backend --err --lines 20

# 3. Check disk space
df -h

# 4. Check server resources
htop
```

### Weekly tasks:

```bash
# Update server packages
sudo apt update && sudo apt upgrade -y

# Restart app (to free memory)
pm2 restart rojgari-backend

# Backup database
mysqldump -u admin_rojgari -p admin_rojgari > backup_$(date +%Y%m%d).sql
```

---

## 🎯 Quick Summary

**What you've set up:**

1. ✅ Ubuntu Server (updated)
2. ✅ Node.js 20.x
3. ✅ MySQL Database with your database
4. ✅ PM2 Process Manager
5. ✅ Your Backend Application
6. ✅ Nginx Reverse Proxy
7. ✅ SSL Certificate (HTTPS)
8. ✅ Firewall Configuration
9. ✅ Auto-restart on server reboot

**Your API is now:**

- Running 24/7
- Accessible via HTTPS
- Secure with firewall
- Auto-restarts if it crashes
- Ready for production traffic

---

## 📞 Need Help?

If you get stuck:

1. Check the logs: `pm2 logs rojgari-backend`
2. Review this guide step by step
3. Google the specific error message
4. Check GitHub Issues
5. Ask your development team

---

## 🎉 Congratulations!

You've successfully set up a production-ready Node.js backend server!

**Your API is now live at:** `https://api.rojgariindia.com`

**Next steps:**

- Test all API endpoints
- Set up automated backups
- Monitor server performance
- Deploy your frontend

---

**Created:** December 29, 2025  
**Version:** 1.0  
**For:** Rojgari India Backend
