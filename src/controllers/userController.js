const h         = require('./../utilities/helper');
const m         = require('./../utilities/message');
const coreModel = require('../models/coreModel');

userController = {};

userController.changeStatus = async (req, res) => {
    returnObj = {};
    try {
        let obj = { active_status: req.body.active_status };
        const result = await coreModel.update(obj, 'tbl_users', { user_id : req.user.user_id }, req.user);
      if (h.exists(result)) {
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

module.exports = userController;
