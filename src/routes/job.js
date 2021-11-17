
const router = require('express').Router();
const auth = require('../middlewares/Auth');
const exists = require('../middlewares/Exists');

const jobController = require('../controllers/jobController');
//Jobs get routes
router.get('/new', jobController.getNewJobs);
router.get('/accept', jobController.getAcceptJobs);
router.get('/complete', jobController.getCompleteJobs);

//Jobs put routes
router.put('/:job_id/accept', auth.userStatus, exists.isValidJobID, exists.isPendingJobID, exists.haveNoAssignedIteration, jobController.acceptJob);
router.put('/:job_id/deny', auth.userStatus, exists.isValidJobID, exists.isInProgressJobID, exists.haveAssignedIteration, jobController.denyJob);
router.put('/:job_id/complete', auth.userStatus, exists.isValidJobID, exists.isInProgressJobID, exists.isAssignedIteration, jobController.completeJob);

module.exports = router;