const {
  selectArticleById,
  updateArticleVotesById,
  selectCommentsByArticleId,
  selectArticles,
  insertCommentByArticleId,
} = require('../models/articles.models');

const { selectUserByUsername } = require('../models/users.models');

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => next(err));
};

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

exports.patchArticleVotesById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (inc_votes === undefined) {
    return next({ status: 400, msg: 'Missing valid inc_votes' });
  }
  if (isNaN(article_id)) {
    return next({ status: 400, msg: 'Article ID must be a number' });
  }
  if (isNaN(inc_votes)) {
    return next({ status: 400, msg: 'Votes property must be a number' });
  }
  updateArticleVotesById(article_id, inc_votes)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => next(err));
};
