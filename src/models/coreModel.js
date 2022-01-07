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

coreModel.insert = async (table_name, data) => {
  // console.log(data);
  try {
    return await knex.transaction(async (trx) => {
      if (h.checkNotEmpty(table_name) && h.checkNotEmpty(data)) {
        console.log('testing');
        await knex(table_name).insert(data).transacting(trx);
      }
      return trx;
    })
  } catch (e) {
    throw e;
  }
};

coreModel.getDeviceToken = async (params) => {
  const result = knex.select('u.device_token')
    .from({
      u: 'tbl_users',
    }).modify(qb => { qb.where('u.user_id', params.user_id).first() })
    .then(res => { return res }, err => { throw err });
  return result;
};


coreModel.getOne = async (params) => {
  const result = knex.select('u.*')
    .from({
      u: 'vu_doctors_users'
    }).modify(qb => {
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