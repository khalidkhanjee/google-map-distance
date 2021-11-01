const h    = require('./../utilities/helper');
const knex = require('../config/knex');
const coreModel = {};

coreModel.getUsers = async () => {
    const result = await knex('tbl_users').join('tbl_customers', 'tbl_users.user_id', '=', 'tbl_customers.user_id')
    .select('tbl_users.user_id', 'tbl_customers.first_name')
    return result;
}

coreModel.update = async (params, table, where) => {
    const updated = await knex(table).returning().where(where).update(params).catch(err => {
        throw err;
    });
    return h.objectKeysToLowerCase(updated);
};



// coreModel.insert = async (params, table, sess_user) => {
//     // const inserted = await knex(table).returning('*').insert(params).toString();
//     // console.log(inserted);
//     const inserted = await knex(table).returning('*').insert(params).catch(err => {
//       throw err;
//     });
//     return h.objectKeysToLowerCase(inserted);
// };


module.exports = coreModel;