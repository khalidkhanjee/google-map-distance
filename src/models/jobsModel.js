const h    = require('./../utilities/helper');
const knex = require('../config/knex');
const jobsModel = {};

jobsModel.getNewJobs = async (filter) => {
    const result = knex.select('j.job_id','j.service_type_name','j.customer_name','j.gender','j.contact_number','j.city_name','j.job_date_time')
      .from({
        j: 'vu_doctor_new_jobs'
      }).modify(function (qb) {
        if (h.exists(filter.service_type_id)) {
          qb.where('j.service_type_id', filter.service_type_id);
        }
      }).then(res => {
        return h.objectKeysToLowerCase(res);
      },
        err => {
          h.error(err);
          throw err;
        }
      );
    return result;
  };

    //[job_detail_id] => 6680
    // [agent_id] => 126
    // [user_id] => 199
    // [iteration_date] => 2021-11-03
    // [iteration_time] => 02:21 PM
    // [job_status_id] => 2
    // [unix_iteration_date_time] => 1635931260
    // [added_date_time] => 2021-11-03 15:13:02
    // [added_by] => 35

  jobsModel.assignJob = async (req) => {
    const filter = h.getProps2(req);
    const where = { job_id: filter.job_id };
    const status = { job_status_id : filter.job_status_id };
    try {
      return await knex.transaction(async (trx) => {
        if (h.checkExistsNotEmptyGreaterZero(filter, 'job_id')) {
          await knex.table('tbl_jobs')
            .where(where)
            .update(status)
            .transacting(trx);
          await knex.table('tbl_job_detail')
            .where(where)
            .update(status)
            .transacting(trx);
        }
        return h.objectKeysToLowerCase(trx);
      })
    } catch (e) {
      throw e;
    }
  };
  
  module.exports = jobsModel;