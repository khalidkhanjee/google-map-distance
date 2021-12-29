const config = require('../config/config');
const h = require('../utilities/helper');
const constants = require("../utilities/constants");
const jobModel = require('../models/jobModel');
const coreModel = require('../models/coreModel');


const var_dump = require('var_dump');
const exit = require('exit');
const { ASSIGNED } = require('../utilities/constants');

jobController = {};

jobController.getNewJobs = async (req, res) => {
  let returnObj = h.resultObject(null, false, 500, constants.ERROR_RETRIEVING_RECORD);
  try {
    let filter = { user_id: req.user.user_id, service_type_id: constants.FORRE_MASHWARA_ID };
    let result = await jobModel.getNewJobs(filter);
    if (h.checkNotEmpty(result)) {
      getUserImage_url(result);
      console.log('return', result);
      returnObj = h.resultObject(result, true, 200, constants.RECORD_FOUND);
    } else {
      returnObj = h.resultObject(null, false, 200, constants.RECORD_NOT_FOUND);
    }
  } catch (e) {
    throw e;
  } finally {
    res.status(returnObj.statusCode).send(returnObj);
  }
};


jobController.getAcceptJobs = async (req, res) => {
  let returnObj = h.resultObject(null, false, 500, constants.ERROR_RETRIEVING_RECORD);
  try {
    let filter = { user_id: req.user.user_id, service_type_id: constants.FORRE_MASHWARA_ID };
    let result = await jobModel.getAcceptJobs(filter);

    if (h.checkNotEmpty(result)) {
      getUserImage_url(result);
      returnObj = h.resultObject(result, true, 200, constants.RECORD_FOUND);
    } else {
      returnObj = h.resultObject(null, false, 200, constants.RECORD_NOT_FOUND);
    }
  } catch (e) {
    throw e;
  } finally {
    res.status(returnObj.statusCode).send(returnObj);
  }
};

jobController.getCompleteJobs = async (req, res) => {
  let returnObj = h.resultObject(null, false, 500, constants.ERROR_RETRIEVING_RECORD);
  try {
    let filter = { user_id: req.user.user_id, service_type_id: constants.FORRE_MASHWARA_ID };
    let result = await jobModel.getCompleteJobs(filter);
    if (h.checkNotEmpty(result)) {
      getUserImage_url(result);
      returnObj = h.resultObject(result, true, 200, constants.RECORD_FOUND);
    } else {
      returnObj = h.resultObject(null, false, 200, constants.RECORD_NOT_FOUND);
    }
  } catch (e) {
    throw e;
  } finally {
    res.status(returnObj.statusCode).send(returnObj);
  }
};

//create and get user image url 
const getUserImage_url = result => {
  for (const r of result) {
    r.user_image_url = constants.USER_IMAGE_PATH + r.user_image;
    delete r.user_image;
  }
}

jobController.acceptJob = async (req, res) => {
  console.log(req);
  let returnObj = h.resultObject(null, false, 500, constants.BAD_REQUEST);
  try {
    let obj = h.getProps2(req);
    let iteration_date_time = obj.iteration_date + ' ' + obj.iteration_time;
    let user_id = obj.customer_user_id;
    delete obj.customer_user_id;
    let assignData = { ...obj, user_id: user_id, job_status_id: constants.ASSIGNED, unix_iteration_date_time: Date.parse(iteration_date_time) / 1000, added_by: req.user.user_id };
    const assignJob = await jobModel.assignJob({ ...obj, job_status_id: constants.IN_PROGRESS }, assignData);
    if (h.exists(assignJob)) {
      returnObj = h.resultObject(null, true, 200, constants.SUCCESS_UPDATE);
    } else {
      returnObj = h.resultObject(null, false, 404, constants.ERROR_UPDATING_RECORD);
    }
  } catch (e) {
    returnObj = h.resultObject(null, false, 500, constants.ERROR_UPDATION_FAILED);
    throw e;
  } finally {
    res.status(returnObj.statusCode).send(returnObj);
  }
};

jobController.denyJob = async (req, res) => {
  let returnObj = h.resultObject(null, false, 500, constants.BAD_REQUEST);
  try {
    let obj = h.getProps2(req);
    const iterationCancel = { job_status_id: constants.CANCELLED, updated_by: req.user.user_id };
    const pendingJob = await jobModel.iterationCancel({ ...obj, job_status_id: constants.PENDING }, iterationCancel);
    if (h.exists(pendingJob)) {
      returnObj = h.resultObject(null, true, 200, constants.SUCCESS_UPDATE);
    } else {
      returnObj = h.resultObject(null, false, 404, constants.ERROR_UPDATING_RECORD);
    }
  } catch (e) {
    returnObj = h.resultObject(null, false, 500, constants.ERROR_UPDATION_FAILED);
    throw e;
  } finally {
    res.status(returnObj.statusCode).send(returnObj);
  }
};

jobController.completeJob = async (req, res) => {
  let returnObj = h.resultObject(null, false, 500, constants.BAD_REQUEST);
  try {
    let obj = h.getProps2(req);
    const updateData = { job_status_id: constants.COMPLETED, updated_by: req.user.user_id };
    //assign for update iteration where assign iter
    const completeJob = await jobModel.completeJob({ ...obj, job_status_id: ASSIGNED, agent_id: req.user.agent_id }, updateData);
    if (h.exists(completeJob)) {
      returnObj = h.resultObject(null, true, 200, constants.SUCCESS_UPDATE);
    } else {
      returnObj = h.resultObject(null, false, 404, constants.ERROR_UPDATING_RECORD);
    }
  } catch (e) {
    returnObj = h.resultObject(null, false, 500, constants.ERROR_UPDATION_FAILED);
    throw e;
  } finally {
    res.status(returnObj.statusCode).send(returnObj);
  }
};


jobController.firebase = async (req, res) => {
  let returnObj = h.resultObject(null, false, 500, constants.BAD_REQUEST);
  try {
    const db = await config.ref('users').child('193').child('jobs').child('94712').update({ job_status: 'Inprogress' });
  } catch (e) {
    returnObj = h.resultObject(null, false, 500, constants.ERROR_UPDATION_FAILED);
    throw e;
  } finally {
    res.status(returnObj.statusCode).send(returnObj);
  }
};

// $this -> database -> getReference('users') -> getChild($jobUser -> customer_user_id) -> getChild('jobs') -> getChild($job_id) -> update($jobs_data)
module.exports = jobController;