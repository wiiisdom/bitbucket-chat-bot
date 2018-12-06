module.exports = (controller) => {
    controller.on('message_received',  (bot, message) => {
        bot.reply(message, `You said '${message.text}'`);
    });

    controller.on('direct_message',  (bot, message) => {
        bot.reply(message, `You DMed me '${message.text}'`);
    });

}
