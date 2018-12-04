var express = require('express');
var router = express.Router();
const controller = require('../controllers/bot.controller');

// Creates the endpoint for our bitbucket webhook
router.post('/bot/:room', controller.handle)

module.exports = router;