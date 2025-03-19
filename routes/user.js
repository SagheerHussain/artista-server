const express = require('express');
const router = express.Router();

const { getUsers, getUserDetails, updateUserProfile, deleteUserAccount } = require('../controllers/user');

const { authenticateToken, admin } = require('../middlewares/authorization');
const upload = require('../upload');

router.get('/', authenticateToken, admin, getUsers);
router.get('/profile/:id', authenticateToken, getUserDetails);
router.put('/update/:id', authenticateToken, upload.single("profilePicture"), updateUserProfile);
router.delete('/delete/:id', authenticateToken, admin, deleteUserAccount);

module.exports = router;