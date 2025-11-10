const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const scheduleController = require('../controllers/scheduleController');

router.get('/', protect, scheduleController.getAllSchedules);
router.post('/', protect, scheduleController.createSchedule);
router.get('/:id', scheduleController.getAllSchedules);
router.patch('/:id', protect, scheduleController.updateSchedule);
router.delete('/:id', protect, scheduleController.deleteSchedule);


module.exports = router;