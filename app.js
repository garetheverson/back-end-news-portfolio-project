//Routers
const express = require('express');
const apiRouter = require('./routes/api-router');
const articlesRouter = require('./routes/articles-router');
const commentsRouter = require('./routes/comments-router');
const topicsRouter = require('./routes/topics-router');
const usersRouter = require('./routes/users-router');
const cors = require('cors');

const app = express();
app.use(express.json());

// app.use CORS
app.use(cors());

// app.use routers
app.use(apiRouter);
app.use(articlesRouter);
app.use(commentsRouter);
app.use(topicsRouter);
app.use(usersRouter);

// Route paths
app.use('/api', apiRouter);

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
