import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const RESPONSES = [
  {
    keywords: ["key", "api key", "license", "access", "generate"],
    reply:
      "🔑 **Need a key?**\n" +
      "You can generate one instantly here:\n" +
      "👉 https://xwre.vercel.app/api/key\n\n" +
      "If the key doesn’t work, make sure you copied it correctly."
  },
  {
    keywords: ["help", "how", "confused", "idk"],
    reply:
      "👋 **Need help?**\n" +
      "Tell us what you’re trying to do and support will help you."
  },
  {
    keywords: ["not working", "broken", "error", "failed"],
    reply:
      "⚠️ **Something not working?**\n" +
      "Please explain what happened and include any error messages."
  },
  {
    keywords: ["login", "sign in", "auth", "token", "invalid"],
    reply:
      "🔒 **Login issue detected**\n" +
      "Make sure your key or token is valid and not expired."
  },
  {
    keywords: ["when", "how long", "waiting", "delay", "update"],
    reply:
      "⏳ **Thanks for your patience**\n" +
      "Updates are being worked on and will be announced soon."
  },
  {
    keywords: ["download", "install", "setup"],
    reply:
      "📦 **Installation help**\n" +
      "Make sure all setup steps were followed correctly."
  },
  {
    keywords: ["banned", "blacklisted", "denied", "no access"],
    reply:
      "🚫 **Access issue**\n" +
      "Access may be restricted due to rule violations or invalid keys."
  }
];

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  for (const entry of RESPONSES) {
    if (entry.keywords.some(k => content.includes(k))) {
      await message.reply(entry.reply);
      return;
    }
  }

  await message.reply(
    "💬 **Support received**\n" +
    "A support member will review your message shortly."
  );
});

client.login(process.env.DISCORD_TOKEN);
