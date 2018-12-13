const request = require('request');

exports.refreshToken = (message, controller) => {
    // let code = req.query.code
    let user = message.user;
    console.log('user: '+user)
    // let rtoken;

    controller.storage.users.get(user, (err, user_data)  => {
        if(err) {
            console.log(err)
        }
        
        let rtoken = user_data.auth.refresh_token
        console.log("rtoken = "+rtoken);

        // make the POST with the refresh_token
        console.log("rtoken1 = "+rtoken);
        request.post({
            url: 'https://bitbucket.org/site/oauth2/access_token', 
            form: {
                grant_type: 'refresh_token',
                refresh_token: rtoken
            },
            auth: {
                user: process.env.BB_OAUTH_KEY,
                pass: process.env.BB_OAUTH_SECRET,
                sendImmediately: true
            }
        }, (err, res1 ,body) => {
            if (err) {
                console.log("access token refresh err: ");
                console.log(err);
            }
            let dataAccessToken = JSON.parse(body);
            console.log('Status refresh token: '+res1.statusCode)
            if (res1.statusCode != 200) {
                console.log(res1.statusCode);
                console.log("access token body: ");
                console.log(dataAccessToken);
            }

            let newAccessToken = dataAccessToken.access_token;
            user_data.auth.access_token = newAccessToken;

            if (res1.statusCode == 200) {
                // console.log('last_user_data: ');
                // console.log(user_data);

                controller.storage.users.save(user_data).then(() => {
                    controller.spawn({}, function(bot) {
                        bot.say(
                            {
                                parent: `${user_data.space}`,
                                requestBody: {
                                    text: `You successfully refreshed token for ${user_data.account.display_name}.`
                                }
                            }
                        );
                    });
                }).catch((err) => {
                    console.log(err)
                })
            }
        })
    })

}