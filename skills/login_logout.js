const qs = require('querystring');
const axios = require('axios');
const bitbucket = require('../services/bitbucket.service')

module.exports = (controller) => {
    controller.hears('login', 'direct_message', function (bot, message) {

      const bbAuthUrl =
        'https://bitbucket.org/site/oauth2/authorize?' +
        qs.stringify({
          client_id: process.env.BB_OAUTH_KEY,
          response_type: 'code',
          state: message.user,
        });
        controller.storage.users.save({id: message.user, space: message.space.name}).then(() => {
          bot.reply(message, `Linking your account connects your Bitbucket Cloud and Hangouts Chat accounts:\n ${bbAuthUrl}`);
        }).catch((err) => {
          bot.reply(message, `Error during login: ${err}`);
        })
    });

    controller.hears('whoami', 'direct_message', function (bot, message) {
      controller.storage.users.get(message.user, function(err, user_data) {
        if(!user_data || !user_data.account) {
          bot.reply(message, 'I don\'t know you yet. Please `login` !');
        }
        else {
          bot.reply(message, `You're currently logged in to Bitbucket Cloud as ${user_data.account.display_name}. Type \` logout\` to unlink this account.`)
        }
      });
    });

    controller.hears('logout', 'direct_message', function (bot, message) {
      controller.storage.users.save({id: message.user}).then(() => {
        bot.reply(message, `You're successfully logout from Bitbucket Cloud. Use \`login\` to log again.`)
      }).catch((err) => {
        bot.reply(message, `Error during logout: ${err}`);
      })
    });
}
