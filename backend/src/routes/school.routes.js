const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

// Super Admin: Get all schools
router.get('/', authenticateToken, authorizeRole('super_admin'), async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM schools ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Super Admin: Create a new school
router.post('/', authenticateToken, authorizeRole('super_admin'), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'School name is required' });

    const { rows } = await db.query(
      'INSERT INTO schools (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
