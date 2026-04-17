const express = require('express');
const router = express.Router();

// Persistent in-memory data
let samplePracticePapers = [
  {
    id: 1,
    title: "Mathematics - Chapter 1 & 2 Revision",
    subject: "Mathematics",
    class: "Class 8",
    totalQuestions: 25,
    createdAt: "2024-03-15T10:00:00Z"
  },
  {
    id: 2,
    title: "Science Mock Test - Physics",
    subject: "Physics",
    class: "Class 9",
    totalQuestions: 40,
    createdAt: "2024-03-14T14:30:00Z"
  }
];

// GET all practice papers
router.get('/', (req, res) => {
  res.json({ status: 'success', data: samplePracticePapers });
});

// POST new practice paper
router.post('/', (req, res) => {
  const newPaper = {
    id: Date.now(),
    title: req.body.title || 'Untitled Practice Paper',
    subject: req.body.subject || 'General',
    class: req.body.class || 'All Classes',
    totalQuestions: req.body.totalQuestions || 20,
    createdAt: new Date().toISOString()
  };
  
  samplePracticePapers.unshift(newPaper);
  res.status(201).json({ status: 'success', data: newPaper });
});

// DELETE practice paper by ID
router.delete('/:id', (req, res) => {
  const paperId = parseInt(req.params.id);
  const initialLength = samplePracticePapers.length;
  samplePracticePapers = samplePracticePapers.filter(p => p.id !== paperId);
  
  if (samplePracticePapers.length < initialLength) {
    res.json({ status: 'success', message: 'Practice paper deleted successfully' });
  } else {
    res.status(404).json({ status: 'error', message: 'Practice paper not found' });
  }
});

module.exports = router;
