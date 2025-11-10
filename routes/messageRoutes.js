const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const messageController = require('../controllers/messageController');

router.get('/', messageController.getAllMessages);
router.post('/',  messageController.createMessage);
router.post('/bulk', protect, messageController.sendBulkMessage);
router.get('/:id', messageController.getAllMessages);
router.patch('/:id', protect, messageController.updateMessage);
router.delete('/:id', protect, messageController.deleteMessage);


module.exports = router;