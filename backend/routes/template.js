
const express = require('express');
const router = express.Router();

const {
  getAllTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getTemplatesByAuthor,
  searchTemplates,
} = require('../controllers/templateController');

const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/', authenticate, getAllTemplates);
router.get('/author/:author', authenticate, getTemplatesByAuthor);
router.get('/search', authenticate, searchTemplates);

router.post('/', authenticate, authorize('admin'), createTemplate);

router.put('/:id',authenticate,authorize('admin'),updateTemplate);

router.delete('/:id',authenticate,authorize('admin'),deleteTemplate);

module.exports = router;
