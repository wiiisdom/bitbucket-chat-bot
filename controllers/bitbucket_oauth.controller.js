const request = require('request');

module.exports = (req, res, controller) => {
  let code = req.query.code
  let user = req.query.state
  // grab the access_token based on the code provided in the callback url here
  request.post({
    url: 'https://bitbucket.org/site/oauth2/access_token',
    form: {
      grant_type: 'authorization_code',
      code: code
    },
    auth: {
      user: process.env.BB_OAUTH_KEY,
      pass: process.env.BB_OAUTH_SECRET,
      sendImmediately: true
    }
  }, (err, res1 ,body) => {
    let auth = JSON.parse(body)
    request.get({
      url: 'https://api.bitbucket.org/2.0/user',
      headers: {
        Authorization: `Bearer ${auth.access_token}`
      }
    }, (err, res2, body) => {
      let data = JSON.parse(body)
      let user_data;
      controller.storage.users.get(user, (err, user_data) => {
        if(err) {
          console.log(err)
        }
        user_data.auth = auth
        user_data.account = data
        controller.storage.users.save(user_data).then(() => {
          res.send(data)
          // send auth message on DM
          controller.spawn({}, function(bot) {
            console.log(user_data)
              bot.say(
                  {
                      parent: `${user_data.space}`,
                      requestBody: {
                          text: `You're successfully logged in as ${data.display_name}.`
                      }
                  }
              );
            });
        }).catch((err) => {
          console.log(err)
        })
      })
    })
  })
}