const h    = require('../utilities/helper');
const knex = require('../config/knex');

const userModel = {};

userModel.getUsers = async () => {
    const result = await knex('tbl_users').join('tbl_customers', 'tbl_users.user_id', '=', 'tbl_customers.user_id')
    .select('tbl_users.user_id', 'tbl_customers.first_name')
    return result;
}

userModel.getSingleUser = async (params) => {
    const result = await knex('tbl_users').where({
      user_name : params.user_name
    }).select('user_id','user_name','user_password')
      .first()
      .then(res => {
        return h.objectKeysToLowerCase(res);
      },
        err => {
          h.error(err);
          throw err;
        }
      );
    return result;
  };

module.exports = userModel;

