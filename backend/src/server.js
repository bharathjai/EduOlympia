const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Route imports
const authRoutes = require('./routes/auth.routes');
const schoolRoutes = require('./routes/school.routes');
const userRoutes = require('./routes/user.routes');
const materialsRoutes = require('./routes/materials.routes');
const classesRoutes = require('./routes/classes.routes');
const examsRoutes = require('./routes/exams.routes');
const resultsRoutes = require('./routes/results.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const questionsRoutes = require('./routes/questions.routes');
const practiceRoutes = require('./routes/practice.routes');
const studentsRoutes = require('./routes/students.routes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/users', userRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/exams', examsRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/students', studentsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EduOlympia API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
