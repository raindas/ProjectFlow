require('dotenv').config();
const nodemailer = require('nodemailer');

// Create the transporter object using the hidden .env credentials
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Helps if the server has a specific SSL setup
    ciphers: 'SSLv3' 
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    // console.log(process.env.SMTP_USER, process.env.SMTP_PASS);
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      html: html,
    });

    console.log(`✅ Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Email failed to send:", error);
    // We don't want to crash the whole app if an email fails
    return null; 
  }
};

const getDigestTemplate = (stats) => {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <h2 style="color: #111;">Your ProjectFlow Daily Digest</h2>
      <p style="color: #666;">Here is your status update for today.</p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0;">
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
          <small>ACTIVE TASKS</small>
          <div style="font-size: 24px; font-weight: bold;">${stats.total}</div>
        </div>
        <div style="background: #fff4e5; padding: 15px; border-radius: 8px;">
          <small style="color: #b45309;">DUE TODAY</small>
          <div style="font-size: 24px; font-weight: bold; color: #b45309;">${stats.dueToday}</div>
        </div>
      </div>

      <p>Tasks <b>Overdue</b>: <span style="color: #dc2626;">${stats.overdue}</span></p>
      <p>Completed in last 24h: <span style="color: #16a34a;">${stats.completed}</span></p>

      <a href="${process.env.BASE_FRONTEND_URL}" style="display: inline-block; background: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Open Dashboard</a>
    </div>
  `;
};

module.exports = { sendEmail, getDigestTemplate };