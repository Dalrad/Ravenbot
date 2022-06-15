require("dotenv").config();

const { Client, Intents } = require("discord.js");

const config = require("./knexfile.js");
const knex = require("knex")(config);

const { token } = process.env.DISCORD_TOKEN;

const logRun = require("./commands/log-run");
const mockRun = require("./commands/mock-run");
const scoreboard = require("./commands/scoreboard");
const bestScore = require("./commands/best-score");
const listNoRuns = require("./commands/list-noruns");
const reportOtherRun = require("./commands/report-other-run.js");
const mockSomeoneElse = require("./commands/mock-someone-else.js");
const familiaTotals = require("./commands/familia-totals.js");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
});

client.once("ready", () => {
  console.log("Ready!");
});

async function daySwap() {
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

  await daySwap();
  switch (commandName) {
    case "log-run":
      await logRun(knex, interaction);
      break;
    case "mock-run":
      await mockRun(knex, interaction);
      break;
    case "scoreboard":
      await scoreboard(knex, interaction);
      break;
    case "best-score":
      await bestScore(knex, interaction);
      break;
    case "list-noruns":
      await listNoRuns(knex, interaction);
      break;
    case "report-other-run":
      await reportOtherRun(knex, interaction);
      break;
    case "mock-someone-else":
      await mockSomeoneElse(knex, interaction);
      break;
    case "familia-totals":
      await familiaTotals(knex, interaction);
      break;
    default:
      await interaction.reply(`Command ${commandName} not found.`);
      break;
  }
});

client.login(token);
