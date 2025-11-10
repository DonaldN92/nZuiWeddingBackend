const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const giftController = require('../controllers/giftController');

router.get('/', protect, giftController.getAllGifts);
router.post('/', protect, giftController.createGift);
router.get('/:id', giftController.getAllGifts);
router.patch('/:id', protect, giftController.updateGift);
router.delete('/:id', protect, giftController.deleteGift);


module.exports = router;