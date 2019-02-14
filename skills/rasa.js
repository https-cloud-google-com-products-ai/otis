module.exports = function(controller) {
  controller.hears(["greet"], "message_received", function(bot, message) {
    const reply = "Hi! My name is Otis. I'm the Open Targets chatbot.";
    bot.reply(message, reply);
  });
  controller.hears(["goodbye"], "message_received", function(bot, message) {
    const reply = "Goodbye.";
    bot.reply(message, reply);
  });
  controller.hears(["help"], "message_received", function(bot, message) {
    const reply =
      "Ask me questions about genes and diseases. I'll do my best to answer them.";
    bot.reply(message, reply);
  });
  controller.hears(
    ["query_gene_summary"],
    "message_received",
    (bot, message) => {
      bot.reply(
        message,
        `I think you asked about a gene${
          message.entities && message.entities.gene
            ? ` (perhaps ${message.entities.gene.join(", ")})`
            : ""
        }`
      );
    }
  );
  controller.hears(
    ["query_gene_baseline_expression_profile"],
    "message_received",
    (bot, message) => {
      bot.reply(
        message,
        `I think you asked about the baseline expression for a gene${
          message.entities && message.entities.gene
            ? ` (perhaps ${message.entities.gene.join(", ")})`
            : ""
        }`
      );
    }
  );
  controller.hears(
    ["query_gene_associated_diseases"],
    "message_received",
    (bot, message) => {
      bot.reply(
        message,
        `I think you asked about the associated diseases for a gene${
          message.entities && message.entities.gene
            ? ` (perhaps ${message.entities.gene.join(", ")})`
            : ""
        }`
      );
    }
  );
  controller.hears(
    ["query_disease_summary"],
    "message_received",
    (bot, message) => {
      // console.log("asked for disease", message.entities);
      bot.reply(
        message,
        `I think you asked about a disease${
          message.entities && message.entities.disease
            ? ` (perhaps ${message.entities.disease.join(", ")})`
            : ""
        }`
      );
    }
  );
  controller.hears(
    ["query_disease_associated_genes"],
    "message_received",
    (bot, message) => {
      bot.reply(
        message,
        `I think you asked about the associated genes for a disease${
          message.entities && message.entities.disease
            ? ` (perhaps ${message.entities.disease.join(", ")})`
            : ""
        }`
      );
    }
  );
};
