const router = require('express').Router();
const authController = require('../controllers/authController');
const exists = require('../middlewares/Exists');

//Auth rotues
router.post('/login', authController.login);
router.put('/logout/:user_id', exists.isValidUser, authController.logout);

module.exports = router;