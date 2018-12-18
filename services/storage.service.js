const qs = require('querystring');

/**
 * Create a webhook on bitbucket
 */
exports.saveHook = (user_data, controller, username, repo_slug) => new Promise((resolve, reject) => {
    if(user_data && username && repo_slug) {
        let channelId = username+"/"+repo_slug;
        controller.storage.channels.save({id: channelId});
        resolve(user_data)
      } else {
        reject("No user and repository information!")
      }
})