module.exports = (controller) => {
    controller.hears('convo', 'message_received', function (bot, message) {

        bot.startConversation(message, function(err, convo) {

            convo.ask('You want to know more about Botkit ?', [
                {
                    pattern: bot.utterances.yes,
                    callback: function(response, convo) {
                        convo.say('Take a look here https://botkit.ai/docs/');
                        convo.next();
                    }
                },
                {
                    pattern: bot.utterances.no,
                    default: true,
                    callback: function(response, convo) {
                        convo.say('No problem');
                        convo.next();
                    }
                }
            ]);
        });

    });
}