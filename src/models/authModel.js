const h = require('../utilities/helper');
const knex = require('../config/knex');

const authModel = {};

authModel.getUsers = async () => {
  const result = await knex('tbl_users').join('tbl_customers', 'tbl_users.user_id', '=', 'tbl_customers.user_id')
    .select('tbl_users.user_id', 'tbl_customers.first_name')
  return result;
}

authModel.getSingleUser = async (params) => {
  const result = await knex('tbl_users').where({
    user_name: params.user_name
  }).select('user_id', 'user_name', 'user_password')
    .first()
    .then(res => h.objectKeysToLowerCase(res), err => { throw err; });
  return result;
};

authModel.getOne = async (params) => {
  const result = knex.select('u.*', 'a.agent_id')
    .from({
      u: 'tbl_users'
    }).join('tbl_agents as a', 'a.user_id', '=', 'u.user_id').modify(qb => {
      if (h.checkExistsNotEmpty(params, 'user_id')) {
        qb.where('u.user_id', params.user_id)
      } else {
        qb.where('u.user_name', params.user_name)
          .andWhere('u.user_role', params.user_role)
      }
    })
    .first()
    .then(res => { return res }, err => { throw err });
  return result;
};

module.exports = authModel;

