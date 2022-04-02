const db = require('../db/connection');
const format = require('pg-format');

exports.selectTopics = () => {
  return db.query('SELECT * FROM topics;').then((res) => {
    return res.rows;
  });
};

exports.selectTopicBySlug = (slug) => {
  if (!slug) {
    return;
  }
  const query = `SELECT slug FROM topics WHERE slug = $1;`;
  return db.query(query, [slug]).then((res) => {
    const topic = res.rows[0];
    if (!topic) {
      return Promise.reject({
        msg: `Topic '${slug}' not found`,
        status: 404,
      });
    }
    return topic;
  });
};
