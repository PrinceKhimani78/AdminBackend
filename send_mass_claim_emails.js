const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: false,
});

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function run() {
  try {
    // 1. Fetch all candidates who do not have a password
    const [candidates] = await sequelize.query(`
      SELECT * 
      FROM candidate_profiles 
      WHERE password IS NULL OR password = ''
    `);

    console.log(`Found ${candidates.length} candidates needing passwords.`);

    if (candidates.length === 0) {
      console.log('No candidates to process. Exiting.');
      process.exit(0);
    }

    const transporter = createTransporter();
    let successCount = 0;
    let errorCount = 0;

    // 2. Loop through each candidate and process
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      const email = candidate.email;
      const firstName = candidate.first_name || 'Candidate';

      try {
        const tempPassword = Math.random().toString(36).slice(-8); // Generate 8-char random password
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Update candidate's password
        await sequelize.query(
          "UPDATE candidate_profiles SET password = ? WHERE email = ?",
          { replacements: [hashedPassword, email] }
        );

        // Send email
        const mailOptions = {
          from: `"Rojgari India" <${process.env.SMTP_USER}>`,
          to: email,
          subject: 'Welcome to the new Rojgari India! Claim Your Profile',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
                .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; }
                .otp-box { background-color: #fff; border: 2px dashed #4CAF50; padding: 20px; text-align: center; margin: 20px 0; }
                .otp { font-size: 24px; font-weight: bold; color: #4CAF50; letter-spacing: 2px; }
                .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Rojgari India</h1>
                </div>
                <div class="content">
                  <h2>Your Profile is Ready!</h2>
                  <p>Hi ${firstName},</p>
                  <p>We've officially launched our new platform! We saved the profile data you submitted previously.</p>
                  <p>To claim your account, please log in at <b>rojgariindia.com</b> using your email address and the temporary password below:</p>
                  <div class="otp-box">
                    <div class="otp">${tempPassword}</div>
                  </div>
                  <p>Once you are logged in, we highly recommend changing your password from your dashboard.</p>
                  <p>Best regards,<br>The Rojgari India Team</p>
                </div>
                <div class="footer">
                  <p>This is an automated message, please do not reply.</p>
                </div>
              </div>
            </body>
            </html>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`[${i + 1}/${candidates.length}] Successfully processed ${email}`);
        successCount++;
        
        // Wait 2 seconds to avoid SMTP rate limiting
        if (i < candidates.length - 1) {
          await delay(2000);
        }
      } catch (err) {
        console.error(`[${i + 1}/${candidates.length}] Failed to process ${email}:`, err.message);
        errorCount++;
      }
    }

    console.log(`\\nFinished! Successfully sent: ${successCount}, Failed: ${errorCount}`);
    process.exit(0);
  } catch (error) {
    console.error('Fatal Error:', error);
    process.exit(1);
  }
}

run();
