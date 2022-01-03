
module.exports = Object.freeze({
  AUTH_FAILED: 'Authentication Failed!',
  EMPTY_PASSWORD: 'Password Field Cannot be Empty',
  EMPTY_EMAIL: 'Email/Username Field Cannot be Empty',
  INVALID_EMAIL: 'Invalid Email/Username!',
  INVALID_PASSWORD: 'Invalid Password!',
  ACCOUNT_INACTIVE: 'Inactive Account! Please contact your system admin.',
  USER_NOT_FOUND: 'User Not Found',

  LOGIN_EXP_TIME: '8h',

  LOGGED_IN: 'Logged In',
  LOGGED_OUT: 'Logged Out',
  LOGIN_ERROR: 'Error! Logging in.',
  LOGOUT_ERROR: 'Error! Logging out.',
  LOGIN_SUCCESS: 'Welcome! You Have Successfully Login.',
  LOGOUT_SUCCESS: 'Thank you! You Have Successfully Logout.',

  OFFLINE_STATUS: "You are offline,please online then it will process.",
  ALREADY_JOB_ASSIGN: "Doctor have already assign one job.",
  ITEARTION_N_ASSIGN: "Assign iteration not found!",
  ITEARTION_N_ONCALL: "Oncall iteration not found!",
  IN_PROGRESS_N_ACCEPTED: "The job is in progress, cannot be accepted again.",
  CANCELLED_N_ACCEPTED: "The job is cancelled, cannot be accepted.",
  COMPLETED_N_ACCEPTED: "The job is completed, cannot be accepted.",
  IN_PROGRESS_N_CANCEL_COMPLETED: "The job is not oncall, cannot be cancel or completed.",

  PENDING_N_DENIED: "The job is pending, cannot be denied or completed.",
  CANCELLED_N_DENIED: "The job is cancelled, cannot be denied or cancelled again.",
  COMPLETED_N_DENIED: "The job is completed, cannot be denied or completed again.",
  //eshifa IDs
  AGENT_ROLE_ID: 7,
  ADMIN_ROLE_ID: 1,
  FORRE_MASHWARA_ID: 9,
  IN_PROGRESS: 0,
  PENDING: 1,
  ASSIGNED: 2,
  CANCELLED: 3,
  COMPLETED: 6,
  ONCALL: 7,
  // CALL_COMPLETED: 8,


  ACTIVE: 1,
  IN_ACTIVE: 0,


  ENTER_ID: 'Please Enter ID',
  INVALID_PENDING_ID: 'This is invalid pending job id',

  INVALID_ID: 'Error! Invalid id.',
  BAD_REQUEST: 'Error! Bad request.',

  ERROR_RETRIEVING_RECORD: 'Error! Retreiving Records.',

  SUCCESS_UPDATE: 'Record successfully updated.',
  ERROR_UPDATING_RECORD: 'Error! Updating Record.',
  ERROR_UPDATION_FAILED: 'Something wrong! Updation failed.',

  SUCCESS_DELETION: 'Record successfully deleted.',
  ERROR_DELETION_FAILED: 'Something wrong! deletion failed.',

  ERROR_INSERTION_FAILED: 'Something wrong! Insertion failed.',
  SUCCESS_INSERTION: 'Record successfully added.',

  DB_ERROR: 'Error! Database error is occurred.',

  //Paths 

  USER_IMAGE_PATH: process.env.FMS_URL + 'public/uploads/user-images/',


  CURRENT_PASSWORD: 'Please enter current password',
  NEW_PASSWORD: 'Please enter new password',
  SAME_PASSWORD: 'You are entering same password as your old one!',
  PASSWORD_LENGTH: 'Password must be atleast 6 characters in length!',

  PASSWORD_CHANGED: 'Password Changed Successfully',
  PASSWORD_CHANGED_ERROR: 'Error! Change Password',
  PASSWORD_FORGOT_ERROR: 'Error! Forgot Password',

  CHANGE_PASSWORD: 'Email Sent. Please Check your inbox.',

  ERR_NONE: '0',
  INCORRECT_CURRENT_PASSWORD: 'Incorrect current password.',
  UN_VERIFIED: '0',
  VERIFIED: '1',
  WRONG_SMS_CREDENTAILS: 'wrong sms account credentails!',
  SMS_SUCESSFULLY_SEND: 'ms Successfully Send.',
  EMAIL_ERROR: 'Configuration error ! Contact your system admin. thank you.',
  EMAIL_NOT_REGISTER: 'Email not registered!',
  REGISTERED_AND_SMS_SEND: 'Customer registered, sms send to customer',
  CUSTOMER_VERIFIED: 'Verified successfully.',
  CUSTOMER_NOT_VERIFIED: 'Verification failed.',
  ALREADY_EXISTS_BUT_UNVERIFIED: 'Already exists but unverified, sms send to customer.',
  ALREADY_EXISTS_AND_VERIFIED: 'Already exists and verified',
  UNVERIFIED_RECORD_NOT_FOUND: 'No un-verified record found.',
  SOME_THING_WRONG: 'Something wrong!.',
  USER_ALREADY_EXISTS: 'This email is already exists in users.',
  MOBILE_ALREADY_EXISTS: 'This mobile number is already exists.',
  CNIC_ALREADY_EXISTS: 'This CNIC is already exists.',
  EMAIL_ALREADY_EXISTS: 'This email is already exists.',
  ALREADY_EXISTS: 'already exists.',
  SUCCESS_ENABLED: 'Record successfully enable.',
  ERROR_ENABLED_FAILED: 'Something wrong! enable failed.',
  SUCCESS_DISABLED: 'Record successfully disable.',
  ERROR_DISABLED_FAILED: 'Something wrong! disable failed.',
  SUCCESS_CANCEL: 'Successfully cancelled.',
  ERROR_RECORD_NOT_FOUND: 'Sorry this record not found.',
  RECORD_FOUND: 'Record found.',
  JOB_SERVICES_NOT_FOUND: 'Job services not found!',
  JOB_SUCCESS_COMPLETION: 'Job successfully complete.',
  JOB_FAILED_COMPLETION: 'Job completion failed.',
  NO_PERMISSION: 'No permission to this view.',
  JWT_TOKEN_ERROR: 'Jwt token has not created.',
  AGENT_NOT_EXISTS: 'Agent not exist.',
  USER_NOT_EXISTS: 'This user is not exist.',
  USER_ID_NOT_GEN: 'User id has not created by db!',
  EMPTY_VARIBLES_FOUND: 'Please provide all input fields data.',
  ID_NOT_NUMERIC: 'Id must be numeric value.',
  ID_NOT_EMPTY: 'Your id is empty.',
  RECORD_NOT_FOUND: 'No record found.',
  USER_ID_NOT_FOUND: 'User id  not found!',
});
