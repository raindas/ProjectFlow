const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { sendEmail } = require('../services/emailService');

const prisma = new PrismaClient();

// GET current settings for a user
router.get('/:email', async (req, res) => {
  const settings = await prisma.settings.findUnique({
    where: { OwnerEmail: req.params.email }
  });
  res.json(settings);
});

// PATCH (Update) settings
router.patch('/:email', async (req, res) => {
  const { dailyDigestTime, timeZone, emailEnabled } = req.body;
  try {
    const updated = await prisma.settings.update({
      where: { OwnerEmail: req.params.email },
      data: {
        DailyDigestTime: dailyDigestTime,
        TimeZone: timeZone,
        EmailEnabled: emailEnabled
      }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update settings" });
  }
});

// POST /api/v1/settings/test-email
router.post('/test-email', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "No email provided" });

  const html = `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #16a34a;">🚀 Connection Successful!</h2>
      <p>Your SMTP settings are working perfectly. ProjectFlow can now send you magic links and daily digests.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <small style="color: #999;">Sent at: ${new Date().toLocaleString()}</small>
    </div>
  `;

  try {
    const result = await sendEmail({
      to: email,
      subject: "ProjectFlow SMTP Test ✅",
      html: html
    });

    if (result) {
      res.json({ message: "Test email sent!" });
    } else {
      res.status(500).json({ error: "SMTP failed. Check terminal logs." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;