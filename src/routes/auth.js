const router = require('express').Router();
const authController = require('../controllers/authController');

//Auth rotues
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;