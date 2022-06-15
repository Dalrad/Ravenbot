const idEnum = require("../enum/idEnum");

/**
 * Lists each users best score based on their mocked entries.
 *
 * @example
 * /best-score {familia}
 *
 * @param {*} knex - Pre-configured knex instance
 * @param {object} interaction - User interaction that triggered the command
 */
module.exports = async function (knex, interaction) {
  let familia = interaction.options.getString("familia");

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

    const results = await knex({ m: "defaultdb.mocks" })
      .select({
        discord_id: "m.discord_id",
        score: "m.score",
        stage: "m.stage",
      })
      .where("m.familia", familia)
      .orderBy("m.discord_id", "desc");

    let playerRunDict = new Object();

    results.forEach((result, index) => {
      if (result.discord_id in playerRunDict) {
        playerRunDict[result.discord_id] = [
          ...playerRunDict[result.discord_id],
          {
            discord_id: result.discord_id,
            score: result.score,
            stage: result.stage,
          },
        ];
      } else {
        playerRunDict[result.discord_id] = [
          {
            discord_id: result.discord_id,
            score: result.score,
            stage: result.stage,
          },
        ];
      }
    });

    Object.keys(playerRunDict).map((key) => {
      let filter = filteredMembers.find((member) => member.user.id == key);
      playerRunDict[filter.nickname ? filter.nickname : filter.user.username] =
        playerRunDict[key];
      delete playerRunDict[key];
    });

    let response = `__${familia} optimal scores__\n`;
    Object.keys(playerRunDict).map((key) => {
      response += `**${key}**:\n`;
      if (playerRunDict[key].filter((e) => e.stage === "stage-1").length > 0) {
        response += `- Stage 1 = ${Math.round(
          playerRunDict[key].filter((e) => e.stage === "stage-1")[0].score / 5
        ).toLocaleString()}\n`;
      }
      if (playerRunDict[key].filter((e) => e.stage === "stage-2").length > 0) {
        response += `- Stage 2 = ${Math.round(
          playerRunDict[key].filter((e) => e.stage === "stage-2")[0].score / 3
        ).toLocaleString()}\n`;
      }
      if (playerRunDict[key].filter((e) => e.stage === "stage-3").length > 0) {
        response += `- Stage 3 = ${playerRunDict[key]
          .filter((e) => e.stage === "stage-3")[0]
          .score.toLocaleString()}\n`;
      }
    });

    await interaction.reply(response);
  });
};