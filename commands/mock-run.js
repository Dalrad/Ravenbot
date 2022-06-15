const idEnum = require("../enum/idEnum");

/**
 * Mocks a users score for a stage.
 *
 * @example
 * /mock-run {stage} {score} {familia}
 *
 * @param {*} knex - Pre-configured knex instance
 * @param {object} interaction - User interaction that triggered the command
 */
module.exports = async function (knex, interaction) {
  let familia = "";
  let roles = interaction.member._roles;

  if (interaction.options.getString("familia")) {
    familia = interaction.options.getString("familia");
  } else if (roles.includes(idEnum.RavengardeID)) {
    familia = "Ravengarde";
  } else if (roles.includes(idEnum.RavenwoodID)) {
    familia = "Ravenwood";
  } else if (roles.includes(idEnum.RavenheartID)) {
    familia = "Ravenheart";
  }

  await knex({ m: "mocks" })
    .where("m.familia", familia)
    .where("m.discord_id", interaction.user.id)
    .where("m.stage", interaction.options.getSubcommand())
    .del();

  await knex("mocks").insert({
    discord_id: interaction.user.id,
    familia: familia,
    stage: interaction.options.getSubcommand(),
    score: interaction.options.getInteger("score"),
  });

  await interaction.reply(
    `Mock logged on ${interaction.options.getSubcommand()} for ${interaction.options.getString(
      "familia"
    )} with a score of ${interaction.options.getInteger("score") / 1000000}m`
  );
};
