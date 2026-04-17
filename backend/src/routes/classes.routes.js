const express = require('express');
const router = express.Router();

// Persistent in-memory data
let sampleClasses = [
  {
    id: 1,
    title: 'Mensuration - Area & Perimeter',
    subject: 'Mathematics',
    class: 'Class 8',
    date: 'Today',
    time: '04:00 PM - 05:00 PM',
    studentsRegistered: 156,
    status: 'upcoming'
  },
  {
    id: 2,
    title: 'Graphical Representation of Data',
    subject: 'Mathematics',
    class: 'Class 9',
    date: 'Tomorrow',
    time: '11:00 AM - 12:00 PM',
    studentsRegistered: 142,
    status: 'scheduled'
  }
];

// GET all classes
router.get('/', (req, res) => {
  res.json({ status: 'success', data: sampleClasses });
});

// POST new class
router.post('/', (req, res) => {
  const newClass = {
    id: Date.now(),
    title: req.body.title || 'Untitled Class',
    subject: req.body.subject || 'General',
    class: req.body.class || 'All Classes',
    date: req.body.date || 'Soon',
    time: req.body.time || 'TBD',
    studentsRegistered: 0,
    status: 'upcoming'
  };
  
  sampleClasses.unshift(newClass); // Add to beginning of array
  res.status(201).json({ status: 'success', data: newClass });
});

// PUT update class
router.put('/:id', (req, res) => {
  const classId = parseInt(req.params.id);
  const classIndex = sampleClasses.findIndex(c => c.id === classId);
  
  if (classIndex !== -1) {
    sampleClasses[classIndex] = {
      ...sampleClasses[classIndex],
      ...req.body
    };
    res.json({ status: 'success', data: sampleClasses[classIndex] });
  } else {
    res.status(404).json({ status: 'error', message: 'Class not found' });
  }
});

// DELETE class
router.delete('/:id', (req, res) => {
  const classId = parseInt(req.params.id);
  const initialLength = sampleClasses.length;
  sampleClasses = sampleClasses.filter(c => c.id !== classId);
  
  if (sampleClasses.length < initialLength) {
    res.json({ status: 'success', message: 'Class deleted successfully' });
  } else {
    res.status(404).json({ status: 'error', message: 'Class not found' });
  }
});

module.exports = router;
