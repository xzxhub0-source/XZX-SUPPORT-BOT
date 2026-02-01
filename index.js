import { Client, GatewayIntentBits } from "discord.js";
import express from "express";
import fetch from "node-fetch";

// ─── DISCORD SETUP ────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Channels the bot is allowed to respond in
const HELP_CHANNELS = [
  "🔀•𝙏𝙍𝘼𝘿𝙄𝙉𝙂",
  "🔀•𝙏𝙍𝘼𝘿𝙄𝙉𝙂•slow",
  "💬•𝘾𝙃𝘼𝙏-𝙍𝙊𝙊𝙈v1",
  "💬•𝘾𝙃𝘼𝙏-𝙍𝙊𝙊𝙈v2",
  "💬•𝘾𝙃𝘼𝙏-𝙍𝙊𝙊𝙈v3",
  "⚠️•𝘽𝙐𝙂-𝙍𝙀𝙋𝙊𝙍𝙏"
];

// ─── KEEP ALIVE (RAILWAY / RENDER SAFE) ───────────────────────
const app = express();
app.get("/", (_, res) => res.send("Bot alive"));
app.listen(8080, () =>
  console.log("🌐 Keep-alive server running on port 8080")
);

// ─── AI PROVIDERS ─────────────────────────────────────────────
async function askOpenAI(prompt) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    })
  });

  if (!res.ok) throw new Error("OpenAI request failed");

  const data = await res.json();
  return data.choices?.[0]?.message?.content;
}

async function askDeepSeek(prompt) {
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    })
  });

  if (!res.ok) throw new Error("DeepSeek request failed");

  const data = await res.json();
  return data.choices?.[0]?.message?.content;
}

// ─── FALLBACK LOGIC ───────────────────────────────────────────
async function getAIResponse(prompt) {
  try {
    return await askOpenAI(prompt);
  } catch (err) {
    console.log("⚠️ OpenAI failed, switching to DeepSeek");
  }

  try {
    return await askDeepSeek(prompt);
  } catch (err) {
    console.log("⚠️ DeepSeek failed");
  }

  return null;
}

// ─── MESSAGE HANDLER ──────────────────────────────────────────
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!HELP_CHANNELS.includes(message.channel.name)) return;

  const looksLikeHelp =
    /(help|error|bug|not working|broken|issue)/i.test(message.content);

  if (!looksLikeHelp) return;

  const response = await getAIResponse(message.content);

  if (response) {
    await message.reply(response);
  } else {
    await message.reply(
      `🚨 **SUPPORT NEEDED**\n<@&${process.env.SUPPORT_ROLE_ID}>\n**Issue:** AI providers unavailable`
    );
  }
});

// ─── READY EVENT (DISCORD.JS v14 SAFE) ────────────────────────
client.once("clientReady", () => {
  console.log(`✅ Bot online as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
