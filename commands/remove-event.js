const idEnum = require("../enum/idEnum");

/**
 * Removes an event from a user.
 *
 * @example
 * /remove-event {event} {familia} {user}
 *
 * @param {*} knex - Pre-configured knex instance
 * @param {object} interaction - User interaction that triggered the command
 */
module.exports = async function (knex, interaction) {
  const roles = interaction.member._roles;
  if (!roles.includes(idEnum.eventTracker)) {
    return await interaction.reply("You do not have permission to use this command!");
  }

  await knex({ e: "defaultdb.events" })
    .where("e.familia", interaction.options.getString("familia"))
    .where("e.discord_id", interaction.options.getUser("user").id)
    .where("e.event", interaction.options.getString("event"))
    .del();

  return await interaction.reply("Event run removed successfully!");
};
