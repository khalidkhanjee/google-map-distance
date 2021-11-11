const h = require('./../utilities/helper');
const knex = require('../config/knex');
const coreModel = {};

coreModel.update = async (params, table, where) => {
  const updated = await knex(table).returning().where(where).update(params).catch(err => {
    throw err;
  });
  return h.objectKeysToLowerCase(updated);
};

module.exports = coreModel;