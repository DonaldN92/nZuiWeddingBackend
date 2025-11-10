const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const surveyController = require('../controllers/surveyController');

router.get('/', protect, surveyController.getAllQuestions);
router.post('/', protect, surveyController.createQuestion);
router.get('/:id', surveyController.getAllQuestions);
router.patch('/:id', protect, surveyController.updateQuestion);
router.delete('/:id', protect, surveyController.deleteQuestion);


module.exports = router;