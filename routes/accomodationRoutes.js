const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const controller = require('../controllers/accomodationController');

router.get('/', protect, controller.getAllAccomodation);
router.post('/', protect, controller.createAccomodation);
router.get('/:id', controller.getAllAccomodation);
router.patch('/:id', protect, controller.updateAccomodation);
router.delete('/:id', protect, controller.deleteAccomodation);


module.exports = router;