const express = require('express');
const router = express.Router();
const { protect, isSuperAdmin } = require('../middlewares/auth');
const {
  registerAdmin,
  loginAdmin,
  authMeAdmin,
  getAdmins,
  deleteAdmin,updateAdmin
} = require('../controllers/adminController');

// Public routes
router.post('/login', loginAdmin);
router.post('/auth_me', authMeAdmin);


// Protected routes
router.delete('/:id', protect, isSuperAdmin, deleteAdmin);

router.get('/users', protect,isSuperAdmin, getAdmins);
router.post('/users',protect,isSuperAdmin, registerAdmin);
router.patch('/users/:id',protect,isSuperAdmin, updateAdmin);

module.exports = router;