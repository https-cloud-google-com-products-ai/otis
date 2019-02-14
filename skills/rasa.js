const otApi = require("../apis/openTargets.js");
const listGenes = require("../lookups/genes");
const listEfo = require("../lookups/efo");
const listOrphanet = require("../lookups/orphanet");

const lookupGenes = listGenes.reduce((acc, d) => {
  acc[d.symbol.toUpperCase()] = d;
  return acc;
}, {});

const lookupDiseases = [...listEfo, ...listOrphanet].reduce((acc, d) => {
  acc[d.name.toUpperCase()] = d;
  return acc;
}, {});

module.exports = function(controller) {
  controller.hears(["greet"], "message_received", (bot, message) => {
    bot.reply(message, "Hi! My name is Otis. I'm the Open Targets chatbot.");
  });
  controller.hears(["goodbye"], "message_received", (bot, message) => {
    bot.reply(message, "Goodbye.");
  });
  controller.hears(["help"], "message_received", (bot, message) => {
    bot.reply(
      message,
      "Ask me questions about genes and diseases. I'll do my best to answer them."
    );
  });
  controller.hears(
    ["query_gene_summary"],
    "message_received",
    (bot, message) => {
      if (message.entities && message.entities.gene) {
        const geneSymbol = message.entities.gene[0].toUpperCase();
        const gene = lookupGenes[geneSymbol] || {};
        const geneId = gene.id;
        const geneName = gene.name;
        bot.reply(
          message,
          `The gene [${geneSymbol}](https://www.targetvalidation.org/target/${geneId}) is also known as *${geneName}*.`
        );
      } else {
        bot.reply(
          message,
          "I think you asked about a gene, but I don't know which one."
        );
      }
    }
  );
  controller.hears(
    ["query_gene_baseline_expression_profile"],
    "message_received",
    (bot, message) => {
      if (message.entities && message.entities.gene) {
        const geneSymbol = message.entities.gene[0].toUpperCase();
        const gene = lookupGenes[geneSymbol] || {};
        const geneId = gene.id;
        if (geneId) {
          otApi
            .targetExpression(geneId)
            .then(response => {
              const relevantTissues = response.data.data[geneId].tissues.filter(
                d => d.rna.zscore > 0
              );
              const relevantTissueNames = relevantTissues.map(d => d.label);
              bot.reply(
                message,
                `${geneSymbol} is particularly expressed in the following tissues:\n* ${relevantTissueNames.join(
                  "\n* "
                )}.\n\nSee more information [here](https://www.targetvalidation.org/target/${geneId}).`
              );
            })
            .catch(error => {
              console.error("Oops!", error);
            });
        } else {
          bot.reply(
            message,
            `I think you asked about baseline expression for ${geneSymbol}, but I couldn't find an Ensembl ID.`
          );
        }
      } else {
        bot.reply(
          message,
          "I think you asked about baseline expression for a gene, but I don't know which one."
        );
      }
    }
  );
  controller.hears(
    ["query_gene_associated_diseases"],
    "message_received",
    (bot, message) => {
      if (message.entities && message.entities.gene) {
        const geneSymbol = message.entities.gene[0].toUpperCase();
        const gene = lookupGenes[geneSymbol] || {};
        const geneId = gene.id;
        if (geneId) {
          otApi
            .targetAssociations(geneId)
            .then(response => {
              const relevantDiseases = response.data.data.slice(0, 10);
              const relevantDiseaseCount = response.data.data.length;
              const relevantDiseaseNames = relevantDiseases
                .map(d => ({
                  name: d.disease.efo_info.label,
                  id: d.disease.id,
                }))
                .map(
                  d =>
                    `[${d.name}](https://www.targetvalidation.org/disease/${
                      d.id
                    })`
                );
              bot.reply(
                message,
                `${geneSymbol} is associated with ${relevantDiseaseCount} diseases, the top 10 of which are:\n* ${relevantDiseaseNames.join(
                  "\n* "
                )}.\n\nSee the rest [here](https://www.targetvalidation.org/target/${geneId}/associations).`
              );
            })
            .catch(error => {
              console.error("Oops!", error);
            });
        } else {
          bot.reply(
            message,
            `I think you asked about diseases associated with ${geneSymbol}, but I couldn't find an Ensembl ID.`
          );
        }
      } else {
        bot.reply(
          message,
          "I think you asked about diseases associated with a gene, but I don't know which one."
        );
      }
    }
  );
  controller.hears(
    ["query_disease_summary"],
    "message_received",
    (bot, message) => {
      console.log("asked for disease, got entities:", message.entities);
      // bot.reply(
      //   message,
      //   `I think you asked about a disease${
      //     message.entities && message.entities.disease
      //       ? ` (perhaps ${message.entities.disease.join(", ")})`
      //       : ""
      //   }`
      // );
      if (message.entities && message.entities.disease) {
        const diseaseName = message.entities.disease[0];
        const disease = lookupDiseases[diseaseName.toUpperCase()] || {};
        const diseaseId = disease.id;
        bot.reply(
          message,
          `There is a disease called [${diseaseName}](https://www.targetvalidation.org/disease/${diseaseId}).`
        );
      } else {
        bot.reply(
          message,
          "I think you asked about a disease, but I don't know which one."
        );
      }
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
