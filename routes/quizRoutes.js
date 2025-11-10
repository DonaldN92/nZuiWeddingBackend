const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const quizController = require('../controllers/quizController');

router.get('/', protect, quizController.getAllQuestions);
router.post('/', protect, quizController.createQuestion);
router.get('/:id', quizController.getAllQuestions);
router.patch('/:id', protect, quizController.updateQuestion);
router.delete('/:id', protect, quizController.deleteQuestion);


module.exports = router;