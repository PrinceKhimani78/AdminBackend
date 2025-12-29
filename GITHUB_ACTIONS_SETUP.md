# 🚀 GitHub Actions Deployment Setup

This guide explains how to set up automatic deployment for the Rojgari India Backend using GitHub Actions.

---

## 📋 What is Automatic Deployment?

When you push code to the `main` branch, GitHub Actions will:

1. ✅ Build your TypeScript code
2. ✅ Create a deployment package
3. ✅ Upload to your production server
4. ✅ Restart the application with PM2
5. ✅ Run health checks
6. ✅ Rollback if deployment fails

**Time:** Deployment takes about 2-3 minutes.

---

## 🔑 Step 1: Generate SSH Key (One-time Setup)

On your **production server**, generate an SSH key for GitHub Actions to connect:

```bash
# SSH into your server
ssh your-username@your-server-ip

# Generate SSH key (press Enter for all prompts)
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github_actions_key -N ""

# Add the public key to authorized_keys
cat ~/.ssh/github_actions_key.pub >> ~/.ssh/authorized_keys

# Display the private key (you'll need this for GitHub)
cat ~/.ssh/github_actions_key
```

**Copy the entire private key** (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`)

---

## 🔐 Step 2: Add Secrets to GitHub

Go to your GitHub repository and add these secrets:

### 2.1 Navigate to Settings

1. Go to your repository: `https://github.com/PrinceKhimani78/AdminBackend`
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### 2.2 Add Required Secrets

Add these **4 secrets** one by one:

#### Secret 1: `BACKEND_DEPLOY_HOST`

- **Name:** `BACKEND_DEPLOY_HOST`
- **Value:** Your server IP or domain
- **Example:** `api.rojgariindia.com` or `192.168.1.100`

#### Secret 2: `BACKEND_DEPLOY_USERNAME`

- **Name:** `BACKEND_DEPLOY_USERNAME`
- **Value:** Your server SSH username
- **Example:** `ubuntu` or `root` or your username

#### Secret 3: `BACKEND_SSH_PRIVATE_KEY`

- **Name:** `BACKEND_SSH_PRIVATE_KEY`
- **Value:** The entire private key from Step 1
- **Example:**
  ```
  -----BEGIN RSA PRIVATE KEY-----
  MIIEpAIBAAKCAQEA... (many lines)
  ...
  -----END RSA PRIVATE KEY-----
  ```

#### Secret 4: `BACKEND_SSH_PORT` (Optional)

- **Name:** `BACKEND_SSH_PORT`
- **Value:** SSH port number (default: 22)
- **Example:** `22` or `2222` if you changed the default

---

## ✅ Step 3: Verify Secrets

After adding all secrets, you should see:

```
BACKEND_DEPLOY_HOST         Updated X minutes ago
BACKEND_DEPLOY_USERNAME     Updated X minutes ago
BACKEND_SSH_PRIVATE_KEY     Updated X minutes ago
BACKEND_SSH_PORT            Updated X minutes ago (optional)
```

---

## 🚀 Step 4: Test Deployment

### Option A: Push to Main Branch

```bash
# Make a small change
echo "# Test deployment" >> README.md

# Commit and push
git add .
git commit -m "test: trigger deployment"
git push origin main
```

### Option B: Manual Trigger

1. Go to **Actions** tab in GitHub
2. Click **Deploy Backend to Production**
3. Click **Run workflow** dropdown
4. Click **Run workflow** button

---

## 📊 Step 5: Monitor Deployment

### View Deployment Progress

1. Go to **Actions** tab in GitHub
2. Click on the running workflow
3. Click on **Deploy to Production Server**
4. Watch the live logs

### Deployment Steps You'll See:

```
✅ Checkout Repository
✅ Setup Node.js
✅ Install Dependencies
✅ Build Application
✅ Create Deployment Package
✅ Deploy to Production Server
✅ Upload Release Package
✅ Extract and Start Application
✅ Health Check
✅ Deployment Success
```

---

## 🎯 What Happens During Deployment

```
┌─────────────────────────────────────────┐
│  GitHub Actions Runner (Ubuntu VM)      │
├─────────────────────────────────────────┤
│  1. Checkout code from main branch      │
│  2. Install Node.js 20                  │
│  3. Run npm ci (install dependencies)   │
│  4. Run npm run build (compile TS)      │
│  5. Create deployment package           │
└──────────────┬──────────────────────────┘
               │
               │ SSH Connection
               ↓
┌─────────────────────────────────────────┐
│  Your Production Server                 │
├─────────────────────────────────────────┤
│  1. Create backup of current version    │
│  2. Stop PM2 process                    │
│  3. Extract new files                   │
│  4. Start/restart PM2 process           │
│  5. Run health check                    │
│  6. Show deployment status              │
└─────────────────────────────────────────┘
```

---

## 🛡️ Safety Features

### Automatic Backup

- Creates backup before deployment
- Keeps last 5 backups
- Located at `/home/backups/backend/`

### Health Check

- Tests if API is responding
- Checks `/api/health` endpoint
- Fails deployment if not responding

### Automatic Rollback

- If deployment fails, rolls back to previous version
- Restores from latest backup
- Keeps your app running

---

## 🐛 Troubleshooting

### Issue 1: "Permission denied (publickey)"

**Problem:** SSH key not configured correctly

**Solution:**

```bash
# On server, check authorized_keys
cat ~/.ssh/authorized_keys | grep github-actions

# Ensure correct permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### Issue 2: "Host key verification failed"

**Problem:** Server not in known_hosts

**Solution:**
The workflow is configured to skip host key verification. If you want to be more secure, add your server's fingerprint to known_hosts.

### Issue 3: "Health check failed"

**Problem:** Application not starting properly

**Solution:**

```bash
# SSH into server and check logs
pm2 logs rojgari-backend

# Check if .env file exists
cat /home/api.rojgariindia.com/app/.env

# Manually restart
pm2 restart rojgari-backend
```

### Issue 4: "npm ci failed"

**Problem:** Dependency installation issue

**Solution:**

- Check if `package-lock.json` is committed to git
- Ensure Node.js version is compatible
- Check GitHub Actions logs for specific error

### Issue 5: Deployment stuck on "Waiting for application to start"

**Problem:** App taking too long to start

**Solution:**
The health check waits 5 seconds. You can increase this in the workflow file:

```yaml
sleep 10 # Change from 5 to 10
```

---

## 📝 Workflow File Location

The deployment workflow is located at:

```
.github/workflows/deploy-backend.yml
```

You can customize:

- Node.js version
- Build commands
- Deployment path
- Health check timeout
- Backup retention

---

## 🔄 How to Disable Auto-Deployment

If you want to temporarily disable automatic deployment:

### Option 1: Disable Workflow

1. Go to **Actions** tab
2. Click **Deploy Backend to Production**
3. Click **⋮** (three dots)
4. Click **Disable workflow**

### Option 2: Change Trigger Branch

Edit `.github/workflows/deploy-backend.yml`:

```yaml
on:
  push:
    branches:
      - production # Change from 'main' to 'production'
```

Now it only deploys when pushing to `production` branch.

---

## 📊 Deployment Logs

### View Deployment History

1. Go to **Actions** tab
2. See all past deployments with status
3. Click any deployment to view logs

### Access Server Logs

```bash
# SSH into server
ssh username@your-server

# View PM2 logs
pm2 logs rojgari-backend

# View deployment logs
ls -la /home/backups/backend/
```

---

## 🎯 Best Practices

### 1. Test Before Pushing

```bash
# Run locally before pushing
npm run build
npm run lint
```

### 2. Use Feature Branches

```bash
# Create feature branch
git checkout -b feature/new-api

# When ready, merge to main
git checkout main
git merge feature/new-api
git push origin main  # This triggers deployment
```

### 3. Monitor After Deployment

- Check GitHub Actions logs
- Check server logs: `pm2 logs`
- Test API endpoints
- Monitor error rate

### 4. Keep Backups

```bash
# Backups are automatic, but you can also manually backup
cd /home/api.rojgariindia.com/app
tar -czf ~/manual-backup-$(date +%Y%m%d).tar.gz dist/ package.json
```

---

## 📞 Need Help?

**Deployment failed?**

1. Check GitHub Actions logs (detailed error messages)
2. SSH into server and check PM2 logs
3. Verify all secrets are set correctly
4. Ensure `.env` file exists on server

**Still having issues?**

- Review server setup in `SERVER_SETUP_GUIDE.md`
- Check `DEPLOYMENT.md` for manual deployment steps
- Verify server is accessible via SSH

---

## 🎉 Success Checklist

After successful setup, you should be able to:

- [ ] Push to main and see workflow running
- [ ] View deployment progress in Actions tab
- [ ] See "✅ Health check passed" in logs
- [ ] Access API at your domain/IP
- [ ] See PM2 process running on server
- [ ] View application logs with `pm2 logs`

---

## 📋 Quick Reference

### GitHub Secrets Required

```
BACKEND_DEPLOY_HOST         → Your server IP/domain
BACKEND_DEPLOY_USERNAME     → SSH username
BACKEND_SSH_PRIVATE_KEY     → SSH private key
BACKEND_SSH_PORT            → SSH port (optional, default: 22)
```

### Server Paths

```
Application:  /home/api.rojgariindia.com/app/
Backups:      /home/backups/backend/
Logs:         /home/api.rojgariindia.com/app/logs/
Uploads:      /home/api.rojgariindia.com/app/uploads/
```

### Useful Commands

```bash
# View deployment status
pm2 status

# View logs
pm2 logs rojgari-backend

# Restart app
pm2 restart rojgari-backend

# View recent backups
ls -lh /home/backups/backend/
```

---

**Created:** December 29, 2025  
**Last Updated:** December 29, 2025  
**Status:** Production Ready ✅
