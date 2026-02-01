import { Client, GatewayIntentBits } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

/* =====================
   ENV VARIABLES
===================== */
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const GEMINI_KEY = process.env.GEMINI_KEY;
const OPENAI_KEY = process.env.OPENAI_KEY;

if (!DISCORD_TOKEN) {
  console.error("❌ Missing DISCORD_TOKEN");
  process.exit(1);
}

/* =====================
   DISCORD CLIENT
===================== */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

/* =====================
   AI CLIENTS
===================== */
let gemini = null;
let openai = null;

if (GEMINI_KEY) {
  gemini = new GoogleGenerativeAI(GEMINI_KEY)
    .getGenerativeModel({ model: "gemini-pro" });
}

if (OPENAI_KEY) {
  openai = new OpenAI({ apiKey: OPENAI_KEY });
}

/* =====================
   CHANNELS
===================== */
const ALLOWED_CHANNELS = [
  "🔀•𝙏𝙍𝘼𝘿𝙄𝙉𝙂",
  "🔀•𝙏𝙍𝘼𝘿𝙄𝙉𝙂•slow",
  "💬•𝘾𝙃𝘼𝙏-𝙍𝙊𝙊𝙈v1",
  "💬•𝘾𝙃𝘼𝙏-𝙍𝙊𝙊𝙈v2",
  "💬•𝘾𝙃𝘼𝙏-𝙍𝙊𝙊𝙈v3",
  "⚠️•𝘽𝙐𝙂-𝙍𝙀𝙋𝙊𝙍𝙏"
];

/* =====================
   AI HELP FUNCTION
===================== */
async function getAIResponse(userMessage) {
  const prompt = `
You are a Discord support assistant.
Be helpful, clear, and try to solve the problem.

User message:
"${userMessage}"
`;

  /* ---- Try Gemini first ---- */
  if (gemini) {
    try {
      const res = await gemini.generateContent(prompt);
      const text = res.response.text();
      if (text && text.length > 5) return text;
    } catch (e) {
      console.warn("⚠️ Gemini failed");
    }
  }

  /* ---- Fallback to OpenAI ---- */
  if (openai) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      });
      return completion.choices[0].message.content;
    } catch (e) {
      console.warn("⚠️ OpenAI failed");
    }
  }

  /* ---- Both failed ---- */
  return null;
}

/* =====================
   READY
===================== */
client.once("ready", () => {
  console.log(`✅ Bot online as ${client.user.tag}`);
});

/* =====================
   MESSAGE HANDLER
===================== */
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!ALLOWED_CHANNELS.includes(message.channel.name)) return;

  const aiReply = await getAIResponse(message.content);

  if (aiReply) {
    await message.reply(aiReply.slice(0, 1900));
  } else {
    await message.reply(
      "🚨 **SUPPORT NEEDED**\n@XZX SUPPORT TEAM\n**Issue:** Bot failed to process a message"
    );
  }
});

/* =====================
   LOGIN
===================== */
client.login(DISCORD_TOKEN);
