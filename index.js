import { Client, GatewayIntentBits, Partials } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ================= CONFIG =================
const ALLOWED_CHANNELS = [
  "🔀•𝙏𝙍𝘼𝘿𝙄𝙉𝙂",
  "🔀•𝙏𝙍𝘼𝘿𝙄𝙉𝙂•slow",
  "💬•𝘾𝙃𝘼𝙏-𝙍𝙊𝙊𝙈v1",
  "💬•𝘾𝙃𝘼𝙏-𝙍𝙊𝙊𝙈v2",
  "💬•𝘾𝙃𝘼𝙏-𝙍𝙊𝙊𝙈v3",
  "⚠️•𝘽𝙐𝙂-𝙍𝙀𝙋𝙊𝙍𝙏"
];

const SUPPORT_PING = "@XZX SUPPORT TEAM";

// ================= CLIENT =================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

// ================= GEMINI =================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ================= READY =================
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// ================= MESSAGE HANDLER =================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!ALLOWED_CHANNELS.includes(message.channel.name)) return;

  const content = message.content.toLowerCase();

  // 🔹 Only escalate if message clearly asks for staff
  const needsStaff =
    content.includes("staff") ||
    content.includes("support team") ||
    content.includes("admin");

  try {
    // 🔹 If message looks like a real issue, AI helps first
    const looksLikeIssue =
      content.includes("help") ||
      content.includes("error") ||
      content.includes("key") ||
      content.includes("not working") ||
      content.includes("doesn’t work") ||
      content.includes("didn't work") ||
      message.attachments.size > 0;

    if (!looksLikeIssue) return;

    // 🧠 Gemini prompt (ACTUAL HELP LOGIC)
    const prompt = `
You are a Discord support assistant for XZX HUB.
Help the user fix their issue clearly and step-by-step.
If the issue is unclear, ask follow-up questions.
DO NOT say you pinged staff unless absolutely necessary.

User message:
"${message.content}"
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text().slice(0, 1900);

    await message.reply(reply);

    // 🚨 Escalate ONLY if explicitly needed
    if (needsStaff) {
      await message.channel.send(
        `🚨 **SUPPORT NEEDED**\n${SUPPORT_PING}\n**Issue:** ${message.content}`
      );
    }
  } catch (err) {
    console.error("AI ERROR:", err);

    await message.channel.send(
      `🚨 **SUPPORT NEEDED**\n${SUPPORT_PING}\n**Issue:** Bot failed to process a message`
    );
  }
});

// ================= LOGIN =================
client.login(process.env.DISCORD_TOKEN);
