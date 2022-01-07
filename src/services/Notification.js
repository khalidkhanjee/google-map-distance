const fetchP = import('node-fetch').then(mod => mod.default)
const fetch = (...args) => fetchP.then(fn => fn(...args))

const Notification = {};

Notification.firePushNotification = async (params = {}) => {
  const notification_body = {
    'notification': { 'title': params.title, 'body': params.body },
    'registration_ids': params.device_token
  }
  fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    body: JSON.stringify(notification_body),
    headers: {
      'Authorization': 'key=' + process.env.FB_AUTHORIZATION_KEY,
      'Content-Type': 'application/json'
    }
  }).then(res => { return true })
    .then(json => console.log(json))
    .catch(err => console.log(err));
};

module.exports = Notification;


//Calling functions
// const Notification = require("../services/Notification");
// const user = await coreModel.getDeviceToken({ user_id: '199' });
// const aa = Notification.firePushNotification({ device_token: [user.device_token], notification: '' });
