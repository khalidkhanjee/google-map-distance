const router = require('express').Router();

//Auth controller/middleware
const auth           = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');
const jobsController = require('../controllers/jobsController');

//User controllers
const userController = require('../controllers/userController');

const ver = '/api';

//index routes
router.get(ver + '/', function(req, res){ res.render('index', {title: 'Doctor app is running thank you.'}); });

//Auth rotues
router.post(ver + '/login', authController.login);
router.get(ver + '/logout', authController.logout);

//User routes
router.put(ver + '/change-status',auth.check, userController.changeStatus);

//Jobs routes
router.get(ver + '/new-jobs',auth.check, jobsController.getNewJobs);

module.exports = router;
