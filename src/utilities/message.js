const h = require("./helper");

const message = {};

message.success         = (c) => { return "Record has successfully "+c+"."; } //inserted,updated,deleted.
message.incorrect       = (c) => { return "Your "+c+" is incorrect."; }       //email,password.

message.login_error     = (c) => { return "Error in login!"; }
message.login_success   = (c) => { return "You have login successfully."; }

message.logout_error    = (c) => { return "Error in logout!"; }
message.logout_success  = (c) => { return "You have logout successfully."; }

message.result_error    = (c) => { return "Data fetching error!"; }
message.result_found    = (c) => { return "Records found."; }
message.result_nfound   = (c) => { return "Records not found."; }

message.db_error        = (c) => { return "DB error! Query not executed succesfully."; }


//Job status returns
message.in_progress = () => { return '0'; };
message.pending     = () => { return '1'; };
message.cancelled   = () => { return '3'; };
message.completed   = () => { return '6'; };

module.exports = message;