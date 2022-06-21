const idEnum = require("../enum/idEnum");

/**
 * Fully clears an event.
 *
 * @example
 * /clear-event {event}
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
    .where("e.event", interaction.options.getString("event"))
    .del();

  return await interaction.reply("Event removed successfully!");
};
