const qs = require('querystring');

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

    controller.on('message_received',  (bot, message) => {
        bot.reply(message, `You said '${message.text}'`);
    });

    controller.on('direct_message',  (bot, message) => {
      bot.reply(message, '*Here are the commands that I understand:*\n'+
        '`connect <repository-url>`: Create a subscription to a repository that you can administer\n' +
        '`login`: Link your Bitbucket Cloud account to your Hangouts Chat account\n' +
        '`logout`: Unlink your Bitbucket Cloud account from your Hangouts Chat account\n' +
        '`whoami`: Check which Bitbucket Cloud user you\'re logged in as\n' +
        '`feedback`: Tell us what you think about the app\n' +
        '`list`: List all repositories connected to this channel\n' +
        '`mentions <on|off>`: Disable or enable user mentions\n' +
        '`help`: Show this message\n' +
        'For more details, check out the documentation.\n');
    });

}
