const config = require('../config/config');
const h = require('../utilities/helper');
const constants = require("../utilities/constants");
const jobModel = require('../models/jobModel');
const coreModel = require('../models/coreModel');
const Notification = require("../services/Notification");

// const var_dump = require('var_dump');
// const exit = require('exit');
// const { ASSIGNED } = require('../utilities/constants');
// const { constant } = require('underscore');

jobController = {};

jobController.getNewJobs = async (req, res) => {
  let returnObj = h.resultObject(null, false, 500, constants.ERROR_RETRIEVING_RECORD);
  try {
    let filter = { user_id: req.user.user_id, service_type_id: constants.FORRE_MASHWARA_ID };
    let result = await jobModel.getNewJobs(filter);
    // console.log(result);
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


jobController.acceptJob = async (req, res) => {
  // console.log(req);
  let returnObj = h.resultObject(null, false, 500, constants.BAD_REQUEST);
  try {
    let obj = h.getProps2(req);
    let iteration_date_time = obj.iteration_date + ' ' + obj.iteration_time;
    let customer_user_id = obj.customer_user_id;
    delete obj.customer_user_id;

    let assignData = { ...obj, agent_id: req.user.agent_id, user_id: customer_user_id, job_status_id: constants.ASSIGNED, unix_iteration_date_time: Date.parse(iteration_date_time) / 1000, added_by: req.user.user_id };

    let iterationLogs = { job_status_id: constants.ASSIGNED, added_by: req.user.user_id, log_description: 'Doctor accepted this job.' };

    const assignJob = await jobModel.assignJob({ ...obj, job_status_id: constants.IN_PROGRESS }, assignData, iterationLogs);

    let iteration_filter = { iteration_id: assignJob, user_id: req.user.user_id, service_type_id: constants.FORRE_MASHWARA_ID };

    let getAcceptJobs = await jobModel.getAcceptJobs(iteration_filter);

    if (h.exists(assignJob) && h.exists(getAcceptJobs)) {
      getUserImage_url(getAcceptJobs);

      FirebaseUN({ job_id: obj.job_id, job_status: 'Inprogress', customer_user_id: customer_user_id, title: constants.JOB_ACCEPTED_TITLE, body: constants.JOB_ACCEPTED_BODY });

      returnObj = h.resultObject(getAcceptJobs, true, 200, constants.SUCCESS_UPDATE);
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
    let iterationLogs = { iteration_id: obj.iteration_id, job_status_id: constants.CANCELLED, added_by: req.user.user_id, log_description: 'Doctor denied this job.' };

    const cancelJob = await jobModel.iterationCancel({ ...obj, job_status_id: constants.ASSIGNED }, iterationCancel, iterationLogs);
    if (h.exists(cancelJob)) {

      FirebaseUN({ job_id: obj.job_id, job_status: 'Pending', customer_user_id: customer_user_id, title: constants.JOB_DENIED_TITLE, body: constants.JOB_DENIED_BODY });

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
    let iterationLogs = { iteration_id: obj.iteration_id, job_status_id: constants.ONCALL, added_by: req.user.user_id, log_description: 'Doctor started call for this job' };
    const callStart = await jobModel.callStart({ ...obj, job_status_id: constants.ASSIGNED, agent_id: req.user.agent_id }, updateData, iterationLogs);

    let job_filter = { iteration_id: obj.iteration_id, user_id: req.user.user_id, service_type_id: constants.FORRE_MASHWARA_ID };
    let getAcceptJobs = await jobModel.getAcceptJobs(job_filter);

    if (h.exists(callStart) && h.checkNotEmpty(getAcceptJobs)) {
      getUserImage_url(getAcceptJobs);

      FirebaseUN({ job_id: obj.job_id, job_status: 'Oncall', customer_user_id: customer_user_id, title: constants.JOB_ONCALL_TITLE, body: constants.JOB_ONCALL_BODY });

      returnObj = h.resultObject(getAcceptJobs, true, 200, constants.SUCCESS_UPDATE);
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

    let iterationLogs = { iteration_id: obj.iteration_id, job_status_id: constants.CANCELLED, added_by: req.user.user_id, log_description: 'Doctor cancel this job.' };

    const cancelJob = await jobModel.cancelJob({ ...obj, job_status_id: constants.ONCALL, agent_id: req.user.agent_id }, updateData, iterationLogs);
    if (h.exists(cancelJob)) {

      FirebaseUN({ job_id: obj.job_id, job_status: 'Cancelled', customer_user_id: customer_user_id, title: constants.JOB_CANCELLED_TITLE, body: constants.JOB_CANCELLED_BODY });

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
    let iterationLogs = { iteration_id: obj.iteration_id, job_status_id: constants.COMPLETED, added_by: req.user.user_id, log_description: 'Doctor completed this job.' };

    const completeJob = await jobModel.completeJob({ ...obj, job_status_id: constants.ONCALL, agent_id: req.user.agent_id }, updateData, iterationLogs);
    if (h.exists(completeJob)) {

      FirebaseUN({ job_id: obj.job_id, job_status: 'Completed', customer_user_id: customer_user_id, title: constants.JOB_COMPLETED_TITLE, body: constants.JOB_COMPLETED_BODY });

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


const FirebaseUN = async (data) => {
  firebaseInprogress = config.ref('users').child(data.customer_user_id).child('jobs').child(data.job_id).update({ job_status: data.job_status });
  const uDtoken = await coreModel.getDeviceToken({ user_id: data.customer_user_id });
  const fireBn = Notification.firePushNotification({ device_token: [uDtoken.device_token], title: data.title, body: data.body });
  const fbData = { activity: data.title, text: data.body, device_token: uDtoken.device_token, user_id: data.customer_user_id };
  insertFBn = await coreModel.insert(fbData, 'tbl_firebasenotifications');
}

//create and get user image url 
const getUserImage_url = result => {
  for (const r of result) {
    r.user_image_url = constants.USER_IMAGE_PATH + r.user_image;
    delete r.user_image;
  }
}

module.exports = jobController;