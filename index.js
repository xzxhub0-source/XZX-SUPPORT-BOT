import { Client, GatewayIntentBits, Partials } from "discord.js";
import fetch from "node-fetch";
import express from "express";

// ======================
// ENV CHECKS
// ======================
if (!process.env.DISCORD_TOKEN) {
  throw new Error("Missing DISCORD_TOKEN");
}

if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY not set");
}

if (!process.env.HUGGINGFACE_API_KEY) {
  console.warn("⚠️ HUGGINGFACE_API_KEY not set");
}

// ======================
// KEEP ALIVE (Backboard)
// ======================
const app = express();
app.get("/", (_, res) => res.send("Bot alive"));
app.listen(8080, () => {
  console.log("🌐 Keep-alive server running on port 8080");
});

// ======================
// DISCORD CLIENT
// ======================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

client.once("ready", () => {
  console.log(`✅ Bot online as ${client.user.tag}`);
});

// ======================
// GEMINI
// ======================
async function askGemini(prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Gemini error:", text);
    throw new Error("Gemini failed");
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text;
}

// ======================
// HUGGINGFACE (FALLBACK)
// ======================
async function askHuggingFace(prompt) {
  const res = await fetch(
    "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 200 }
      })
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ HuggingFace error:", text);
    throw new Error("HuggingFace failed");
  }

  const data = await res.json();
  return data?.[0]?.generated_text;
}

// ======================
// AI ROUTER
// ======================
async function getAIResponse(prompt) {
  try {
    return await askGemini(prompt);
  } catch {
    console.log("⚠️ Gemini failed, trying HuggingFace");
  }

  try {
    return await askHuggingFace(prompt);
  } catch {
    console.log("⚠️ HuggingFace failed");
  }

  return null;
}

// ======================
// MESSAGE HANDLER
// ======================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Only respond in help / chat channels
  const allowedChannels = [
    "🔀•𝙏𝙍𝘼𝘿𝙄𝙉𝙂",
    "🔀•𝙏𝙍𝘼𝘿𝙄𝙉𝙂•slow",
    "💬•𝘾𝙃𝘼𝙏-𝙍𝙊𝙊𝙈v1",
    "💬•𝘾𝙃𝘼𝙏-𝙍𝙊𝙊𝙈v2",
    "💬•𝘾𝙃𝘼𝙏-𝙍𝙊𝙊𝙈v3",
    "⚠️•𝘽𝙐𝙂-𝙍𝙀𝙋𝙊𝙍𝙏"
  ];

  if (!allowedChannels.includes(message.channel.name)) return;

  // Simple "needs help" detection
  const triggerWords = ["help", "doesn't work", "not working", "error", "broken"];
  const needsHelp = triggerWords.some(w =>
    message.content.toLowerCase().includes(w)
  );

  if (!needsHelp) return;

  try {
    const aiReply = await getAIResponse(message.content);

    if (!aiReply) {
      await message.reply(
        "⚠️ I’m having trouble answering right now. A human will take a look."
      );
      return;
    }

    await message.reply(aiReply);
  } catch (err) {
    console.error("❌ Bot crash prevented:", err);
  }
});

// ======================
// LOGIN
// ======================
client.login(process.env.DISCORD_TOKEN);
