const express = require('express');
const {
  getTopics,
  getArticleById,
} = require('./controllers/topics.controllers');

const app = express();
// app.use(express.json());

// Methods
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);

// Handle path not found errors
app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Path not found' });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

// Handle unexpected errors
app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Invalid Data Type' });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: 'Internal server error' });
});

module.exports = app;
