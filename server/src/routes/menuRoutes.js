const express = require('express');
const c = require('../controllers/menuController');
const { authenticate } = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { create: createV } = require('../validators/menuValidator');
const upload = require('../middleware/upload');

const router = express.Router();
router.get('/categories', c.getCategories);
router.get('/', c.getMenuItems);
router.get('/:id', c.getMenuItemById);
router.post('/', authenticate, authorize('admin'), createV, validate, c.createMenuItem);
router.put('/:id', authenticate, authorize('admin'), c.updateMenuItem);
router.patch('/:id/availability', authenticate, authorize('admin'), c.toggleAvailability);
router.delete('/:id', authenticate, authorize('admin'), c.deleteMenuItem);
router.post('/upload', authenticate, authorize('admin'), upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file' });
  res.json({ success: true, data: { url: `/uploads/food/${req.file.filename}` } });
});
module.exports = router;