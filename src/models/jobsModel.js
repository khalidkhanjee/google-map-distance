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
  
  module.exports = jobsModel;