const { getTopics } = require('../controllers/topics.controllers');
const app = require('express').Router();

// Read: Get Methods
app.get('/api/topics', getTopics);

module.exports = app;
