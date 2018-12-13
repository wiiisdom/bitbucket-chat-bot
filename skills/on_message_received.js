const qs = require('querystring');
const request = require('request');
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

    // Connect to a repository: create a hook for that repository
    controller.hears('connect', 'direct_message', function (bot, message) {
        // PUT THIS IN CALLBACK
        // bitbucket.refreshToken(message, controller);

        var connectRepository = message.text.split(" ")[1];
        console.log("Connect to: "+connectRepository)
        console.log( "... by user: "+message.user);
        
        // adrian_mitrica/bot-test
        var theUrl = 'https://api.bitbucket.org/2.0/repositories/adrian_mitrica/bot-test/hooks';
        var theBody = {
            description: 'Webhook Description', 
            url: 'https://gbschat.serveo.net/bitbucket/'+message.space.name, 
            active: true, 
            events: [
                // 'repo:push', 
                'pullrequest:unapproved', 
                'pullrequest:approved', 
                'pullrequest:comment_updated', 
                'pullrequest:comment_created', 
                'pullrequest:updated', 
                'pullrequest:rejected', 
                'pullrequest:fulfilled', 
                'pullrequest:created'
            ]
        }
        var stringBody = JSON.stringify(theBody);
        
        console.log('URL: '+theUrl);
        // console.log('BODY: '+stringBody);

        var authorization = controller.storage.users.get(message.user)
            .then((user_data) => {
                let access_token = user_data.auth.access_token

                var theAuthorization = `Bearer ${access_token}`;
                console.log('HEADER: '+theAuthorization);
                console.log('BODY: '+stringBody);

                request.post({
                    url: theUrl,
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    },
                    json: true,
                    body: theBody
                }, (err, res2, body) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log('Creating hook: ');
                    console.log(res2.statusCode);
                    console.log(JSON.stringify(body));
                });

            })
            .catch((err) => {
                console.log(err)
            })

        //console.log('URL: '+theUrl);
        //console.log('BODY: '+theBody);


    });

    // List all repositories connected to this channel
    // controller.hears('list', 'direct_message', function (bot, message) {
    //     controller.storage.users.get(message.user, function(err, user_data) {
    //       if(!user_data || !user_data.account) {
    //         bot.reply(message, 'I don\'t know you yet. Please `login` !');
    //       }
    //       else {
    //           var theUrl = 'https://api.bitbucket.org/2.0/repositories';
    //         //   while (theUrl!=null) {
    //             request.get({
    //                 url: theUrl,
    //               }, (err, res2, body) => {
    //                 let data = JSON.parse(body)
    //                 let repos = data.values;
    //                 theUrl = data.next;
    //                 repos.forEach(repo => {
    //                     console.log(repo.full_name+" - "+repo.has_issues);
    //                 });
    //                 console.log('-----------');
    //                 console.log(data)
    //               });
    //             }
    //         // }
    //     });
    // });

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
