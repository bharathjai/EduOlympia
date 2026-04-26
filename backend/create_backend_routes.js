const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'src', 'routes');
const serverFile = path.join(__dirname, 'src', 'server.js');

const routesToCreate = [
  { name: 'trainers', variable: 'trainersRoutes', path: '/api/trainers' },
  { name: 'approvals', variable: 'approvalsRoutes', path: '/api/approvals' },
  { name: 'awards', variable: 'awardsRoutes', path: '/api/awards' },
  { name: 'billing', variable: 'billingRoutes', path: '/api/billing' },
  { name: 'settings', variable: 'settingsRoutes', path: '/api/settings' },
  { name: 'reports', variable: 'reportsRoutes', path: '/api/reports' },
  { name: 'certificates', variable: 'certificatesRoutes', path: '/api/certificates' },
];

const template = (name) => `const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

// Get all ${name}
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Assuming a generic table name for the mockup: ${name}
    // const { rows } = await db.query('SELECT * FROM ${name} ORDER BY created_at DESC');
    // res.json(rows);
    res.json({ message: 'List of ${name} fetched successfully', data: [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new ${name}
router.post('/', authenticateToken, async (req, res) => {
  try {
    const data = req.body;
    res.status(201).json({ message: '${name} created successfully', data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update ${name}
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    res.json({ message: '${name} updated successfully', id, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete ${name}
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    res.json({ message: '${name} deleted successfully', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
`;

// Create files
routesToCreate.forEach(route => {
  const filePath = path.join(routesDir, `${route.name}.routes.js`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, template(route.name));
    console.log(`Created ${filePath}`);
  }
});

// Update server.js
let serverContent = fs.readFileSync(serverFile, 'utf8');

let importsToAdd = '';
let usesToAdd = '';

routesToCreate.forEach(route => {
  if (!serverContent.includes(`require('./routes/${route.name}.routes')`)) {
    importsToAdd += `const ${route.variable} = require('./routes/${route.name}.routes');\n`;
  }
  if (!serverContent.includes(`app.use('${route.path}'`)) {
    usesToAdd += `app.use('${route.path}', ${route.variable});\n`;
  }
});

if (importsToAdd) {
  serverContent = serverContent.replace('// Use routes', importsToAdd + '\n// Use routes');
}

if (usesToAdd) {
  serverContent = serverContent.replace(`app.get('/api/health'`, usesToAdd + `\napp.get('/api/health'`);
}

fs.writeFileSync(serverFile, serverContent);
console.log('Updated server.js');
