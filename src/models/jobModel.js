const h = require('../utilities/helper');
const knex = require('../config/knex');
const constants = require('../utilities/constants');
const jobsModel = {};

// let table = 'tbl_jobs';

jobsModel.getNewJobs = async (filter) => {
  const result = knex.select('j.job_id', 'd.job_detail_id', 'j.customer_user_id', 'j.job_status_id', 'j.status_title', 'j.customer_name', 'j.user_image', 'j.service_type_name', 'j.gender', 'j.contact_number', 'j.city_name', 'j.job_date_time')
    .from({
      j: 'vu_doctor_new_jobs'
    }).join('tbl_job_detail as d', 'd.job_id', '=', 'j.job_id').modify(function (qb) {
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

jobsModel.jobExists = async (params) => {
  const result = await knex.select('*')
    .from({
      j: 'tbl_jobs'
    }).modify(qb => {
      if (h.checkExistsNotEmpty(params, 'job_status_id')) {
        qb.where('j.job_id', params.job_id)
          .andWhere('j.job_status_id', params.job_status_id)
      } else {
        qb.where('j.job_id', params.job_id)
      }
    }).first()
    .then(res => res, err => { throw err });
  return result;
};

jobsModel.assignIterationExists = async (params) => {
  const result = await knex.select('*')
    .from({
      j: 'vu_doctor_accept_jobs'
    }).modify(qb => {
      if (h.checkExistsNotEmpty(params, 'agent_id')) {
        qb.where('j.agent_id', params.agent_id)
      }
    }).first()
    .then(res => res, err => { throw err });
  return result;
};

jobsModel.isAssignedIteration = async (params) => {
  const result = await knex.select('*')
    .from({
      j: 'vu_doctor_accept_jobs'
    }).modify(qb => {
      if (h.checkExistsNotEmpty(params, 'agent_id')) {
        qb.where('j.job_detail_id', params.job_detail_id)
          .andWhere('j.agent_id', params.agent_id)
      }
    }).first()
    .then(res => res, err => { throw err });
  return result;

};

jobsModel.isOncallIteration = async (params) => {
  const result = await knex.select('*')
    .from({
      j: 'vu_doctor_oncall_jobs'
    }).modify(qb => {
      if (h.checkExistsNotEmpty(params, 'agent_id')) {
        qb.where('j.job_detail_id', params.job_detail_id)
          .andWhere('j.agent_id', params.agent_id)
      }
    }).first()
    .then(res => res, err => { throw err });
  return result;

};


jobsModel.getAcceptJobs = async (filter) => {
  const result = knex.select('j.job_id', 'd.job_detail_id', 'j.customer_user_id', 'j.job_status_id', 'j.status_title', 'j.service_type_name', 'j.user_image', 'j.customer_name', 'j.gender', 'j.contact_number', 'j.city_name', 'j.job_date_time')
    .from({
      j: 'vu_doctor_accept_jobs'
    }).join('tbl_job_detail as d', 'd.job_id', '=', 'j.job_id').modify(function (qb) {
      if (h.exists(filter.service_type_id)) {
        qb.where('j.service_type_id', filter.service_type_id);
      }
    }).then(res => {
      return res;
    },
      err => {
        h.error(err);
        throw err;
      }
    );
  return result;
};

jobsModel.getOncallJobs = async (filter) => {
  const result = knex.select('j.job_id', 'd.job_detail_id', 'j.customer_user_id', 'j.job_status_id', 'j.status_title', 'j.user_image', 'j.service_type_name', 'j.customer_name', 'j.gender', 'j.contact_number', 'j.city_name', 'j.job_date_time')
    .from({
      j: 'vu_doctor_oncall_jobs'
    }).join('tbl_job_detail as d', 'd.job_id', '=', 'j.job_id').modify(function (qb) {
      if (h.exists(filter.service_type_id)) {
        qb.where('j.service_type_id', filter.service_type_id);
      }
    }).then(res => {
      return res;
    },
      err => {
        h.error(err);
        throw err;
      }
    );
  return result;
};

jobsModel.getCompleteJobs = async (filter) => {
  const result = knex.select('j.job_id', 'd.job_detail_id', 'j.customer_user_id', 'j.job_status_id', 'j.status_title', 'j.user_image', 'j.service_type_name', 'j.customer_name', 'j.gender', 'j.contact_number', 'j.city_name', 'j.job_date_time')
    .from({
      j: 'vu_doctor_complete_jobs'
    }).join('tbl_job_detail as d', 'd.job_id', '=', 'j.job_id').modify(function (qb) {
      if (h.exists(filter.service_type_id)) {
        qb.where('j.service_type_id', filter.service_type_id);
      }
    }).then(res => {
      return res;
    },
      err => {
        h.error(err);
        throw err;
      }
    );
  return result;
};



jobsModel.assignJob = async (params, assignData, logsData) => {
  const where = { job_id: params.job_id };
  const status = { job_status_id: params.job_status_id };
  const job_detail_id = { job_detail_id: params.job_detail_id };
  // console.log(status);
  delete assignData.job_id;
  try {
    return await knex.transaction(async (trx) => {
      if (h.checkExistsNotEmptyGreaterZero(params, 'job_id')) {
        await knex.table('tbl_jobs')
          .where(where)
          .update(status)
          .transacting(trx);
        await knex.table('tbl_job_detail')
          .where(where)
          .update(status)
          .transacting(trx);
        await knex('tbl_job_iterations').insert(assignData).transacting(trx);
        const getIterationId = knex('tbl_job_iterations').max('iteration_id').where(job_detail_id).andWhere({ job_status_id: logsData.job_status_id });
        const iterationLogs = { ...logsData, iteration_id: getIterationId };
        await knex('tbl_job_iteration_logs').insert(iterationLogs).transacting(trx);
      }
      return h.objectKeysToLowerCase(trx);
    })
  } catch (e) {
    throw e;
  }
};

jobsModel.iterationCancel = async (params, cancelData, logsData) => {
  const where = { job_id: params.job_id };
  const status = { job_status_id: params.job_status_id };
  const job_detail_id = { job_detail_id: params.job_detail_id };
  try {
    return await knex.transaction(async (trx) => {
      if (h.checkExistsNotEmptyGreaterZero(params, 'job_id') && h.checkExistsNotEmptyGreaterZero(params, 'job_detail_id')) {
        await knex.table('tbl_jobs')
          .where(where)
          .update(status)
          .transacting(trx);
        await knex.table('tbl_job_detail')
          .where(where)
          .update(status)
          .transacting(trx);
        await knex.table('tbl_job_iterations')
          .where(job_detail_id)
          .update(cancelData)
          .transacting(trx);
        const getIterationId = knex('tbl_job_iterations').max('iteration_id').where(job_detail_id).andWhere({ job_status_id: logsData.job_status_id });
        const iterationLogs = { ...logsData, iteration_id: getIterationId };
        await knex('tbl_job_iteration_logs').insert(iterationLogs).transacting(trx);
      }
      return h.objectKeysToLowerCase(trx);
    })
  } catch (e) {
    throw e;
  }
};

jobsModel.callStart = async (params, updateData, logsData) => {

  const job_detail_id = { job_detail_id: params.job_detail_id };
  const where_iteration = { agent_id: params.agent_id, job_detail_id: params.job_detail_id, job_status_id: params.job_status_id };
  try {
    return await knex.transaction(async (trx) => {
      if (h.checkExistsNotEmptyGreaterZero(params, 'job_id') && h.checkExistsNotEmptyGreaterZero(params, 'job_detail_id')) {
        await knex.table('tbl_job_iterations')
          .where(where_iteration)
          .update(updateData)
          .transacting(trx);
        const getIterationId = knex('tbl_job_iterations').max('iteration_id').where(job_detail_id).andWhere({ job_status_id: logsData.job_status_id });
        const iterationLogs = { ...logsData, iteration_id: getIterationId };
        await knex('tbl_job_iteration_logs').insert(iterationLogs).transacting(trx);
      }
      return h.objectKeysToLowerCase(trx);
    })
  } catch (e) {
    throw e;
  }
};

jobsModel.cancelJob = async (params, updateData, logsData) => {
  const job_id = { job_id: params.job_id };
  const job_detail_id = { job_detail_id: params.job_detail_id };
  const where_iteration = { agent_id: params.agent_id, job_detail_id: params.job_detail_id, job_status_id: params.job_status_id };
  // const job_detail_id = {  };
  try {
    return await knex.transaction(async (trx) => {
      if (h.checkExistsNotEmptyGreaterZero(params, 'job_id') && h.checkExistsNotEmptyGreaterZero(params, 'job_detail_id')) {
        await knex.table('tbl_jobs')
          .where(job_id)
          .update(updateData)
          .transacting(trx);
        await knex.table('tbl_job_detail')
          .where(job_id)
          .update(updateData)
          .transacting(trx);
        await knex.table('tbl_job_iterations')
          .where(where_iteration)
          .update(updateData)
          .transacting(trx);
        const getIterationId = knex('tbl_job_iterations').max('iteration_id').where(job_detail_id).andWhere({ job_status_id: logsData.job_status_id });
        const iterationLogs = { ...logsData, iteration_id: getIterationId };
        await knex('tbl_job_iteration_logs').insert(iterationLogs).transacting(trx);
      }
      return h.objectKeysToLowerCase(trx);
    })
  } catch (e) {
    throw e;
  }
};

jobsModel.completeJob = async (params, updateData, logsData) => {
  const job_id = { job_id: params.job_id };
  const job_detail_id = { job_detail_id: params.job_detail_id };
  const where_iteration = { agent_id: params.agent_id, job_detail_id: params.job_detail_id, job_status_id: params.job_status_id };
  // const job_detail_id = {  };
  try {
    return await knex.transaction(async (trx) => {
      if (h.checkExistsNotEmptyGreaterZero(params, 'job_id') && h.checkExistsNotEmptyGreaterZero(params, 'job_detail_id')) {
        await knex.table('tbl_jobs')
          .where(job_id)
          .update(updateData)
          .transacting(trx);
        await knex.table('tbl_job_detail')
          .where(job_id)
          .update(updateData)
          .transacting(trx);
        await knex.table('tbl_job_iterations')
          .where(where_iteration)
          .update(updateData)
          .transacting(trx);
        const getIterationId = knex('tbl_job_iterations').max('iteration_id').where(job_detail_id).andWhere({ job_status_id: logsData.job_status_id });
        const iterationLogs = { ...logsData, iteration_id: getIterationId };
        await knex('tbl_job_iteration_logs').insert(iterationLogs).transacting(trx);
      }
      return h.objectKeysToLowerCase(trx);
    })
  } catch (e) {
    throw e;
  }
};

module.exports = jobsModel;