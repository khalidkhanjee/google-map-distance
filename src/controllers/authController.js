const h = require("../utilities/helper");
const constants = require("../utilities/constants");
const authModel = require('../models/authModel');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

authController = {};

authController.login = async (req, res) => {
  let returnObj = h.resultObject([], false, 500, constants.BAD_REQUEST);
  try {
    const postData = h.getProps(req);
    if (!h.checkExistsNotEmpty(postData, 'user_name')) {
      returnObj = h.resultObject([], false, 422, constants.EMPTY_EMAIL);
    } else if (!h.checkExistsNotEmpty(postData, 'user_password')) {
      returnObj = h.resultObject([], false, 422, constants.EMPTY_PASSWORD);
    } else {
      const data = await loginGeneric(postData);
      if (h.checkExistsNotEmpty(data, 'emailNotFound')) {
        returnObj = h.resultObject([], false, 401, constants.INVALID_EMAIL);
      } else if (h.checkExistsNotEmpty(data, 'incorrectPassword')) {
        returnObj = h.resultObject([], false, 401, constants.INVALID_PASSWORD);
      } else if (h.checkExistsNotEmpty(data, 'inActiveUser')) {
        returnObj = h.resultObject([], false, 401, constants.ACCOUNT_INACTIVE);
      } else {
        if (h.exists(data)) {
          const userObject = getUserObject(data);
          token = getToken(userObject);
          returnObj = h.resultObject(token, true, 200, constants.LOGGED_IN);
        } else {
          returnObj = h.resultObject([], false, 200, constants.USER_NOT_FOUND);
        }
      }
    }
  } catch (e) {
    throw e;
  } finally {
    res.status(returnObj.statusCode).send(returnObj);
  }
};

const loginGeneric = async (postData) => {
  try {
    let rows = await authModel.getOne({ ...postData, user_role: constants.AGENT_ROLE_ID });
    if (!h.checkExistsNotEmpty(rows, 'user_name')) {
      return { emailNotFound: true };
    } else {
      const password = postData.user_password;
      const hash = rows.user_password;
      const doesMatch = bcrypt.compareSync(password, hash);
      if (doesMatch) {
        if (rows.user_status != 1) {
          return { inActiveUser: true };
        } else {
          return rows;
        }
      } else {
        return { incorrectPassword: true };
      }
    }
  } catch (e) {
    throw e;
  }
};

const getToken = (userObject) => {
  try {
    const token = jwt.sign({
      user: userObject
    }, process.env.JWT_SECRET, {
      expiresIn: constants.LOGIN_EXP_TIME,
      algorithm: "RS256",
    });
    const resToken = {
      token,
      user: { ...userObject },
      ttl: '5y',
      createdAt: Date.now()
    }
    return resToken;
  } catch (e) {
    throw e;
  }
}

const getUserObject = user => {
  let obj = {
    user_id: user.user_id,
    user_name: user.user_name,
    agent_id: user.agent_id,
    active_status: user.active_status
  }
  return obj;
}

authController.logout = async (req, res) => {
  let code = 500;
  let message = constants.LOGOUT_ERROR;

  try {
    code = 200;
    message = constants.LOGOUT_SUCCESS;
  } catch (e) {
    h.error(e);
  } finally {
    return res.status(code).send({
      statusCode: code,
      message: message
    });
  }
};





module.exports = authController;

