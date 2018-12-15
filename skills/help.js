const qs = require('querystring');
const axios = require('axios');
const bitbucket = require('../services/bitbucket.service')

module.exports = (controller) => {

    controller.on(['direct_message', 'message_received'],  (bot, message) => {
      console.log(bot)

      bot.reply(message, '*Here are the commands that I understand:*\n'+
        '`connect <repository-url>`: Create a subscription to a repository that you can administer\n' +
        '`login`: Link your Bitbucket Cloud account to your Hangouts Chat account (only on DM)\n' +
        '`logout`: Unlink your Bitbucket Cloud account from your Hangouts Chat account (only on DM)\n' +
        '`whoami`: Check which Bitbucket Cloud user you\'re logged in as (only on DM)\n' +
        '~`feedback`: Tell us what you think about the app~\n' +
        '`list`: List all repositories connected to this channel\n' +
        '~`mentions <on|off>`: Disable or enable user mentions~\n' +
        '`help`: Show this message\n' +
        'For more details, check out the documentation. But there is no doc yet.\n');
    });

}
