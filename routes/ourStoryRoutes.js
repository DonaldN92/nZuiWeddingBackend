const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const storyController = require('../controllers/storyController');

router.get('/', protect, storyController.getAllSteps);
router.post('/', protect, storyController.createStep);
router.get('/:id', storyController.getAllSteps);
router.patch('/:id', protect, storyController.updateStep);
router.delete('/:id', protect, storyController.deleteStep);


module.exports = router;