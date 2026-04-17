const express = require('express');
const router = express.Router();

// Persistent in-memory data
let sampleAnalytics = {
  totalStudents: 2847,
  materialsPublished: 56,
  questionsCreated: 3420,
  liveClassesHosted: 5,
  averageTestScore: 78.6,
  improvementRate: 8.1,
  recentActivity: [
    { action: 'Uploaded: "Quadratic Equations - Notes.pdf"', time: '2 hours ago' },
    { action: 'Generated 25 MCQs for "Linear Equations"', time: 'Yesterday' },
    { action: 'Created Practice Paper: Mathematics - Chapter 2', time: '2 days ago' }
  ]
};

// GET analytics overview
router.get('/', (req, res) => {
  res.json({ status: 'success', data: sampleAnalytics });
});

// POST new activity
router.post('/activity', (req, res) => {
  const newActivity = {
    action: req.body.action || 'Performed an action',
    time: 'Just now'
  };
  
  sampleAnalytics.recentActivity.unshift(newActivity);
  
  // Keep only the 10 most recent
  if (sampleAnalytics.recentActivity.length > 10) {
    sampleAnalytics.recentActivity.pop();
  }
  
  res.status(201).json({ status: 'success', data: sampleAnalytics });
});

module.exports = router;
