const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const guestController = require('../controllers/guestController');

router.get('/', protect, guestController.getAllGuests);
router.post('/', protect, guestController.createGuest);
router.post('/rsvp', guestController.createGuest);
router.post('/:id/send-invitation', protect, guestController.sendInvitation);
router.patch('/:id', protect, guestController.updateGuest);
router.delete('/:id', protect, guestController.deleteGuest);


module.exports = router;