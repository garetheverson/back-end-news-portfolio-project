const {
  selectArticleById,
  updateArticleVotesById,
  selectCommentsByArticleId,
  selectArticles,
} = require('../models/articles.models');

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

  selectArticleById(article_id)
    .then((res) => {
      return selectCommentsByArticleId(res.article_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
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
