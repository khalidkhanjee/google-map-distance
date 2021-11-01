const h         = require('./../utilities/helper');
const m         = require('./../utilities/message');
const jobsModel = require('../models/jobsModel');
const var_dump  = require('var_dump');
const exit      = require('exit');

jobsController = {};

jobsController.getNewJobs = async (req, res) => {
  returnObj = {};
  try {
    let filter = { user_id : req.user.user_id,service_type_id :'9' };
    let result = await jobsModel.getNewJobs(filter);
    if (h.checkNotEmpty(result)) {
      code = 200;
      returnObj = h.resultObject(result, true, code, m.result_found());
    } else {
      code = 404;
      returnObj = h.resultObject([], false, code, m.result_nfound());
    }
  } catch (e) {
    let code = 500;
    returnObj = h.resultObject([], false, code, m.result_error());
    throw e;
  } finally {
    res.status(code).send(returnObj);
  }
};


module.exports = jobsController;