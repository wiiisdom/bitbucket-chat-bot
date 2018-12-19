const qs = require('querystring');

/**
 * Create a webhook on bitbucket
 */
exports.saveHook = (user_data, controller, username, repo_slug, space) => new Promise((resolve, reject) => {
    if(user_data && username && repo_slug) {
        let repo = username+"/"+repo_slug;

        controller.storage.channels.get(space, function(err, channel) {
          if(!channel || !channel.repo) {
            let channelRepo = [];
            channelRepo.push(repo);

            controller.storage.channels.save({id: space, repo: channelRepo});
            resolve(user_data);
            
          } else {
            if (!channel.repo.includes(repo)) {
              channel.repo.push(repo);
              controller.storage.channels.save({id: space, repo: repo});
              resolve(user_data)
            } else {
              reject(`This room *${space}* is already connected to repository *${repo}*`);
            }
          }
        });
      } else {
        reject("No user and repository information!")
      }
})