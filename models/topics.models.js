const { query } = require('../db/connection');
const db = require('../db/connection');
const format = require('pg-format');

exports.selectTopics = () => {
  return db.query('SELECT * FROM topics;').then((result) => {
    return result.rows;
  });
};
