const router = require('express').Router();

//Auth controller/middleware
const auth           = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');
const jobsController = require('../controllers/jobsController');

//User controllers
const userController = require('../controllers/userController');

//const ver = '/api';

//index routes
router.get('/', function(req, res){ res.render('index', {title: 'Doctor app is running thank you.'}); });

//Auth rotues
router.post('/login', authController.login);
router.get('/logout', authController.logout);

//User routes
router.put('/change-status',auth.check, userController.changeStatus);

//Jobs routes
router.get('/new-jobs',auth.check, jobsController.getNewJobs);
router.put('/accept-job',auth.check, jobsController.acceptJob);


module.exports = router;
