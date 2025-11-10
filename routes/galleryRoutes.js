const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const galleryController = require('../controllers/galleryController');

router.get('/:id', galleryController.getAllImages);
router.get('/', protect, galleryController.getAllImages);
router.post('/', protect, galleryController.uploadImage);
router.patch('/:id', protect, galleryController.updateImage);
router.delete('/:id', protect, galleryController.deleteImage);


module.exports = router;