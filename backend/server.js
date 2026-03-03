require('dotenv').config();
const express = require('express');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const settingRoutes = require('./routes/settingRoutes');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json());

// Routes
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/settings', settingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 ProjectFlow API live at http://localhost:${PORT}`);
});