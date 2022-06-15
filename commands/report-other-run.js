/**
 * Reports someone else's run for a stage. If the user has no mocks inserted a mock score of 1 will be added.
 *
 * @example
 * /report-other-run {runner} {stage} {familia} {count}
 *
 * @param {*} knex - Pre-configured knex instance
 * @param {object} interaction - User interaction that triggered the command
 */
module.exports = async function (knex, interaction) {
  let userId = interaction.options.getUser("runner").id;
  let familia = interaction.options.getString("familia");

  const mockResults = await knex({ m: "defaultdb.mocks" })
    .where("m.discord_id", userId)
    .where("m.familia", familia)
    .where("m.stage", interaction.options.getString("stage"));

  if (mockResults.length < 1) {
    await knex("defaultdb.mocks").insert({
      discord_id: userId,
      familia: familia,
      stage: interaction.options.getString("stage"),
      score: 1,
    });
  }

  const userRunResults = await knex({ fr: "defaultdb.familiarush" })
    .where("fr.familia", familia)
    .where("fr.discord_id", userId);

  let dailyRuns = userRunResults.length;

  const count = interaction.options.getInteger("count")
    ? interaction.options.getInteger("count")
    : 1;

  if (dailyRuns >= 4) {
    await interaction.reply(`User has completed all daily runs with this familia`);
  } else {
    const repeatEntry = dailyRuns + count <= 4 ? count : 4 - dailyRuns;
    const records = Array(repeatEntry).fill({
      discord_id: userId,
      familia: familia,
      stage: interaction.options.getString("stage"),
    });

    await knex("defaultdb.familiarush").insert(records);
    await interaction.reply(
      `Run(s) registered on ${interaction.options.getString("stage")} for ${familia} ( ${
        dailyRuns + count <= 4 ? count : 4
      } / 4 runs )`
    );
  }
};
