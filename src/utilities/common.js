const h = require('./../utilities/helper');
const coreModel = require('../models/coreModel');

const common = {};

common._jobExists = async (job_id) => {
  try {
    let result = await coreModel.jobExists(job_id);
    return result;
  } catch (e) {
    h.error(e);
    return {};
  }
};

module.exports = common;