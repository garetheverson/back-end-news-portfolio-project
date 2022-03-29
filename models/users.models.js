const db = require('../db/connection');
const format = require('pg-format');

exports.selectUsers = () => {
  return db.query('SELECT username FROM users;').then((res) => {
    return res.rows;
  });
};
