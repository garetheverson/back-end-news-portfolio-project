const express = require('express');
const format = require('pg-format');
const { getTopics } = require('./controllers/topics.controllers');

const app = express();
app.use(express.json());

// Methods
app.get('/api/topics', getTopics);

// Handle unexpected errors
app.use((err, req, res, next) => {
  res.status(500).send({ msg: 'Internal server error' });
});

module.exports = app;
