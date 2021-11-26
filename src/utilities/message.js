const h = require("./helper");

const message = {};

message.userStatusChanged = (c) => {
  let status = c && c == 1 ? 'online' : 'offline'
  const data = {
    'title': 'Doctor app status changed to ' + status,
    'text': 'Your doctor shifa app status is changed.'
  }
  return data;
}

module.exports = message;