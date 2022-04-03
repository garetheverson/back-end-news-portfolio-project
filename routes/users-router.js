const { getUsers } = require('../controllers/users.controllers');

const app = require('express').Router();

// Read: Get Methods
app.get('/api/users', getUsers);

module.exports = app;
