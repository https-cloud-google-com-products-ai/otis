module.exports = function(controller) {
  controller.hears("open the (.*) doors", ["message_received"], function(
    bot,
    message
  ) {
    var doorType = message.match[1]; //match[1] is the (.*) group. match[0] is the entire group (open the (.*) doors).
    if (doorType === "pod bay") {
      return bot.reply(message, "I'm sorry, Dave. I'm afraid I can't do that.");
    }
    return bot.reply(message, "Okay");
  });
};
