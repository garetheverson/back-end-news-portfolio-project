const db = require('../db/connection');
const format = require('pg-format');

exports.selectArticleById = (article_id) => {
  const query = `SELECT u.username as author, a.title,a.article_id, a.body,a.topic,a.created_at, a.votes, COUNT(c.article_id) as comment_count
    FROM articles a
    INNER JOIN  users u
    ON a.author = u.username
    LEFT JOIN comments c
    on a.article_id = c.article_id
    WHERE a.article_id = $1
    GROUP BY u.username, a.title,a.article_id, a.body,a.topic,a.created_at, a.votes;`;

  return db.query(query, [article_id]).then((res) => {
    const article = res.rows[0];
    if (!article) {
      return Promise.reject({
        msg: `Article ${article_id} not found`,
        status: 404,
      });
    }
    return article;
  });
};

exports.selectCommentsByArticleId = (article_id) => {
  const query = `SELECT c.comment_id, c.votes, c.created_at, c.author, c.body
  FROM comments c
  INNER JOIN articles a
  ON c.article_id = a.article_id
  WHERE a.article_id = $1
  ORDER BY c.comment_id ASC`;

  return db.query(query, [article_id]).then((res) => {
    if (!res.rows.length) {
      return Promise.reject({
        msg: `No comments found for article ${article_id}`,
        status: 404,
      });
    }
    return res.rows;
  });
};

exports.updateArticleVotesById = (article_id, inc_votes) => {
  const query = `UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`;

  return db.query(query, [inc_votes, article_id]).then((res) => {
    if (!res.rows.length) {
      return Promise.reject({
        msg: `Article ${article_id} not found`,
        status: 404,
      });
    }
    return res.rows[0];
  });
};
