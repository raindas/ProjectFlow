const express = require('express');
const router = express.Router();
const { generateMagicLink, verifyToken } = require('../services/authService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  const { email } = req.body;

  // 1. Check if user exists or create them (Soft onboarding)
  let user = await prisma.settings.findUnique({ where: { OwnerEmail: email } });
  if (!user) {
    user = await prisma.settings.create({ data: { OwnerEmail: email } });
  }

  // 2. Generate and "Send" link (Check your terminal for the link!)
  const link = generateMagicLink(email);
  
  res.json({ message: "Magic link generated! Check your server console." });
});

// GET /api/v1/auth/verify?token=...
router.get('/verify', async (req, res) => {
  const { token } = req.query;
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // In a real app, you might generate a long-lived Session Token here.
  // For now, we'll just return the user info.
  res.json({ 
    message: "Login successful", 
    email: decoded.email,
    token: token // Sending the same token back to store in localStorage
  });
});

module.exports = router;