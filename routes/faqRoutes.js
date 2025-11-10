const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const faqController = require('../controllers/faqController');

router.get('/', protect, faqController.getAllQuestions);
router.post('/', protect, faqController.createQuestion);
router.get('/:id', faqController.getAllQuestions);
router.patch('/:id', protect, faqController.updateQuestion);
router.delete('/:id', protect, faqController.deleteQuestion);


module.exports = router;