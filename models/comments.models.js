const db = require('../db/connection');
const format = require('pg-format');

// Create: INSERT models
exports.insertCommentByArticleId = (article_id, username, comment_body) => {
  const query = `INSERT into comments (article_id, author, body) 
    VALUES ($1, $2, $3)
    RETURNING *;`;

  return db.query(query, [article_id, username, comment_body]).then((res) => {
    return res.rows[0];
  });
};

// Read: SELECT models
exports.selectCommentsByArticleId = (article_id) => {
  const query = `SELECT comment_id, votes, created_at, author, body
    FROM comments
    WHERE article_id = $1
    ORDER BY comment_id ASC`;

  return db.query(query, [article_id]).then((res) => {
    return res.rows;
  });
};

// DELETE models
exports.deleteCommentByIdModel = (comment_id) => {
  const query = `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`;

  return db.query(query, [comment_id]).then((res) => {
    if (!res.rows.length) {
      return Promise.reject({
        msg: `Comment '${comment_id}' not found`,
        status: 404,
      });
    }
    return res;
  });
};
