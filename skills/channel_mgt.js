module.exports = function(controller) {

  // Send a welcome message whenever a bot joins a channel.
  controller.on(['bot_room_join','bot_dm_join'], function(bot, message) {
    controller.storage.channels.save({id: message.channel, foo:'bar'})
      .then(() => {
        bot.replyAsNewThread(message,'Hello how I can help you?');
      })
      .catch((error) => {
        bot.replyAsNewThread(message, `How how error: ${error}`);
      })

  });

  controller.on(['bot_room_leave','bot_dm_leave'], function(bot, message) {
    console.log('Bot leaving! must handle hook deletion')
    // add hook deletion
  })
}
