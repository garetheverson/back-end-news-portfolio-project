const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
} = require('../controllers/comments.controllers');

const app = require('express').Router();

// Create: Post methods
app.post('/api/articles/:article_id/comments', postCommentByArticleId);

// Read: Get Methods
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

// Delete: Delete Methods
app.delete('/api/comments/:comment_id', deleteCommentById);

module.exports = app;
