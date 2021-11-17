const router = require('express').Router();
const userController = require('../controllers/userController');

router.put('/change', userController.changeStatus);

module.exports = router;

