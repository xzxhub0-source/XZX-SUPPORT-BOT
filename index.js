import { Client, GatewayIntentBits } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

/* ===============================
   ENV CHECK
================================ */
if (!process.env.DISCORD_TOKEN) {
  throw new Error("DISCORD_TOKEN is missing");
}
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing");
}

/* ===============================
   DISCORD CLIENT
================================ */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

/* ===============================
   GEMINI SETUP
================================ */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/* ===============================
   SYSTEM PROMPT (AI BRAIN)
================================ */
const SYSTEM_PROMPT = `
You are XZX Support Bot for the XZX Hub Discord.

Your job is to HELP users first, not immediately ping staff.

Rules:
- Always try to troubleshoot first
- Ask follow-up questions if unclear
- Be casual and helpful
- Do NOT ping staff unless necessary

KNOWN INFO:
- XZX Hub keys refresh DAILY
- Key site: https://xwre.vercel.app/api/key
- Delta executor works on mobile
- Most issues = expired key or wrong executor

ONLY escalate if:
- User says it still doesn’t work after steps
- User says they tried everything
- User explicitly asks for staff

If escalation is needed, respond ONLY with:

🚨 SUPPORT NEEDED
@XZX SUPPORT TEAM
Issue: <summary>
`;

/* ===============================
   HELPERS
================================ */
async function getAIResponse(userMessage) {
  const result = await model.generateContent([
    SYSTEM_PROMPT,
    userMessage
  ]);
  return result.response.text();
}

function shouldEscalate(message) {
  const triggers = [
    "still not working",
    "doesn't work",
    "doesnt work",
    "tried everything",
    "nothing works",
    "same issue",
    "error",
    "crash",
    "bug"
  ];

  return triggers.some(t =>
    message.toLowerCase().includes(t)
  );
}

/* ===============================
   MESSAGE HANDLER
================================ */
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  try {
    // 1️⃣ AI tries to help first
    const aiReply = await getAIResponse(message.content);
    await message.reply(aiReply);

    // 2️⃣ Escalate ONLY if needed
    if (shouldEscalate(message.content)) {
      await message.channel.send(
`🚨 SUPPORT NEEDED
@XZX SUPPORT TEAM
Issue: ${message.content}`
      );
    }

  } catch (err) {
    console.error(err);
    await message.reply(
      "Something broke on my side 😅 I’ve alerted the support team."
    );

    await message.channel.send(
`🚨 SUPPORT NEEDED
@XZX SUPPORT TEAM
Issue: Bot error while handling message`
    );
  }
});

/* ===============================
   READY
================================ */
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

/* ===============================
   LOGIN
================================ */
client.login(process.env.DISCORD_TOKEN);
