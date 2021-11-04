const h         = require('./../utilities/helper');
const m         = require('./../utilities/message');
const jobsModel = require('../models/jobsModel');
const coreModel = require('../models/coreModel');

const var_dump  = require('var_dump');
const exit      = require('exit');

jobsController = {};

jobsController.getNewJobs = async (req, res) => {
  let returnObj = h.resultObject([], false, 500, m.result_nfound());
  try {
    let filter = { user_id : req.user.user_id, service_type_id :'9' };
    let result = await jobsModel.getNewJobs(filter);
    if (h.checkNotEmpty(result)) {
      returnObj = h.resultObject(result, true, 200, m.result_found());
    } else {
      returnObj = h.resultObject([], false, 404, m.result_nfound());
    }
  } catch (e) {
    throw e;
  } finally {
    res.status(returnObj.statusCode).send(returnObj);
  }
};

jobsController.acceptJob = async (req, res) => {
  returnObj = {};
  try {
    code = 200;
    req.body.job_status_id = m.in_progress();
    const assignJob = await jobsModel.assignJob(req);
    console.log(assignJob);
    if (h.exists(assignJob)) {
      code = 200;
      returnObj = h.resultObject([], true, code, m.success('updated'));
    } else {
      code = 404;
      returnObj = h.resultObject([], false, code, m.result_nfound());
    }
  } catch (e) {
    code = 500;
    returnObj = h.resultObject([], false, code, m.db_error());
    throw e;
  } finally {
    res.status(code).send(returnObj);
  }
};




module.exports = jobsController;