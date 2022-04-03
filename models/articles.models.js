const db = require('../db/connection');
const format = require('pg-format');

// Read: SELECT models
exports.selectArticleById = (article_id) => {
  const query = `SELECT u.username as author, a.title,a.article_id, a.body,a.topic,a.created_at, a.votes, COUNT(c.article_id)::int as comment_count
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

exports.selectArticles = (sort_by = 'created_at', order = 'desc', topic) => {
  let sortByVal = sort_by;
  if (sortByVal === 'comment_count') {
    sortByVal = 'COUNT(c.article_id)::int';
  }

  let queryStr = `SELECT u.username as author, a.title,a.article_id, a.topic,a.created_at, a.votes, COUNT(c.article_id)::int as comment_count
  FROM articles a
  INNER JOIN  users u
  ON a.author = u.username
  LEFT JOIN comments c
  on a.article_id = c.article_id`;

  const queryValues = [];

  if (topic) {
    queryStr += ` WHERE topic = $1`;
    queryValues.push(topic);
  }

  queryStr += ` GROUP BY u.username, a.title,a.article_id, a.topic,a.created_at, a.votes ORDER BY ${sortByVal} ${order};`;

  return db.query(queryStr, queryValues).then((res) => {
    return res.rows;
  });
};

exports.isValidArticleColumn = (sort_by = 'created_at') => {
  const validColumn = [
    'author',
    'title',
    'article_id',
    'topic',
    'created_at',
    'votes',
    'comment_count',
  ];
  if (!validColumn.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: `Invalid sort by on ${sort_by}`,
    });
  }
  return sort_by;
};

// Update: UPDATE models
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
