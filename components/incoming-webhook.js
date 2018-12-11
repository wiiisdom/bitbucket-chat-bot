const request = require('request');
const hook_controller = require('../controllers/bitbucket_hook.controller.js')
const oauth_controller = require('../controllers/bitbucket_oauth.controller.js')

module.exports = function(webserver, controller) {
    // Receive post data from bitbucket, this will be the messages you receive
    webserver.post('/bitbucket/:room', (req, res) => hook_controller(req, res, controller))
    webserver.get('/bitbucket/oauth', (req, res) => oauth_controller(req, res, controller))
}