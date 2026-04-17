const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Persistent in-memory data
let sampleMaterials = [
  {
    id: 1,
    title: 'Algebra Basics - Notes',
    type: 'PDF',
    subject: 'Mathematics',
    class: 'Class 8',
    uploadedAt: '2024-03-15T10:00:00Z',
    size: '2.4 MB'
  },
  {
    id: 2,
    title: 'Introduction to Chemical Reactions',
    type: 'Video',
    subject: 'Science',
    class: 'Class 9',
    uploadedAt: '2024-03-14T14:30:00Z',
    duration: '15 mins'
  },
  {
    id: 3,
    title: 'Newton\'s Laws of Motion',
    type: 'PDF',
    subject: 'Physics',
    class: 'Class 9',
    uploadedAt: '2024-03-10T09:15:00Z',
    size: '1.8 MB'
  }
];

// GET all materials
router.get('/', (req, res) => {
  res.json({ status: 'success', data: sampleMaterials });
});

// POST new material
router.post('/', upload.single('file'), (req, res) => {
  let fileUrl = null;
  let fileSize = 'Unknown';
  let isVideo = false;

  if (req.file) {
    fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    const mbSize = (req.file.size / (1024 * 1024)).toFixed(2);
    fileSize = `${mbSize} MB`;
    if (req.file.mimetype.startsWith('video/')) {
      isVideo = true;
    }
  }

  const newMaterial = {
    id: Date.now(),
    title: req.body.title || 'Untitled Document',
    type: isVideo ? 'Video' : 'PDF',
    subject: req.body.subject || 'General',
    class: req.body.class || 'All Classes',
    uploadedAt: new Date().toISOString(),
    size: isVideo ? null : fileSize,
    duration: isVideo ? '10 mins' : null,
    url: fileUrl // The link for students to download
  };
  
  sampleMaterials.unshift(newMaterial);
  res.status(201).json({ status: 'success', data: newMaterial });
});

// GET material by ID
router.get('/:id', (req, res) => {
  res.json({ status: 'success', message: `Details for material ID: ${req.params.id}` });
});

// DELETE material by ID
router.delete('/:id', (req, res) => {
  const materialId = parseInt(req.params.id);
  const initialLength = sampleMaterials.length;
  sampleMaterials = sampleMaterials.filter(mat => mat.id !== materialId);
  
  if (sampleMaterials.length < initialLength) {
    res.json({ status: 'success', message: 'Material deleted successfully' });
  } else {
    res.status(404).json({ status: 'error', message: 'Material not found' });
  }
});

module.exports = router;
