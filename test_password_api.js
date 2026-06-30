const fs = require('fs');
const path = require('path');

const BACKEND_URL = 'https://api.rojgariindia.com/api';
const EMAIL = 'kadriareebah@gmail.com';
const { Sequelize } = require('sequelize');
let token = '';

require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
});
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function runTest() {
  console.log("Starting test...");
  
  // Create dummy user if doesn't exist
  await sequelize.query(
    "INSERT IGNORE INTO candidate_profiles (id, full_name, email, password, mobile_number, gender, status) VALUES (UUID(), 'Test User', ?, 'dummy', '0000000000', 'Other', 'Active')",
    { replacements: [EMAIL] }
  );

  // 1. Forgot Password
  console.log("1. Requesting forgot password...");
  const forgotRes = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL })
  });
  const forgotData = await forgotRes.json();
  console.log("Forgot Password Response:", forgotData);
  if (!forgotData.success) throw new Error("Forgot Password failed");

  // Read OTP from cache
  const cachePath = path.join('/tmp', 'rojgari_otp_cache.json');
  await new Promise(resolve => setTimeout(resolve, 1000)); // wait for file write
  const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  const otpData = cache[EMAIL];
  if (!otpData) throw new Error("OTP not found in cache");
  const otp = otpData.otp;
  console.log("Extracted OTP:", otp);

  // 2. Reset Password
  console.log("2. Resetting password...");
  const resetRes = await fetch(`${BACKEND_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, otp, newPassword: 'newpassword123' })
  });
  const resetData = await resetRes.json();
  console.log("Reset Password Response:", resetData);
  if (!resetData.success) throw new Error("Reset Password failed");

  // 3. Login
  console.log("3. Logging in...");
  const loginRes = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: 'newpassword123' })
  });
  const loginData = await loginRes.json();
  console.log("Login Response success:", loginData.success);
  if (!loginData.success) throw new Error("Login failed");
  token = loginData.data.token;

  // 4. Change Password
  console.log("4. Changing password...");
  const changeRes = await fetch(`${BACKEND_URL}/auth/change-password`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ oldPassword: 'newpassword123', newPassword: 'newerpassword456' })
  });
  const changeData = await changeRes.json();
  console.log("Change Password Response:", changeData);
  if (!changeData.success) throw new Error("Change Password failed");

  console.log("ALL TESTS PASSED SUCCESSFULLY");
  process.exit(0);
}

runTest().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
