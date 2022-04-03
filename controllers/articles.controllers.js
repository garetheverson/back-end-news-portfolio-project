const {
  selectArticleById,
  updateArticleVotesById,
  selectArticles,
  isValidArticleColumn,
} = require('../models/articles.models');

const { selectTopicBySlug } = require('../models/topics.models');

const { isValidOrder } = require('../models/utils.models');

// Read: GET controllers
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  const validParams = ['sort_by', 'order', 'topic'];
  const queryParams = Object.keys(req.query);

  if (!queryParams.every((elem) => validParams.includes(elem))) {
    return next({
      status: 400,
      msg: `Invalid query string index: valid query indexes are 'topic', 'sort_by' and 'order'`,
    });
  }

  const validateQueryParams = [
    isValidArticleColumn(sort_by),
    isValidOrder(order),
    selectTopicBySlug(topic),
  ];

  Promise.all(validateQueryParams)
    .then((res) => {
      return selectArticles(sort_by, order, topic);
    })
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => next(err));
};

// Update: PATCH controllers
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
