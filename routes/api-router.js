const { getAPI } = require('../controllers/api.controllers');
const apiRouter = require('express').Router();

apiRouter.get('/api', getAPI);

module.exports = apiRouter;
