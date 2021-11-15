const router = require('express').Router();

//Auth controller/middleware
const auth = require('../middlewares/Auth');
const exists = require('../middlewares/Exists');

const authController = require('../controllers/authController');
const jobsController = require('../controllers/jobsController');

//User controllers
const userController = require('../controllers/userController');

//const ver = '/api';

//index routes
router.get('/', function (req, res) { res.render('index', { title: 'Doctor app is running thank you.' }); });

//Auth rotues
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.use(auth.check);

//Jobs routes
router.get('/job/new', jobsController.getNewJobs);
router.get('/job/accept', jobsController.getAcceptJobs);
router.get('/job/complete', jobsController.getCompleteJobs);


router.put('/job/:job_id/accept', auth.userStatus, exists.isValidJobID, exists.isPendingJobID, exists.haveNoAssignedIteration, jobsController.acceptJob);

router.put('/job/:job_id/deny', auth.userStatus, exists.isValidJobID, exists.isInProgressJobID, exists.haveAssignedIteration, jobsController.denyJob);

router.put('/job/:job_id/complete', auth.userStatus, exists.isValidJobID, exists.isInProgressJobID, exists.isAssignedIteration, jobsController.completeJob);

//User routes
router.put('/user/change', userController.changeStatus);


module.exports = router;
