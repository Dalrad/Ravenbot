require("dotenv").config();

const { Client, Intents } = require("discord.js");

const config = require("./knexfile.js");
const knex = require("knex")(config);

const logRun = require("./commands/log-run");
const mockRun = require("./commands/mock-run");
const scoreboard = require("./commands/scoreboard");
const bestScore = require("./commands/best-score");
const listNoRuns = require("./commands/list-noruns");
const reportOtherRun = require("./commands/report-other-run.js");
const mockSomeoneElse = require("./commands/mock-someone-else.js");
const familiaTotals = require("./commands/familia-totals.js");

const { token } = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
});

client.once("ready", () => {
  console.log("Ready!");
});

function daySwap() {
  const newDate = new Date().setHours(8, 0, 0, 0);

  if (Date.now() > new Date(newDate)) {
    await knex.raw(
      `INSERT INTO defaultdb.history SELECT * FROM familiarush WHERE date < (curdate() - interval 60 minute);`
    );
    await knex.raw(
      `delete from defaultdb.familiarush where date < (curdate() - interval 60 minute);`
    );
  }
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  // This should be converted into a command dictionary instead of an else if chain, but waiting for an update to discord.js
  if (commandName === "log-run") {
    daySwap();
    await logRun(knex, interaction);
  } else if (commandName === "mock-run") {
    await mockRun(knex, interaction);
  } else if (commandName === "scoreboard") {
    await scoreboard(knex, interaction);
  } else if (commandName === "best-score") {
    await bestScore(knex, interaction);
  } else if (commandName === "list-noruns") {
    daySwap();
    await listNoRuns(knex, interaction);
  } else if (commandName === "report-other-run") {
    daySwap();
    await reportOtherRun(knex, interaction);
  } else if (commandName === "mock-someone-else") {
    daySwap();
    await mockSomeoneElse(knex, interaction);
  } else if (commandName === "familia-totals") {
    daySwap();
    await familiaTotals(knex, interaction);
  }
});

client.login(token);
