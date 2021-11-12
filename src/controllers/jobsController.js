const h = require('./../utilities/helper');
const constants = require("../utilities/constants");
const jobsModel = require('../models/jobsModel');
const coreModel = require('../models/coreModel');

const var_dump = require('var_dump');
const exit = require('exit');
const { ASSIGNED } = require('../utilities/constants');

jobsController = {};

jobsController.getNewJobs = async (req, res) => {
  let returnObj = h.resultObject([], false, 500, constants.ERROR_RETRIEVING_RECORD);
  try {
    let filter = { user_id: req.user.user_id, service_type_id: constants.FORRE_MASHWARA_ID };
    let result = await jobsModel.getNewJobs(filter);
    if (h.checkNotEmpty(result)) {
      returnObj = h.resultObject(result, true, 200, constants.RECORD_FOUND);
    } else {
      returnObj = h.resultObject([], false, 200, constants.RECORD_NOT_FOUND);
    }
  } catch (e) {
    throw e;
  } finally {
    res.status(returnObj.statusCode).send(returnObj);
  }
};

jobsController.getAcceptJobs = async (req, res) => {
  let returnObj = h.resultObject([], false, 500, constants.ERROR_RETRIEVING_RECORD);
  try {
    let filter = { user_id: req.user.user_id, service_type_id: constants.FORRE_MASHWARA_ID };
    let result = await jobsModel.getAcceptJobs(filter);
    if (h.checkNotEmpty(result)) {
      returnObj = h.resultObject(result, true, 200, constants.RECORD_FOUND);
    } else {
      returnObj = h.resultObject([], false, 200, constants.RECORD_NOT_FOUND);
    }
  } catch (e) {
    throw e;
  } finally {
    res.status(returnObj.statusCode).send(returnObj);
  }
};

jobsController.getCompleteJobs = async (req, res) => {
  let returnObj = h.resultObject([], false, 500, constants.ERROR_RETRIEVING_RECORD);
  try {
    let filter = { user_id: req.user.user_id, service_type_id: constants.FORRE_MASHWARA_ID };
    let result = await jobsModel.getCompleteJobs(filter);
    if (h.checkNotEmpty(result)) {
      returnObj = h.resultObject(result, true, 200, constants.RECORD_FOUND);
    } else {
      returnObj = h.resultObject([], false, 200, constants.RECORD_NOT_FOUND);
    }
  } catch (e) {
    throw e;
  } finally {
    res.status(returnObj.statusCode).send(returnObj);
  }
};

jobsController.acceptJob = async (req, res) => {
  let returnObj = h.resultObject([], false, 500, constants.BAD_REQUEST);
  try {
    let obj = h.getProps2(req);
    let iteration_date_time = obj.iteration_date + ' ' + obj.iteration_time;
    let user_id = obj.customer_user_id;
    delete obj.customer_user_id;
    let assignData = { ...obj, user_id: user_id, job_status_id: constants.ASSIGNED, unix_iteration_date_time: Date.parse(iteration_date_time) / 1000, added_by: req.user.user_id };
    const assignJob = await jobsModel.assignJob({ ...obj, job_status_id: constants.IN_PROGRESS }, assignData);
    if (h.exists(assignJob)) {
      returnObj = h.resultObject([], true, 200, constants.SUCCESS_UPDATE);
    } else {
      returnObj = h.resultObject([], false, 404, constants.ERROR_UPDATING_RECORD);
    }
  } catch (e) {
    returnObj = h.resultObject([], false, 500, constants.ERROR_UPDATION_FAILED);
    throw e;
  } finally {
    res.status(returnObj.statusCode).send(returnObj);
  }
};

jobsController.denyJob = async (req, res) => {
  let returnObj = h.resultObject([], false, 500, constants.BAD_REQUEST);
  try {
    let obj = h.getProps2(req);
    const iterationCancel = { job_status_id: constants.CANCELLED, updated_by: req.user.user_id };
    const pendingJob = await jobsModel.iterationCancel({ ...obj, job_status_id: constants.PENDING }, iterationCancel);
    if (h.exists(pendingJob)) {
      returnObj = h.resultObject([], true, 200, constants.SUCCESS_UPDATE);
    } else {
      returnObj = h.resultObject([], false, 404, constants.ERROR_UPDATING_RECORD);
    }
  } catch (e) {
    returnObj = h.resultObject([], false, 500, constants.ERROR_UPDATION_FAILED);
    throw e;
  } finally {
    res.status(returnObj.statusCode).send(returnObj);
  }
};

jobsController.completeJob = async (req, res) => {
  let returnObj = h.resultObject([], false, 500, constants.BAD_REQUEST);
  try {
    let obj = h.getProps2(req);
    const updateData = { job_status_id: constants.COMPLETED, updated_by: req.user.user_id };
    //assign for update iteration where assign iter
    const completeJob = await jobsModel.completeJob({ ...obj, job_status_id: ASSIGNED, agent_id: req.user.agent_id }, updateData);
    if (h.exists(completeJob)) {
      returnObj = h.resultObject([], true, 200, constants.SUCCESS_UPDATE);
    } else {
      returnObj = h.resultObject([], false, 404, constants.ERROR_UPDATING_RECORD);
    }
  } catch (e) {
    returnObj = h.resultObject([], false, 500, constants.ERROR_UPDATION_FAILED);
    throw e;
  } finally {
    res.status(returnObj.statusCode).send(returnObj);
  }
};

module.exports = jobsController;