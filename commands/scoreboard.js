const idEnum = require("../enum/idEnum");

/**
 * Displays a scoreboard of mock runs for users in the specified familia.
 *
 * @example
 * /scoreboard {familia} {stage}
 *
 * @param {*} knex - Pre-configured knex instance
 * @param {object} interaction - User interaction that triggered the command
 */
module.exports = async function (knex, interaction) {
  let familia = interaction.options.getString("familia");
  let stage = interaction.options.getString("stage");

  if (familia == "Ravengarde") {
    roleId = idEnum.RavengardeID;
  } else if (familia == "Ravenwood") {
    roleId = idEnum.RavenwoodID;
  } else if (familia == "Ravenheart") {
    roleId = idEnum.RavenheartID;
  }

  interaction.guild.members.fetch().then(async (fetchedMembers) => {
    let filteredMembers = fetchedMembers.filter((user) =>
      user._roles ? user._roles.includes(roleId) : false
    );
    const mockResults = await knex({ m: "defaultdb.mocks" })
      .select({ discord_id: "m.discord_id", score: "m.score" })
      .where("m.familia", familia)
      .where("m.stage", stage)
      .orderBy("m.score", "desc");

    mocks = mockResults.flatMap((mock) => {
      let filter = filteredMembers.find((member) => member.user.id == mock.discord_id);
      if (filter) {
        return {
          name: filter.nickname ? filter.nickname : filter.user.username,
          score: mock.score,
        };
      } else {
        return [];
      }
    });

    mocks = mocks.sort((a, b) => a.score >= b.score);

    let response = `__${familia} ${stage} mocks__\n`;
    mocks.map((member) => {
      response += `**${member.name}** has a score of ${member.score / 1000000}m\n`;
    });

    await interaction.reply(response);
  });
};
