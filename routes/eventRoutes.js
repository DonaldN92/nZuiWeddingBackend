const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  addEvent,
  getEvents,
  deleteEvent,
  updateEvent,
  getDetailsEvent
} = require('../controllers/eventController');
////////////////////////
//// Protected routes//////
///////////////////////////////
router.get('/', protect, getEvents);
router.post('/',protect, addEvent);
router.get('/:id', getEvents);
router.patch('/:id',protect, updateEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;