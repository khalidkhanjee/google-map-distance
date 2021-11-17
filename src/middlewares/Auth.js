const jwt = require("jsonwebtoken");
const h = require("../utilities/helper");
const constants = require("../utilities/constants");
const authModel = require('../models/authModel');

const Auth = {};
Auth.check = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    var verifyOptions = {
      expiresIn: constants.LOGIN_EXP_TIME,
      algorithm: "RS256"
    };
    const start = Date.now();
    let legit = jwt.verify(token, process.env.JWT_PUBLIC, verifyOptions);
    const executionTime = Date.now() - start;
    // h.log(`Token Verified in ${executionTime}ms`);
    req.user = legit.user;
    next();
  } catch (error) {
    returnObj = h.resultObject(null, false, 401, constants.AUTH_FAILED);
    res.status(401).send(returnObj);
  }
};


Auth.userStatus = async (req, res, next) => {
  let returnObj = h.resultObject(null, false, 500, constants.BAD_REQUEST);
  try {
    const { user } = req;
    let row = await authModel.getOne({ user_id: user.user_id });
    if (row.active_status === constants.ACTIVE) {
      next();
    } else if (row.active_status === constants.IN_ACTIVE) {
      returnObj = h.resultObject(null, false, 404, constants.OFFLINE_STATUS);
      res.status(returnObj.statusCode).send(returnObj);
    }
  } catch (e) {
    res.status(returnObj.statusCode).send(returnObj);
    throw e;
  }
};


module.exports = Auth;
