const express = require('express');
const router = express.Router();

// Persistent in-memory data
let sampleQuestions = [
  {
    id: 1,
    text: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
    subject: "Geography",
    difficulty: "Easy"
  },
  {
    id: 2,
    text: "Solve for x: 2x + 5 = 15",
    options: ["5", "10", "4", "6"],
    correctAnswer: "5",
    subject: "Mathematics",
    difficulty: "Medium"
  },
  {
    id: 3,
    text: "Which of the following is a noble gas?",
    options: ["Oxygen", "Nitrogen", "Helium", "Hydrogen"],
    correctAnswer: "Helium",
    subject: "Science",
    difficulty: "Medium"
  }
];

// GET all questions
router.get('/', (req, res) => {
  res.json({ status: 'success', data: sampleQuestions });
});

// POST new question
router.post('/', (req, res) => {
  const newQuestion = {
    id: Date.now(),
    text: req.body.text || 'Untitled Question',
    options: req.body.options || ["Option 1", "Option 2", "Option 3", "Option 4"],
    correctAnswer: req.body.correctAnswer || "Option 1",
    subject: req.body.subject || 'General',
    difficulty: req.body.difficulty || 'Medium'
  };
  
  sampleQuestions.unshift(newQuestion);
  res.status(201).json({ status: 'success', data: newQuestion });
});

// DELETE question by ID
router.delete('/:id', (req, res) => {
  const questionId = parseInt(req.params.id);
  const initialLength = sampleQuestions.length;
  sampleQuestions = sampleQuestions.filter(q => q.id !== questionId);
  
  if (sampleQuestions.length < initialLength) {
    res.json({ status: 'success', message: 'Question deleted successfully' });
  } else {
    res.status(404).json({ status: 'error', message: 'Question not found' });
  }
});

module.exports = router;
