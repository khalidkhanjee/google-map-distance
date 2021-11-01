const router = require('express').Router();
const h      = require("../utilities/helper");
const coreController = require('../controllers/coreController');
const userController = require('../controllers/authController');

//router.get('/', coreController.getProfile);
// router.get('/login', userController.login);
module.exports = router;

