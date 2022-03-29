const db = require('../db/connection');
const format = require('pg-format');

exports.selectTopics = () => {
  return db.query('SELECT * FROM topics;').then((res) => {
    return res.rows;
  });
};

exports.selectArticleById = (article_id) => {
  const query = `SELECT u.username as author, a.title,a.article_id, a.body,a.topic,a.created_at, a.votes
    FROM articles a
    INNER JOIN  users u
    ON a.author = u.username
    WHERE a.article_id = $1`;

  return db.query(query, [article_id]).then((res) => {
    if (!res.rows.length) {
      return Promise.reject({ msg: 'Article not found', status: 404 });
    }
    return res.rows[0];
  });
};
