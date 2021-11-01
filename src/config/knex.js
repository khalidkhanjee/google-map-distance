const knex = require('knex')({
  client: process.env.DB_CLIENT,
  connection: {
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.MYSQL_DB
  }
});

module.exports = knex;