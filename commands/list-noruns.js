const idEnum = require("../enum/idEnum");

/**
 * Lists all users who have not run at least once on a stage today.
 *
 * @example
 * /list-noruns {familia}
 *
 * @param {*} knex - Pre-configured knex instance
 * @param {object} interaction - User interaction that triggered the command
 */
module.exports = async function (knex, interaction) {
  let roleId;
  const familia = interaction.options.getString("familia");

  switch (familia) {
    case "Ravengarde":
      roleId = idEnum.RavengardeID;
      break;
    case "Ravenwood":
      roleId = idEnum.RavenwoodID;
      break;
    case "Ravenheart":
      roleId = idEnum.RavenheartID;
      break;
    default:
      break;
  }

  if (roleId) {
    interaction.guild.members.fetch().then(async (fetchedMembers) => {
      const filteredMembers = fetchedMembers.filter((user) =>
        user._roles ? user._roles.includes(roleId) : false
      );

      const results = await knex({ fr: "defaultdb.familiarush" })
        .select({ discordId: "fr.discord_id" })
        .where("fr.familia", familia);

      const ranIds = results.map((result) => {
        return result.discordId;
      });

      noRunners = filteredMembers.filter((member) => {
        if (ranIds.includes(member.user.id)) {
          return false;
        }
        return true;
      });

      let response = `__${familia}__\n`;
      noRunners.map((member) => {
        response += `**${
          member.nickname ? member.nickname : member.user.username
        }** has not run today\n`;
      });
      await interaction.reply(
        response.length > 1 ? response : "Congrats! Everyone did their run"
      );
    });
  } else {
    await interaction.reply("Something went very wrong, what was it?");
  }
};
