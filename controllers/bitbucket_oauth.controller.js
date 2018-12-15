const bitbucket = require('../services/bitbucket.service')

module.exports = (req, res, controller) => {
  let code = req.query.code
  let user = req.query.state
  // grab the access_token based on the code provided in the callback url here
  controller.storage.users.get(user)
    .then((user_data) => {
      bitbucket.login(code)
      .then((response) => {
        user_data.auth = response.data
        return bitbucket.user(response.data)
      })
      .then((response) => {
        user_data.account = response.data
        return controller.storage.users.save(user_data)
      })
      .then(() => {
        res.send("Successfully logon! You can now close this window.")
        // send auth message on DM
        controller.spawn({}, function(bot) {
            bot.say(
                {
                    parent: `${user_data.space}`,
                    requestBody: {
                        text: `You're successfully logged in as ${user_data.account.display_name}.`
                    }
                }
            );
          });
      })
      .catch((error) => {
        console.log(error)
      })

    })
    .catch((error) => {
      console.log(error)
    })
}