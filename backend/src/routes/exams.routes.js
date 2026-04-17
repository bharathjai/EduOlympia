const express = require('express');
const router = express.Router();

// Persistent in-memory data
let sampleExams = [
  {
    id: 1,
    title: 'Full Length Test - Science',
    type: 'Practice Test',
    questionsCount: 3,
    durationMinutes: 10,
    dueDate: '2024-03-20T23:59:00Z',
    questions: [
      {
        id: 101,
        text: "What is the powerhouse of the cell?",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
        correctAnswer: "Mitochondria"
      },
      {
        id: 102,
        text: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Mars"
      },
      {
        id: 103,
        text: "What is the chemical symbol for Gold?",
        options: ["Ag", "Au", "Fe", "Cu"],
        correctAnswer: "Au"
      }
    ]
  },
  {
    id: 2,
    title: 'School Level Olympiad',
    type: 'Formal Exam',
    questionsCount: 2,
    durationMinutes: 5,
    date: '2024-12-10T10:00:00Z',
    questions: [
      {
        id: 201,
        text: "Solve: 15 + 25 * 2",
        options: ["80", "65", "40", "50"],
        correctAnswer: "65"
      },
      {
        id: 202,
        text: "Who wrote 'Hamlet'?",
        options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
        correctAnswer: "William Shakespeare"
      }
    ]
  }
];

// GET all exams
router.get('/', (req, res) => {
  res.json({ status: 'success', data: sampleExams });
});

// GET exam by ID
router.get('/:id', (req, res) => {
  const examId = parseInt(req.params.id);
  const exam = sampleExams.find(e => e.id === examId);
  
  if (exam) {
    res.json({ status: 'success', data: exam });
  } else {
    res.status(404).json({ status: 'error', message: 'Exam not found' });
  }
});

// POST new exam
router.post('/', (req, res) => {
  const newExam = {
    id: Date.now(),
    title: req.body.title || 'Untitled Exam',
    type: req.body.type || 'Practice Test',
    questionsCount: req.body.questionsCount || 30,
    durationMinutes: req.body.durationMinutes || 60,
    date: req.body.date || new Date().toISOString()
  };
  
  sampleExams.unshift(newExam);
  res.status(201).json({ status: 'success', data: newExam });
});

module.exports = router;
