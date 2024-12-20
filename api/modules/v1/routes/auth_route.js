const express = require('express');

const router = express.Router();
const authController = require('../controllers/auth_controller');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/user_details', authController.userDetails);
router.post('/edit_profile', authController.editProfile);
router.post('/logout', authController.logout);

module.exports = router;