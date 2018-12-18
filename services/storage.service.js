const qs = require('querystring');

/**
 * Create a webhook on bitbucket
 */
exports.saveHook = (user_data, controller, username, repo_slug, space) => new Promise((resolve, reject) => {
    if(user_data && username && repo_slug) {
        let repo = username+"/"+repo_slug;
        controller.storage.channels.save({id: space, repo: repo});
        resolve(user_data)
      } else {
        reject("No user and repository information!")
      }
})