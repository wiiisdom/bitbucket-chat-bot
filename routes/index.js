var express = require('express');
var router = express.Router();
const controller = require('../controllers/bot.controller');

// Creates the endpoint for our bitbucket webhook
router.post('/bot/:room', controller.handle)

// endpoint for Hangouts Chat
router.post('/', controller.chat)


module.exports = router;