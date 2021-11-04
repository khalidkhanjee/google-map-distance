const h         = require("../utilities/helper");
const m         = require("../utilities/message");
const authModel = require('../models/authModel');
const jwt       = require("jsonwebtoken");
const bcrypt    = require('bcrypt');

authController = {};

authController.login = async (req, res) => {
  
  let returnObj = '';
  let code  = 500,
  message   = m.login_error,
  token     = '',
  data      = '';

  try {
    let rows = await authModel.getSingleUser(req.body);
    if (!h.exists(rows)) {
      code    = 400;
      message = m.incorrect('email');
    } else {
      const password  = req.body.user_password;
      const hash      = rows.user_password;
      const doesMatch = await bcrypt.compare(password, hash);
      if (doesMatch) {
        const userObject  = getUserObject(rows);
        //sign jwt Token
        const getTokenn   = getToken(userObject);
        //token
        // code        = 200;
        // message     = m.login_success();
        data        = getTokenn.data;
        data.token  = getTokenn.accessToken;
        code = 200;
        returnObj = h.resultObject(data, true, code, m.login_success());

      } else {
        code        = 400;
        message     = m.incorrect('password');
      }
    }
  } catch (e) {
    throw e;
  } finally {
    res.status(code).send(returnObj);
  }
};

const getToken = (userObject) => {
  try {
    const token = jwt.sign({
      data: userObject
    }, process.env.JWT_SECRET, {
      expiresIn: '5y',
      algorithm: "RS256",
    });
    const resToken = {
      accessToken: token,
      data: { ...userObject },
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
    user_name: user.user_name   
  }
  return obj;
}

authController.logout = async (req, res) => {
  let code = 500;
  let message = m.logout_error();
  
  try {
    code = 200;
    message = m.logout_success();
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

