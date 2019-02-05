module.exports = function(controller) {
  controller.hears(["greet"], "message_received", function(bot, message) {
    const reply = "Why hello there!";
    bot.reply(message, reply);
  });
  controller.hears(["goodbye"], "message_received", function(bot, message) {
    const reply = "See you later!";
    bot.reply(message, reply);
  });
  controller.hears(["mood_unhappy"], "message_received", (bot, message) => {
    bot.reply(message, "Cheer up!");
  });
  controller.hears(
    ["query_summary_of_gene"],
    "message_received",
    (bot, message) => {
      console.log("asked for gene", message.entities);
      bot.reply(message, "You asked about a gene");
    }
  );
  controller.hears(
    ["query_summary_of_disease"],
    "message_received",
    (bot, message) => {
      console.log("asked for disease", message.entities);
      bot.reply(message, "You asked about a disease");
    }
  );
};
