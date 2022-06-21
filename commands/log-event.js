const idEnum = require("../enum/idEnum");

/**
 * Logs an event run for a user (Intended for non-FR PvE events).
 *
 * @example
 * /log-event {event} {familia} {score} {user} {participatedAccounts}
 *
 * @param {*} knex - Pre-configured knex instance
 * @param {object} interaction - User interaction that triggered the command
 */
module.exports = async function (knex, interaction) {
  const roles = interaction.member._roles;
  if (!roles.includes(idEnum.eventTracker)) {
    return await interaction.reply("You do not have permission to use this command!");
  }

  const existing = await knex({ e: "defaultdb.events" })
    .select({ score: "e.score", participatedAccounts: "e.participated_accounts" })
    .where("e.familia", interaction.options.getString("familia"))
    .where("e.discord_id", interaction.options.getUser("user").id)
    .where("e.event", interaction.options.getString("event"))
    .first();

  if (existing) {
    // Update existing
    await knex("defaultdb.events")
      .update({
        score: interaction.options.getInteger("score") || existing.score,
        participated_accounts:
          interaction.options.getInteger("participated-accounts") ||
          existing.participated_accounts,
      })
      .where("event", interaction.options.getString("event"))
      .where("discord_id", interaction.options.getUser("user").id)
      .where("familia", interaction.options.getString("familia"));
  } else {
    // Insert new
    await knex("defaultdb.events").insert({
      discord_id: interaction.options.getUser("user").id,
      familia: interaction.options.getString("familia"),
      event: interaction.options.getString("event"),
      score: interaction.options.getInteger("score"),
      participated_accounts: interaction.options.getInteger("participated-accounts") || 1,
    });
  }

  return await interaction.reply(
    `Event logged successfully for ${interaction.options.getUser(
      "user"
    )} on ${interaction.options.getString("event")} Zone!`
  );
};
