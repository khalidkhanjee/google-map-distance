const h = require('./../utilities/helper');
const constants = require("../utilities/constants");
const coreModel = require('../models/coreModel');

userController = {};

userController.changeStatus = async (req, res) => {
    let returnObj = h.resultObject(null, false, 500, constants.BAD_REQUEST);
    try {
        let obj = h.getProps2(req);
        const result = await coreModel.update({ active_status: obj.status }, 'tbl_users', { user_id: req.user.user_id });
        if (h.exists(result)) {
            returnObj = h.resultObject(null, true, 200, constants.SUCCESS_UPDATE);
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

module.exports = userController;
