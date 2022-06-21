require("dotenv").config();
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const commands = [
  new SlashCommandBuilder()
    .setName("mock-run")
    .setDescription("Log a mock score to be used on the score charts")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("stage-1")
        .setDescription("Stage 1 score entry")
        .addIntegerOption((option) =>
          option
            .setName("score")
            .setDescription("Approximate score")
            .setRequired(true)
            .addChoice("15m", 15000000)
            .addChoice("30m", 30000000)
            .addChoice("45m", 45000000)
            .addChoice("60m", 60000000)
            .addChoice("75m", 75000000)
            .addChoice("90m", 90000000)
            .addChoice("115m", 115000000)
            .addChoice("130m", 130000000)
            .addChoice("145m", 145000000)
            .addChoice("150m+", 15000000)
        )
        .addStringOption((option) =>
          option
            .setName("familia")
            .setDescription("Specify the familia to list users from")
            .setRequired(true)
            .addChoice("Ravengarde", "Ravengarde")
            .addChoice("Ravenwood", "Ravenwood")
            .addChoice("Ravenheart", "Ravenheart")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("stage-2")
        .setDescription("Stage 2 score entry")
        .addIntegerOption((option) =>
          option
            .setName("score")
            .setDescription("Approximate score")
            .setRequired(true)
            .addChoice("10m", 10000000)
            .addChoice("20m", 20000000)
            .addChoice("30m", 30000000)
            .addChoice("40m", 40000000)
            .addChoice("50m", 50000000)
            .addChoice("60m", 60000000)
            .addChoice("70m", 70000000)
            .addChoice("80m", 80000000)
            .addChoice("90m", 90000000)
            .addChoice("100m+", 100000000)
        )
        .addStringOption((option) =>
          option
            .setName("familia")
            .setDescription("Specify the familia to list users from")
            .setRequired(true)
            .addChoice("Ravengarde", "Ravengarde")
            .addChoice("Ravenwood", "Ravenwood")
            .addChoice("Ravenheart", "Ravenheart")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("stage-3")
        .setDescription("Stage 1 score entry")
        .addIntegerOption((option) =>
          option
            .setName("score")
            .setDescription("Approximate score")
            .setRequired(true)
            .addChoice("5m", 5000000)
            .addChoice("10m", 10000000)
            .addChoice("15m", 15000000)
            .addChoice("20m", 20000000)
            .addChoice("25m", 25000000)
            .addChoice("30m", 30000000)
            .addChoice("35m", 35000000)
            .addChoice("40m", 40000000)
            .addChoice("45m", 45000000)
            .addChoice("50m+", 50000000)
        )
        .addStringOption((option) =>
          option
            .setName("familia")
            .setDescription("Specify the familia to list users from")
            .setRequired(true)
            .addChoice("Ravengarde", "Ravengarde")
            .addChoice("Ravenwood", "Ravenwood")
            .addChoice("Ravenheart", "Ravenheart")
        )
    ),
  new SlashCommandBuilder()
    .setName("log-run")
    .setDescription("Log a run of familia rush!")
    .addStringOption((option) =>
      option
        .setName("stage")
        .setDescription("Stage of the run (Must have a score logged using /mock-run)")
        .setRequired(true)
        .addChoice("stage-1", "stage-1")
        .addChoice("stage-2", "stage-2")
        .addChoice("stage-3", "stage-3")
    )
    .addStringOption((option) =>
      option
        .setName("familia")
        .setDescription("Specify the familia that you ran for (Optional)")
        .setRequired(true)
        .addChoice("Ravengarde", "Ravengarde")
        .addChoice("Ravenwood", "Ravenwood")
        .addChoice("Ravenheart", "Ravenheart")
    )
    .addIntegerOption((option) =>
      option
        .setName("count")
        .setDescription("How many runs?")
        .setRequired(true)
        .addChoice("1 run", 1)
        .addChoice("2 runs", 2)
        .addChoice("3 runs", 3)
        .addChoice("4 runs", 4)
    ),
  new SlashCommandBuilder()
    .setName("list-noruns")
    .setDescription("List of users who have not ran")
    .addStringOption((option) =>
      option
        .setName("familia")
        .setDescription("Specify the familia to list users from")
        .setRequired(true)
        .addChoice("Ravengarde", "Ravengarde")
        .addChoice("Ravenwood", "Ravenwood")
        .addChoice("Ravenheart", "Ravenheart")
    ),
  new SlashCommandBuilder()
    .setName("scoreboard")
    .setDescription("List scores for a particular stage")
    .addStringOption((option) =>
      option
        .setName("familia")
        .setDescription("Specify the familia to list users from")
        .setRequired(true)
        .addChoice("Ravengarde", "Ravengarde")
        .addChoice("Ravenwood", "Ravenwood")
        .addChoice("Ravenheart", "Ravenheart")
    )
    .addStringOption((option) =>
      option
        .setName("stage")
        .setDescription("Stage that you cleared")
        .setRequired(true)
        .addChoice("Stage-1", "stage-1")
        .addChoice("Stage-2", "stage-2")
        .addChoice("Stage-3", "stage-3")
    ),
  new SlashCommandBuilder()
    .setName("best-score")
    .setDescription(
      "List best score for each player by dividing their damage / enemy count"
    )
    .addStringOption((option) =>
      option
        .setName("familia")
        .setDescription("Specify the familia to list users from")
        .setRequired(true)
        .addChoice("Ravengarde", "Ravengarde")
        .addChoice("Ravenwood", "Ravenwood")
        .addChoice("Ravenheart", "Ravenheart")
    ),
  new SlashCommandBuilder()
    .setName("report-other-run")
    .setDescription("Log a run for someone else")
    .addUserOption((option) =>
      option.setName("runner").setDescription("Select a user").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("familia")
        .setDescription("Specify the familia to list users from")
        .setRequired(true)
        .addChoice("Ravengarde", "Ravengarde")
        .addChoice("Ravenwood", "Ravenwood")
        .addChoice("Ravenheart", "Ravenheart")
    )
    .addStringOption((option) =>
      option
        .setName("stage")
        .setDescription("Stage that you cleared")
        .setRequired(true)
        .addChoice("Stage-1", "stage-1")
        .addChoice("Stage-2", "stage-2")
        .addChoice("Stage-3", "stage-3")
    ),
  new SlashCommandBuilder()
    .setName("familia-totals")
    .setDescription("Display daily run totals for each familia"),
  new SlashCommandBuilder()
    .setName("event-scoreboard")
    .setDescription("Display current scoreboard for all participants")
    .addStringOption((option) =>
      option
        .setName("scoreboard-mode")
        .setDescription("Specify whether the mode should average by player count or not")
        .setRequired(true)
        .addChoice("Average by player count", "average")
        .addChoice("Use raw scores", "raw")
    ),
  new SlashCommandBuilder()
    .setName("log-event")
    .setDescription("Display current scoreboard for all participants")
    .addStringOption((option) =>
      option
        .setName("event")
        .setDescription("What event this is for")
        .setRequired(true)
        .addChoice("Fire Zone", "Fire")
        .addChoice("Water Zone", "Water")
        .addChoice("Light Zone", "Light")
        .addChoice("Dark Zone", "Dark")
        .addChoice("Earth Zone", "Earth")
        .addChoice("Wind Zone", "Wind")
        .addChoice("Thunder Zone", "Thunder")
    )
    .addStringOption((option) =>
      option
        .setName("familia")
        .setDescription("Specify whether the mode should average by player count or not")
        .setRequired(true)
        .addChoice("Ravengarde", "Ravengarde")
        .addChoice("Ravenwood", "Ravenwood")
        .addChoice("Ravenheart", "Ravenheart")
    )
    .addIntegerOption((option) =>
      option.setName("score").setDescription("Highest score by user").setRequired(true)
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("participated-accounts")
        .setDescription("How many accounts did this user participate with?")
    ),
  new SlashCommandBuilder()
    .setName("remove-event")
    .setDescription("Removes a user's run from the specified event")
    .addStringOption((option) =>
      option
        .setName("event")
        .setDescription("What event this is for")
        .setRequired(true)
        .addChoice("Fire Zone", "Fire")
        .addChoice("Water Zone", "Water")
        .addChoice("Light Zone", "Light")
        .addChoice("Dark Zone", "Dark")
        .addChoice("Earth Zone", "Earth")
        .addChoice("Wind Zone", "Wind")
        .addChoice("Thunder Zone", "Thunder")
    )
    .addStringOption((option) =>
      option
        .setName("familia")
        .setDescription("Specify whether the mode should average by player count or not")
        .setRequired(true)
        .addChoice("Ravengarde", "Ravengarde")
        .addChoice("Ravenwood", "Ravenwood")
        .addChoice("Ravenheart", "Ravenheart")
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("clear-event")
    .setDescription("Clears an event for all users")
    .addStringOption((option) =>
      option
        .setName("event")
        .setDescription("What event this is for")
        .setRequired(true)
        .addChoice("Fire Zone", "Fire")
        .addChoice("Water Zone", "Water")
        .addChoice("Light Zone", "Light")
        .addChoice("Dark Zone", "Dark")
        .addChoice("Earth Zone", "Earth")
        .addChoice("Wind Zone", "Wind")
        .addChoice("Thunder Zone", "Thunder")
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

rest
  .put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
    body: commands,
  })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
