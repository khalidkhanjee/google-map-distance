const _ = require('underscore');
 
let helper = {};
helper = _;
helper.log = (...theArgs) => {
  console.log(...theArgs);
};

helper.error = (...theArgs) => {
  console.error(...theArgs);
};

helper.resultObject = (data, status, statuCode, message = "", error = "") => {
  return {
    status: status,
    statusCode: statuCode,
    message: message,
    error: error,
    data: data,
  }
}

helper.checkNotEmpty = (o, f) => {
  if (helper.exists(o) && o != '') {
    return true;
  }
  return false;
};

helper.checkExistsNotEmpty = (o, f) => {
  if (helper.exists(o) && _.has(o, f) && o[f] != '') {
    return true;
  }
  return false;
};

helper.objectKeysToLowerCase = (input) => {
  if (typeof input !== 'object' || input === null) { if (input === null) { return "" } else { return input } }; // null
  if (Array.isArray(input)) return input.map(helper.objectKeysToLowerCase);
  return Object.keys(input).reduce((newObj, key) => {
    let val = input[key];
    let newVal = (typeof val !== 'object') || (Array.isArray(val)) || (Buffer.isBuffer(val)) ? val : helper.objectKeysToLowerCase(val);
    newObj[key.toLowerCase()] = newVal;
    return newObj;
  }, {});
}

helper.exists = (o) => {
  if (typeof o !== 'undefined' && o !== 'undefined' && o !== undefined && o !== null && o !== 'null') {
    return true;
  }
  return false;
};

helper.notExists = (o) => {
  return !helper.exists(o);
};

helper.getProps2 = (o) => {
  let obj = {};
  if (!_.isEmpty(o.params)) {
    obj = Object.assign(obj, o.params);
  }
  if (!_.isEmpty(o.body)) {
    obj = Object.assign(obj, o.body);
  }
  if (!_.isEmpty(o.query)) {
    obj = Object.assign(obj, o.query);
  }
  return obj;
};

module.exports = helper;