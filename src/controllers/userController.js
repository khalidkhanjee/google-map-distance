const h = require('./../utilities/helper');
const constants = require("../utilities/constants");
const coreModel = require('../models/coreModel');
// const Notification = require("../services/Notification");

userController = {};

userController.changeStatus = async (req, res) => {
  let returnObj = h.resultObject(null, false, 500, constants.BAD_REQUEST);
  try {
    let obj = h.getProps2(req);
    const result = await coreModel.update({ active_status: obj.status }, 'tbl_users', { user_id: req.user.user_id });
    if (h.exists(result)) {
      let row = await coreModel.getOne({ user_id: req.user.user_id, user_role: constants.AGENT_ROLE_ID });
      userData = getUserObject(row);
      returnObj = h.resultObject(userData, true, 200, constants.SUCCESS_UPDATE);
    } else {
      returnObj = h.resultObject(null, true, 404, constants.ERROR_RECORD_NOT_FOUND);
    }
  } catch (e) {
    returnObj = h.resultObject(null, false, 500, constants.DB_ERROR);
    throw e;
  } finally {
    res.status(returnObj.statusCode).send(returnObj);
  }
};

const getUserObject = user => {
  let obj = {
    active_status: user.active_status
  }
  return obj;
}
module.exports = userController;



