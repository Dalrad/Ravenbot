const idEnum = require("../enum/idEnum");

/**
 * Displays a scoreboard of with a breakdown of score
 * by familia, by event, by user, and by stage.
 *
 *
 * @example
 * /event-scoreboard {raw / averaged}
 *
 * @param {*} knex - Pre-configured knex instance
 * @param {object} interaction - User interaction that triggered the command
 */
module.exports = async function (knex, interaction) {
  const participants = await knex({ e: "defaultdb.events" })
    .select({
      memberId: "e.discord_id",
      event: "e.event",
      familia: "e.familia",
      score: "e.score",
      participatedAccounts: "e.participated_accounts",
    })
    .orderBy("e.familia", "asc");

  let participantHash = {};
  let events = {};
  for (let participant of participants) {
    const participationKey = participant.event + ";" + participant.familia;

    participantHash[participant.memberId + "event"] = participant;

    if (!events.hasOwnProperty(participationKey)) {
      events[participationKey] = { score: 0, participatedAccounts: 0, scoreCt: 0 };
    }

    events[participationKey].score += participant.score;
    events[participationKey].participatedAccounts += participant.participatedAccounts;
    events[participationKey].scoreCt += 1;
  }

  let response = `__Familia Event Scoreboard__\n`;
  const scoreboardMode = interaction.options.getString("scoreboard-mode");
  Object.keys(events).forEach((event) => {
    const keySplit = event.split(";");
    response += `**${keySplit[1]}** has a ${scoreboardMode} score of ${
      events[event].score / (scoreboardMode == "raw" ? 1 : events[event].scoreCt)
    } in ${keySplit[0]} Zone\n`;
  });

  response += `\n\n__Familia Event Participation__\n`;
  Object.keys(events).forEach((event) => {
    const participantCount = events[event].participatedAccounts;
    const keySplit = event.split(";");
    response += `**${keySplit[1]}** has ${participantCount} participant${
      participantCount !== 1 ? "s" : ""
    } in ${keySplit[0]} Zone\n`;
  });

  return await interaction.reply(response);
};
