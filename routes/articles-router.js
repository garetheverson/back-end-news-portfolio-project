const {
  getArticleById,
  patchArticleVotesById,
  getArticles,
} = require('../controllers/articles.controllers');

const app = require('express').Router();

// Read: Get Methods
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', getArticles);

// Update: Patch Methods
app.patch('/api/articles/:article_id', patchArticleVotesById);

module.exports = app;
