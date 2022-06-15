const idEnum = require("../enum/idEnum");

/**
 * Logs a run for a user.
 *
 * @example
 * /log-run {stage} {familia} {count}
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

  let dailyRuns;

  let mockResults = await knex({ m: "defaultdb.mocks" })
    .select()
    .where("m.familia", familia)
    .where("m.discord_id", interaction.user.id)
    .where("m.stage", interaction.options.getString("stage"));

  if (mockResults.length === 0) {
    await interaction.reply(
      `!**ATTENTION**! Please log a score on ${interaction.options.getString(
        "stage"
      )} using /mock-run, and relog this run! `
    );
  }

  const dailyRunQuery = await knex({ fr: "defaultdb.familiarush" })
    .select()
    .where("fr.familia", familia)
    .where("fr.discord_id", interaction.user.id);

  dailyRuns = dailyRunQuery.length;

  const count = interaction.options.getInteger("count")
    ? interaction.options.getInteger("count")
    : 1;

  if (dailyRuns >= 4) {
    await interaction.reply(
      `You've completed all your daily runs, please refrain from spamming the bot past 4 runs or you'll be blacklisted from future use`
    );
  } else {
    const repeatEntry = dailyRuns + count <= 4 ? count : 4 - dailyRuns;
    const records = Array(repeatEntry).fill({
      discord_id: interaction.user.id,
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
