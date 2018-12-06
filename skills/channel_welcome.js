module.exports = function(controller) {


  // Send a welcome message whenever a bot joins a channel.
  controller.on('bot_room_join', function(bot, message) {
    bot.replyAsNewThread(message,'Your friendly bot is here!');
  });


  controller.on('bot_dm_join', function(bot, message) {
    bot.replyAsNewThread(message,'Oh hello!');
  });


}
