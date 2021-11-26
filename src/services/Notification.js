// const e = require('express');
const fetchP = import('node-fetch').then(mod => mod.default)
const fetch = (...args) => fetchP.then(fn => fn(...args))
const Notification = {};

Notification.firePushNotification = async (params = {}) => {
  const notification_body = {
    'notification': params.notification,
    'registration_ids': params.device_token
  }
  fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    body: JSON.stringify(notification_body),
    headers: {
      'Authorization': 'key=' + process.env.FB_AUTHORIZATION_KEY,
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.log(err));
};

module.exports = Notification;


//Calling functions
//Notification.firePushNotification({ device_token: [req.user.device_token], notification: m.userStatusChanged(obj.status) });