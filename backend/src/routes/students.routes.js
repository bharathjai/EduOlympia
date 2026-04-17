const express = require('express');
const router = express.Router();

let sampleStudents = [
  { id: 1, name: "Aarav Sharma", class: "Class 8", section: "A", lastActive: "2 hours ago", score: 85, phone: "+91 9876543210" },
  { id: 2, name: "Diya Patel", class: "Class 9", section: "B", lastActive: "Just now", score: 92, phone: "+91 8765432109" },
  { id: 3, name: "Kabir Singh", class: "Class 8", section: "A", lastActive: "1 day ago", score: 68, phone: "+91 7654321098" },
  { id: 4, name: "Ananya Iyer", class: "Class 10", section: "C", lastActive: "5 mins ago", score: 96, phone: "+91 6543210987" },
  { id: 5, name: "Rohan Gupta", class: "Class 9", section: "A", lastActive: "3 days ago", score: 74, phone: "+91 5432109876" }
];

// GET all students
router.get('/', (req, res) => {
  res.json({ status: 'success', data: sampleStudents });
});

module.exports = router;
