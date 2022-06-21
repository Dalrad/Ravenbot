/**
 * Lists total historical runs for each familia, and each user.
 *
 * @example
 * /familia-totals
 *
 * @param {*} knex - Pre-configured knex instance
 * @param {object} interaction - User interaction that triggered the command
 */
module.exports = async function (knex, interaction) {
  const resultsA = await knex({ h: "defaultdb.history" }).where(
    "h.familia",
    "Ravengarde"
  );
  const resultsB = await knex({ h: "defaultdb.history" }).where(
    "h.familia",
    "Ravenheart"
  );
  const resultsC = await knex({ h: "defaultdb.history" }).where("h.familia", "Ravenwood");

  const RavengardeRuns = resultsA.length;
  const RavenheartRuns = resultsB.length;
  const RavenwoodRuns = resultsC.length;

  interaction.guild.members.fetch().then(async (fetchedMembers) => {
    const collectedResults = [...resultsA, ...resultsB, ...resultsC];

    let obj = {};
    collectedResults.forEach((result) => {
      if (!obj[result.discord_id]) {
        obj[result.discord_id] = result.discord_id;
      }
    });

    let filteredMembers = fetchedMembers.filter((user) => (user._roles ? true : false));

    let filteredMemberArray = [];
    filteredMembers.forEach((member) => {
      filteredMemberArray.push(member);
    });

    let arrayOfCount = filteredMemberArray.map((member) => {
      const count = [...collectedResults].filter(
        (x) => x.discord_id == member.user.id
      ).length;

      if (count > 0)
        return {
          name: member.nickname ? member.nickname : member.user.username,
          count,
        };
    });

    arrayOfCount = arrayOfCount.sort((a, b) => (a.count < b.count ? 1 : -1));

    let response = "";
    arrayOfCount.forEach((count, index) => {
      if (count != undefined) {
        response += `\n${index + 1}. ${count.name} logged ${count.count} runs`;
      }
    });

    await interaction.reply(
      `__**Familia Totals**__\nRavengarde : ${RavengardeRuns} runs\nRavenheart : ${RavenheartRuns} runs\nRavenwood : ${RavenwoodRuns} runs\n\n__**User Totals**__${response}`
    );
  });
};
