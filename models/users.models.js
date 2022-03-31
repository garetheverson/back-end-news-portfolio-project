const db = require('../db/connection');
const format = require('pg-format');

exports.selectUsers = () => {
  return db.query('SELECT username FROM users;').then((res) => {
    return res.rows;
  });
};

exports.selectUserByUsername = (username) => {
  const query = `SELECT username FROM users WHERE username = $1;`;
  return db.query(query, [username]).then((res) => {
    const author = res.rows[0];
    if (!author) {
      return Promise.reject({
        msg: `Author '${username}' not found`,
        status: 404,
      });
    }
    return author;
  });
};
