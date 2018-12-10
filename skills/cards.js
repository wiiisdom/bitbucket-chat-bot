module.exports = (controller) => {
    controller.hears('cards', 'message_received', function (bot, message) {
        bot.reply(message, {
            requestBody: {
                cards: [
                    {
                        "sections": [
                            {
                                "widgets": [
                                    {
                                        "image": { "imageUrl": "https://image.slidesharecdn.com/botkitsignal-160526164159/95/build-a-bot-with-botkit-1-638.jpg?cb=1464280993" }
                                    },
                                    {
                                        "buttons": [
                                            {
                                                "textButton": {
                                                    "text": "Get Started with Adrian M.",
                                                    "onClick": {
                                                        "openLink": {
                                                            "url": "https://botkit.ai/docs/"
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        });
    });
}