/**
 * Mocks someone else's score for a stage.
 *
 * @example
 * /mock-someone-else {stage} {runner} {familia} {score}
 *
 * @param {*} knex - Pre-configured knex instance
 * @param {object} interaction - User interaction that triggered the command
 */
module.exports = async function (knex, interaction) {
  let userId = interaction.options.getUser("runner").id;
  let familia = interaction.options.getString("familia");

  // This could be done using onConflict
  await knex({ m: "mocks" })
    .where("m.familia", familia)
    .where("m.discord_id", userId)
    .where("m.stage", interaction.options.getSubcommand())
    .del();

  await knex("mocks").insert({
    discord_id: userId,
    familia: familia,
    stage: interaction.options.getSubcommand(),
    score: interaction.options.getInteger("score"),
  });

  await interaction.reply(
    `Mock logged on ${interaction.options.getSubcommand()} for ${familia} with a score of ${
      interaction.options.getInteger("score") / 1000000
    }m`
  );
};
