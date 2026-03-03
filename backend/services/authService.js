const jwt = require('jsonwebtoken');

const generateMagicLink = (email) => {
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
  
  // Use process.env for Node.js. 
  // We fall back to localhost:5173 if the variable isn't set in .env
  const frontendUrl = process.env.BASE_FRONTEND_URL || 'http://localhost:5173';
  const link = `${frontendUrl}/verify?token=${token}`;
  
  console.log(`\n--- 🔗 MAGIC LINK GENERATED ---`);
  console.log(`For: ${email}`);
  console.log(`Link: ${link}`);
  console.log(`-------------------------------\n`);
  
  return link;
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = { generateMagicLink, verifyToken };