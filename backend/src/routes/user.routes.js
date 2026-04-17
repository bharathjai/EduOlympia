const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

// Create user (Super Admin creates School Admin, School Admin creates Trainer/Student)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { school_id, role, name, email, password } = req.body;

    // Permissions check
    if (req.user.role !== 'super_admin' && req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Not authorized to create users' });
    }

    if (req.user.role === 'school_admin') {
      // School admin can only create trainers and students for their own school
      if (school_id !== req.user.school_id) {
        return res.status(403).json({ error: 'Cannot create users for another school' });
      }
      if (role !== 'trainer' && role !== 'student') {
        return res.status(403).json({ error: 'Can only create trainers or students' });
      }
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const { rows } = await db.query(
      'INSERT INTO users (school_id, role, name, email, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id, school_id, role, name, email, created_at',
      [school_id, role, name, email, password_hash]
    );

    const newUser = rows[0];

    // If student, also create a student profile
    if (role === 'student') {
      const { batch_class } = req.body;
      await db.query(
        'INSERT INTO students (user_id, school_id, batch_class) VALUES ($1, $2, $3)',
        [newUser.id, school_id, batch_class]
      );
    }

    res.status(201).json(newUser);

  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Get users by school (For Super Admin or School Admin)
router.get('/school/:school_id', authenticateToken, async (req, res) => {
  try {
    const { school_id } = req.params;
    
    if (req.user.role === 'school_admin' && req.user.school_id !== parseInt(school_id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { rows } = await db.query(
      'SELECT id, school_id, role, name, email, created_at FROM users WHERE school_id = $1 ORDER BY created_at DESC',
      [school_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
