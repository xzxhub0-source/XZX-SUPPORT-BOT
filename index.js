require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const OpenAI = require("openai");
const axios = require("axios");

// ================= KEYS =================
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const OPENAI_KEY = process.env.OPENAI_KEY;

// ================= CLIENT =================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

const openai = new OpenAI({ apiKey: OPENAI_KEY });

// ================= CONFIG =================
const SUPPORT_CHANNELS = ["support", "help", "tickets"];
const STAFF_ALERT_CHANNEL_NAME = "staff-alerts";
const STAFF_PING = "@XZX SUPPORT TEAM";
const KEY_API = "https://xwre.vercel.app/api/key";

const memory = new Map();

// ================= UTILS =================
async function fetchKey() {
  const res = await axios.get(KEY_API);
  return res.data;
}

async function notifyStaff(guild, issue) {
  const channel = guild.channels.cache.find(c => c.name === STAFF_ALERT_CHANNEL_NAME);
  if (!channel) return;
  channel.send(`🚨 SUPPORT NEEDED\n${STAFF_PING}\nIssue: ${issue}`);
}

async function aiReply(userId, text, imageUrl = null) {
  const history = memory.get(userId) || [];
  const messages = [
    {
      role: "system",
      content: `
You are XZX Support Bot.
- Be casual and helpful.
- Ask ONE question at a time.
- Focus on executor, mobile/PC, and errors.
- Never send users to the key website.
- If stuck, say staff will be notified.
- Never mention AI or ChatGPT.
      `
    },
    ...history
  ];

  if (imageUrl) {
    messages.push({ role: "user", content: `${text} [Image: ${imageUrl}]` });
  } else {
    messages.push({ role: "user", content: text });
  }

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages
  });

  const reply = res.choices[0].message.content;

  history.push({ role: "user", content: text });
  history.push({ role: "assistant", content: reply });
  memory.set(userId, history.slice(-10));

  return reply;
}

// ================= READY =================
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Listening in channels: ${SUPPORT_CHANNELS.join(", ")}`);
});

// ================= MESSAGE HANDLER =================
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  if (!SUPPORT_CHANNELS.includes(msg.channel.name)) return;

  const content = msg.content.toLowerCase();
  const imageUrl = msg.attachments.first()?.url || null;

  // Key request
  if (content.includes("key")) {
    try {
      const key = await fetchKey();
      return msg.reply(
        `This is a common issue — keys refresh daily.\n\nHere’s your key:\n\`${key}\`\n\nIf this doesn’t work, staff will be notified.`
      );
    } catch {
      await notifyStaff(msg.guild, "Failed to fetch key");
      return msg.reply("Could not retrieve the key. Staff has been notified.");
    }
  }

  // AI support
  try {
    const reply = await aiReply(msg.author.id, msg.content, imageUrl);
    await msg.reply(reply);

    // Escalation detection
    if (reply.toLowerCase().includes("notify staff") || content.includes("still not working")) {
      await notifyStaff(msg.guild, `User ${msg.author.tag} issue: ${msg.content}`);
    }
  } catch (err) {
    console.error(err);
    await notifyStaff(msg.guild, "AI error during support");
    msg.reply("Something broke on my side. Staff has been notified.");
  }
});

// ================= LOGIN =================
client.login(DISCORD_TOKEN);
