const h = require('./../utilities/helper');
const knex = require('../config/knex');
const coreModel = {};

coreModel.update = async (params, table, where) => {
  //console.log("param", params);
  const updated = await knex(table).returning().where(where).update(params).catch(err => {
    throw err;
  });
  return updated
    ;
};


coreModel.getOne = async (params) => {
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

module.exports = coreModel;