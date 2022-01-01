const config = require('../config/config');
const h = require('../utilities/helper');
const constants = require("../utilities/constants");
const jobModel = require('../models/jobModel');
const coreModel = require('../models/coreModel');


const var_dump = require('var_dump');
const exit = require('exit');
const { ASSIGNED } = require('../utilities/constants');
const { constant } = require('underscore');

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

jobController.getOncallJobs = async (req, res) => {
  let returnObj = h.resultObject(null, false, 500, constants.ERROR_RETRIEVING_RECORD);
  try {
    let filter = { user_id: req.user.user_id, service_type_id: constants.FORRE_MASHWARA_ID };
    let result = await jobModel.getOncallJobs(filter);
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
  // console.log(req);
  let returnObj = h.resultObject(null, false, 500, constants.BAD_REQUEST);
  try {
    let obj = h.getProps2(req);
    let iteration_date_time = obj.iteration_date + ' ' + obj.iteration_time;
    let customer_user_id = obj.customer_user_id;
    delete obj.customer_user_id;

    let assignData = { ...obj, user_id: customer_user_id, job_status_id: constants.ASSIGNED, unix_iteration_date_time: Date.parse(iteration_date_time) / 1000, added_by: req.user.user_id };
    let iterationLogs = { job_status_id: constants.ASSIGNED, added_by: req.user.user_id, log_description: 'Doctor accepted this job.' };
    const assignJob = await jobModel.assignJob({ ...obj, job_status_id: constants.IN_PROGRESS }, assignData, iterationLogs);

    if (h.exists(assignJob)) {
      const firebaseInprogress = config.ref('users').child(customer_user_id).child('jobs').child(obj.job_id).update({ job_status: 'Inprogress' });
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
    let customer_user_id = obj.customer_user_id;

    const iterationCancel = { job_status_id: constants.CANCELLED, updated_by: req.user.user_id };
    let iterationLogs = { job_status_id: constants.CANCELLED, added_by: req.user.user_id, log_description: 'Doctor denied this job.' };

    const pendingJob = await jobModel.iterationCancel({ ...obj, job_status_id: constants.PENDING }, iterationCancel, iterationLogs);
    if (h.exists(pendingJob)) {
      const firebasePending = config.ref('users').child(customer_user_id).child('jobs').child(obj.job_id).update({ job_status: 'Pending' });
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

jobController.callStart = async (req, res) => {
  let returnObj = h.resultObject(null, false, 500, constants.BAD_REQUEST);
  try {
    let obj = h.getProps2(req);
    let customer_user_id = obj.customer_user_id;

    const updateData = { job_status_id: constants.ONCALL, updated_by: req.user.user_id };
    let iterationLogs = { job_status_id: constants.ONCALL, added_by: req.user.user_id, log_description: 'Doctor started call for this job' };
    const callStart = await jobModel.callStart({ ...obj, job_status_id: constants.ASSIGNED, agent_id: req.user.agent_id }, updateData, iterationLogs);
    if (h.exists(callStart)) {
      const firebaseOncall = config.ref('users').child(customer_user_id).child('jobs').child(obj.job_id).update({ job_status: 'Oncall' });
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

jobController.cancelJob = async (req, res) => {
  let returnObj = h.resultObject(null, false, 500, constants.BAD_REQUEST);
  try {
    let obj = h.getProps2(req);
    let customer_user_id = obj.customer_user_id;
    const updateData = { job_status_id: constants.CANCELLED, updated_by: req.user.user_id };

    let iterationLogs = { job_status_id: constants.CANCELLED, added_by: req.user.user_id, log_description: 'Doctor cancel this job.' };

    const cancelJob = await jobModel.cancelJob({ ...obj, job_status_id: constants.ONCALL, agent_id: req.user.agent_id }, updateData, iterationLogs);
    if (h.exists(cancelJob)) {
      const firebasePending = config.ref('users').child(customer_user_id).child('jobs').child(obj.job_id).update({ job_status: 'Cancalled' });
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
    let customer_user_id = obj.customer_user_id;
    const updateData = { job_status_id: constants.COMPLETED, updated_by: req.user.user_id };
    //assign for update iteration where assign iter
    let iterationLogs = { job_status_id: constants.COMPLETED, added_by: req.user.user_id, log_description: 'Doctor completed this job.' };

    const completeJob = await jobModel.completeJob({ ...obj, job_status_id: constants.ONCALL, agent_id: req.user.agent_id }, updateData, iterationLogs);
    if (h.exists(completeJob)) {
      const firebasePending = config.ref('users').child(customer_user_id).child('jobs').child(obj.job_id).update({ job_status: 'Completed' });
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