const express = require('express');
const router = express.Router();

// GET all results
router.get('/', (req, res) => {
  const sampleResults = {
    overview: {
      globalRank: 156,
      averageScore: 78.6,
      testsAttempted: 24,
      streak: 12
    },
    recentTests: [
      { id: 101, title: 'Algebra Quiz', score: 85, maxScore: 100, date: '2024-03-12' },
      { id: 102, title: 'Physics Mock', score: 72, maxScore: 100, date: '2024-03-10' }
    ]
  };
  
  res.json({ status: 'success', data: sampleResults });
});

module.exports = router;
