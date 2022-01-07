const router = require('express').Router();
const userController = require('../controllers/userController');

router.put('/change', userController.changeStatus);
// router.post('/getDeviceToken', userController.getDeviceToken);

module.exports = router;

