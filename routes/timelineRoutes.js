const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const timelineController = require('../controllers/timelineController');

router.get('/', protect, timelineController.getAllSteps);
router.post('/', protect, timelineController.createStep);
router.get('/:id', timelineController.getAllSteps);
router.patch('/:id', protect, timelineController.updateStep);
router.delete('/:id', protect, timelineController.deleteStep);


module.exports = router;