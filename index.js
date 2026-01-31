import { Client, GatewayIntentBits, Partials } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const ALLOWED_CHANNELS = [
  "🔀•𝙏𝙍𝘼𝘿𝙄𝙉𝙂",
  "🔀•𝙏𝙍𝘼𝘿𝙄𝙉𝙂•slow",
  "💬•𝘾𝙃𝘼𝙏-𝙍𝙊𝙊𝙈v1",
  "💬•𝘾𝙃𝘼𝙏-𝙍𝙊𝙊𝙈v2",
  "💬•𝘾𝙃𝘼𝙏-𝙍𝙊𝙊𝙈v3",
  "⚠️•𝘽𝙐𝙂-𝙍𝙀𝙋𝙊𝙍𝙏"
];

const HELP_TRIGGERS = [
  "help",
  "not working",
  "doesn't work",
  "error",
  "bug",
  "issue",
  "problem"
];

client.once("ready", () => {
  console.log(`✅ XZX Support Bot logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!ALLOWED_CHANNELS.includes(message.channel.name)) return;

  const content = message.content.toLowerCase();
  const needsHelp = HELP_TRIGGERS.some(t => content.includes(t));
  const hasImage = message.attachments.size > 0;

  if (!needsHelp && !hasImage) return;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt = `
You are XZX HUB support staff.
Help the user troubleshoot issues with XZX Hub.
Ask clear follow-up questions.
If key-related, give ONLY this link:
https://xwre.vercel.app/api/key
Never paste the raw key.
If executor-related, ask which executor and device.
If unsure, say staff will be notified.
`;

    if (hasImage) {
      prompt += "\nUser sent an image describing a problem. Analyze it.";
    }

    prompt += `\nUser message: "${message.content}"`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    await message.reply(reply);

  } catch (err) {
    console.error(err);

    await message.reply(
      `🚨 **SUPPORT NEEDED**  
@XZX SUPPORT TEAM  
**Issue:** ${message.content}`
    );
  }
});

client.login(process.env.DISCORD_TOKEN);
