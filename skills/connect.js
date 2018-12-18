const qs = require('querystring');
const axios = require('axios');
const bitbucket = require('../services/bitbucket.service')
const bitbucketStorage = require('../services/storage.service')

module.exports = (controller) => {

    // Connect to a repository: create a hook for that repository
    controller.hears('connect https:\/\/bitbucket.org\/(.+?)\/(.+?)\/.*', ['direct_message', 'message_received'], function (bot, message) {
        let username = message.match[1]
        let repo_slug = message.match[2]

          controller.storage.users.get(message.user)
            .then(bitbucket.checkCredentials)
            .then(bitbucket.handleValidToken)
            .then((user_data) => controller.storage.users.save(user_data))
            .then((user_data) => bitbucket.createHook(user_data, username, repo_slug, message.space.name))
            .then((user_data) => bitbucketStorage.saveHook(user_data, controller, username, repo_slug, message.space.name))
            .then((response) => {
              bot.reply(message, `This room is now connected to *${username}/${repo_slug}*`);
            })
            .catch((error) => {
              bot.reply(message, `How how error: ${error}`);
            })
    });

    // Connect to a repository: create a hook for that repository
    controller.hears('connect (.*)', ['direct_message', 'message_received'], function (bot, message) {
      bot.reply(message, `Sorry I can't connect to *${message.match[1]}*. I only connect to bitbucket repo like \`https://bitbucket.org/{username}/{repo_slug}/...\``);
    });

    //List all repositories connected to this channel
    controller.hears('list', ['direct_message', 'message_received'], function (bot, message) {
      controller.storage.users.get(message.user)
        .then(bitbucket.checkCredentials)
        .then(bitbucket.handleValidToken)
        .then((response) => {
          let listResponse = '*The list of connected repositories:*\n';

          controller.storage.channels.get(message.space.name)
          .then(connectedRepos => {
            if (connectedRepos==null){
              listResponse = '*No connected repositories*';
            } else {
              connectedRepos.forEach(element => {
                listResponse = listResponse+"* "+element.repo+"\n";
              });
            }

            bot.reply(message, listResponse);
          });
        })
        .catch((error) => {
          bot.reply(message, `Channel list error: ${error}`);
        })
    });
}
