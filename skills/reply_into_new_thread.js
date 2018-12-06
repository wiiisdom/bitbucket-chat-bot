module.exports = (controller) => {
    controller.hears('new thread', 'message_received',  (bot, message) => {
        bot.replyAsNewThread(message, `Hello ! this is a new thread`);
    });
}