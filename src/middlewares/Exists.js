const jwt = require("jsonwebtoken");
const h = require("../utilities/helper");
const constants = require("../utilities/constants");
const jobsModel = require('../models/jobsModel');
const { COMPLETED } = require("../utilities/constants");
// const { INVALID_EMAIL } = require("../utilities/constants");

const Exists = {};

Exists.isValidJobID = async (req, res, next) => {
  let returnObj = h.resultObject([], false, 500, constants.BAD_REQUEST);
  try {
    let filter = h.getProps2(req);
    if (h.checkExistsNotEmpty(filter, 'job_id')) {
      const job = await jobsModel.jobExists(filter);
      if (h.checkExistsNotEmpty(job, 'job_id')) {
        req.job = job;
        next();
      } else {
        returnObj = h.resultObject([], false, 404, constants.INVALID_ID);
        res.status(returnObj.statusCode).send(returnObj);
      }
    } else {
      returnObj = h.resultObject([], false, 404, constants.ENTER_ID);
      res.status(returnObj.statusCode).send(returnObj);
    }
  }
  catch (e) {
    res.status(returnObj.statusCode).send(returnObj);
    throw e;
  }
};

Exists.isPendingJobID = async (req, res, next) => {
  let returnObj = h.resultObject([], false, 500, constants.BAD_REQUEST);
  try {
    const { job } = req;
    if (job.job_status_id === constants.PENDING) {
      next();
    } else if (job.job_status_id === constants.IN_PROGRESS) {
      returnObj = h.resultObject([], false, 404, constants.IN_PROGRESS_N_ACCEPTED);
      res.status(returnObj.statusCode).send(returnObj);
    } else if (job.job_status_id === constants.CANCELLED) {
      returnObj = h.resultObject([], false, 404, constants.CANCELLED_N_ACCEPTED);
      res.status(returnObj.statusCode).send(returnObj);
    }
    else if (job.job_status_id === constants.COMPLETED) {
      returnObj = h.resultObject([], false, 404, constants.COMPLETED_N_ACCEPTED);
      res.status(returnObj.statusCode).send(returnObj);
    }
  } catch (e) {
    res.status(returnObj.statusCode).send(returnObj);
    throw e;
  }
};

Exists.isInProgressJobID = async (req, res, next) => {
  let returnObj = h.resultObject([], false, 500, constants.BAD_REQUEST);
  try {
    const { job } = req;
    if (job.job_status_id === constants.IN_PROGRESS) {
      next();
    } else if (job.job_status_id === constants.PENDING) {
      returnObj = h.resultObject([], false, 404, constants.PENDING_N_DENIED);
      res.status(returnObj.statusCode).send(returnObj);
    } else if (job.job_status_id === constants.CANCELLED) {
      returnObj = h.resultObject([], false, 404, constants.CANCELLED_N_DENIED);
      res.status(returnObj.statusCode).send(returnObj);
    }
    else if (job.job_status_id === constants.COMPLETED) {
      returnObj = h.resultObject([], false, 404, constants.COMPLETED_N_DENIED);
      res.status(returnObj.statusCode).send(returnObj);
    }
  } catch (e) {
    res.status(returnObj.statusCode).send(returnObj);
    throw e;
  }
};

Exists.assignIteration = async (req, res, next) => { //assign iteration find by user_id 
  let returnObj = h.resultObject([], false, 500, constants.BAD_REQUEST);
  try {
    const { user } = req;
    const row = await jobsModel.assignIterationExists({ agent_id: user.agent_id, job_status_id: constants.ASSIGNED });
    if (h.checkExistsNotEmptyGreaterZero(row, 'job_detail_id')) {
      next();
    } else {
      returnObj = h.resultObject([], false, 404, constants.ALREADY_JOB_ASSIGN);
      res.status(returnObj.statusCode).send(returnObj);
    }
  } catch (e) {
    res.status(returnObj.statusCode).send(returnObj);
    throw e;
  }
};

Exists.assignService = async (req, res, next) => { //assign iteration find by job_detail_id 
  let returnObj = h.resultObject([], false, 500, constants.BAD_REQUEST);
  try {
    const { user } = req;
    const row = await jobsModel.assignServiceExists({ job_detail_id: req.body.job_detail_id, agent_id: user.agent_id, job_status_id: constants.ASSIGNED });
    if (h.checkExistsNotEmptyGreaterZero(row, 'job_detail_id')) {
      next();
    } else {
      returnObj = h.resultObject([], false, 404, constants.ITEARTION_N_ASSIGN);
      res.status(returnObj.statusCode).send(returnObj);
    }
  } catch (e) {
    res.status(returnObj.statusCode).send(returnObj);
    throw e;
  }
};
module.exports = Exists;