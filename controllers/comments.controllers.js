const {
  insertCommentByArticleId,
  selectCommentsByArticleId,
  deleteCommentByIdModel,
} = require('../models/comments.models');

const { selectArticleById } = require('../models/articles.models');

const { selectUserByUsername } = require('../models/users.models');

// Create: POST controllers
exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  if (isNaN(article_id)) {
    return next({ status: 400, msg: 'Article ID must be a number' });
  }
  if (!req.body['username']) {
    return next({ status: 400, msg: 'Username missing from post' });
  }
  if (!req.body['body']) {
    return next({ status: 400, msg: 'Comment missing from post' });
  }

  const promises = [
    selectArticleById(article_id),
    selectUserByUsername(username),
    insertCommentByArticleId(article_id, username, body),
  ];

  Promise.all(promises)
    .then((results) => {
      const comment = results[2];
      res.status(201).send({ comment });
    })
    .catch((err) => next(err));
};

// Read: GET controllers
exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  if (isNaN(article_id)) {
    return next({ status: 400, msg: 'Article ID must be a number' });
  }

  const promises = [
    selectCommentsByArticleId(article_id),
    selectArticleById(article_id),
  ];
  Promise.all(promises)
    .then((results) => {
      const comments = results[0];
      res.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

// Delete: DELETE controllers
exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  if (isNaN(comment_id)) {
    return next({ status: 400, msg: 'Comment ID must be a number' });
  }

  deleteCommentByIdModel(comment_id)
    .then((response) => {
      res.status(204).send();
    })
    .catch((err) => next(err));
};
