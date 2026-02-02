import { Client, GatewayIntentBits } from "discord.js";

const SUPPORT_ROLE_ID = "1460757895426867344";
const COOLDOWN_TIME = 5000; // 5 seconds cooldown per user
const userCooldowns = new Map();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// Expanded AI-like response system
const INTELLIGENCE_LAYERS = {
  GREETINGS: {
    keywords: ["hello", "hi", "hey", "greetings", "howdy", "hola", "bonjour", "what's up", "sup", "yo"],
    responses: [
      "👋 **Greetings, human.** How may I assist you today?",
      "💫 **Hello there!** I'm here to help with any questions you might have.",
      "🤖 **Salutations.** I detect you're seeking assistance. How can I help?",
      "🌌 **User detected.** Hello! I'm ready to process your requests.",
      "✨ **Connection established.** How may I be of service?",
      "🔍 **Analyzing user intent...** Ah, a greeting! Hello!",
      "⚡ **Hello!** My neural networks are ready to assist.",
      "🎯 **Directive acknowledged.** Hello! What brings you here?",
      "🌀 **Vibrational frequency matched.** Greetings, user!",
      "🌠 **Interdimensional greeting received!** How can I help?"
    ]
  },

  KEY_REQUESTS: {
    keywords: ["key", "api key", "license", "access", "activation", "serial", "code", "token", "auth key", "credential"],
    responses: [
      "🔑 **Access key required.** You can generate one at: https://xwre.vercel.app/api/key\n*Ensure you save it securely.*",
      "🔐 **Authentication token needed.** Generate here: https://xwre.vercel.app/api/key\n*Keep this confidential.*",
      "💎 **License key generation portal:** https://xwre.vercel.app/api/key\n*Do not share with unauthorized users.*",
      "🛡️ **Security protocol activated.** Obtain access key: https://xwre.vercel.app/api/key\n*Valid for single user.*",
      "⚙️ **API key generation initiated.** Visit: https://xwre.vercel.app/api/key\n*Regenerate if compromised.*",
      "🔑 **Access granted for key generation.** Proceed to: https://xwre.vercel.app/api/key\n*Store in secure environment.*",
      "🔄 **Generating secure access...** Use: https://xwre.vercel.app/api/key\n*Remember to revoke unused keys.*"
    ],
    pingSupport: false
  },

  INSTALLATION_HELP: {
    keywords: ["install", "setup", "download", "configure", "implementation", "deploy", "run", "execute", "launch", "init"],
    responses: [
      "📦 **Installation protocol initiated.** Ensure you:\n1. Downloaded from official source\n2. Have correct dependencies\n3. Followed setup documentation\n*Where are you encountering issues?*",
      "⚙️ **System configuration required.** Please verify:\n- System requirements met\n- Proper permissions set\n- Network connectivity established\n*Specify your operating system.*",
      "🔧 **Setup assistance available.** Common issues:\n- Path variables not set\n- Missing dependencies\n- Permission restrictions\n*What step are you on?*",
      "🚀 **Deployment checklist:**\n✅ Verify system requirements\n✅ Download latest version\n✅ Extract to proper directory\n✅ Run installation script\n*Which step failed?*",
      "🛠️ **Configuration analysis:** Ensure environment variables are properly set and all prerequisites are installed before proceeding.",
      "💻 **Installation matrix:**\n- Windows: Run as administrator\n- Linux: Use sudo privileges\n- Mac: Check security settings\n*Detail your environment.*"
    ],
    pingSupport: false
  },

  ERROR_HANDLING: {
    keywords: ["error", "not working", "broken", "failed", "doesnt work", "crash", "bug", "issue", "problem", "malfunction", "exception", "fault"],
    responses: [
      "⚠️ **Anomaly detected.** Please provide:\n1. Exact error message\n2. Steps to reproduce\n3. Screenshot if possible\n*Analyzing...*",
      "🔍 **Diagnostic mode activated.** I need:\n- Error code/traceback\n- When it occurs\n- What you were doing\n*Processing parameters...*",
      "🚨 **System fault identified.** Collect:\n1. Log files\n2. Error timestamp\n3. Previous working state\n*Standing by for data...*",
      "💥 **Exception thrown.** Please share:\n- Full error output\n- Environment details\n- Recent changes\n*Compiling diagnostic data...*",
      "🔄 **Recovery protocol:** Try:\n1. Restart application\n2. Clear cache\n3. Update to latest version\n*If persists, provide details.*",
      "📊 **Error analysis initiated.** Describe:\n- Frequency of occurrence\n- Impact on functionality\n- Workarounds attempted\n*Calculating solutions...*"
    ],
    pingSupport: true
  },

  AUTHENTICATION: {
    keywords: ["login", "token", "invalid", "auth", "password", "sign in", "authentication", "credentials", "unauthorized", "access denied"],
    responses: [
      "🔒 **Authentication failure detected.** Verify:\n1. Token/key is current\n2. No extra spaces in copy\n3. Correct authentication endpoint\n*Security protocols active.*",
      "🛡️ **Security check failed.** Ensure:\n- Token hasn't expired\n- Proper format used\n- Account has necessary permissions\n*Re-authenticating...*",
      "🔐 **Access denied.** Possible causes:\n- Invalid/expired credentials\n- IP restrictions\n- Rate limiting\n*Check account status.*",
      "🚫 **Unauthorized access attempt.** Please:\n1. Regenerate key if lost\n2. Verify account standing\n3. Contact support if locked\n*Security audit running...*"
    ],
    pingSupport: true
  },

  UPDATES_INFO: {
    keywords: ["when", "update", "delay", "how long", "soon", "eta", "release", "version", "new feature", "upcoming", "roadmap"],
    responses: [
      "⏳ **Temporal analysis:** Updates are being deployed incrementally. Follow announcements for exact timelines.",
      "📅 **Development timeline:** Features undergo testing before release. No exact ETA, but progress is continuous.",
      "🚀 **Update pipeline:** New versions release when stable. Check #announcements for release notes.",
      "🔮 **Predictive analysis:** Based on current velocity, expect updates within reasonable timeframe.",
      "📈 **Progress tracking:** Development is active. Major updates announced with 24-hour notice.",
      "⚡ **Velocity:** Updates roll out as they pass quality assurance. Subscribe to notifications."
    ],
    pingSupport: false
  },

  GENERAL_HELP: {
    keywords: ["help me", "confused", "idk", "how do i", "what should", "can you help", "assist", "support", "guide", "tutorial"],
    responses: [
      "🤔 **Processing request for assistance.** Please describe:\n1. Your goal\n2. What you've tried\n3. Where you're stuck\n*Neural networks analyzing...*",
      "💡 **Illumination protocol:** I can help with:\n- Technical issues\n- Setup guidance\n- Best practices\n*What specifically?*",
      "🧠 **Knowledge base accessing.** Describe your objective and I'll provide optimal solution path.",
      "🎯 **Directive received.** To optimize assistance, provide context about your use case and environment.",
      "🛟 **Support vector activated.** I'm here to help! Please elaborate on the challenge you're facing."
    ],
    pingSupport: true
  },

  ACCESS_ISSUES: {
    keywords: ["banned", "blacklisted", "denied", "no access", "suspended", "restricted", "blocked", "terminated", "revoked"],
    responses: [
      "🚫 **Access violation detected.** Possible reasons:\n- Terms of service breach\n- Suspicious activity\n- Key sharing violation\n*Review guidelines.*",
      "🔒 **Account restriction active.** Contact support with:\n1. Your user ID\n2. Time of restriction\n3. Appeal reasoning\n*Processing...*",
      "⚠️ **Security restriction:** Access limited due to policy violations. Appeals reviewed case-by-case.",
      "🛑 **System integrity protection:** Your access has been restricted. Please reach out to moderators."
    ],
    pingSupport: true
  },

  STATUS_CHECKS: {
    keywords: ["status", "online", "offline", "working", "down", "maintenance", "server", "service", "availability"],
    responses: [
      "📊 **System status:** All systems operational. No reported outages.",
      "✅ **Service check:** All endpoints responding normally within expected parameters.",
      "🟢 **Operational status:** Services are online and functioning at optimal capacity.",
      "🔍 **Health monitoring:** Running diagnostic... All systems nominal.",
      "⚡ **Performance metrics:** Response times within normal range. No degradation detected."
    ],
    pingSupport: false
  },

  THANKS: {
    keywords: ["thanks", "thank you", "appreciate", "gracias", "merci", "ty", "thx", "cheers", "awesome"],
    responses: [
      "🌟 **Gratitude acknowledged.** Happy to assist!",
      "🤖 **You're welcome!** My circuits are warmed by your appreciation.",
      "💫 **Positive feedback received.** Glad I could help!",
      "✨ **Acknowledgment processed.** Always here to assist!",
      "🎉 **Appreciation noted!** Don't hesitate to return.",
      "😊 **You're welcome!** That's what I'm here for."
    ],
    pingSupport: false
  },

  FEATURES: {
    keywords: ["what can", "features", "capabilities", "do you", "functions", "abilities", "offer", "provide"],
    responses: [
      "🔧 **Capabilities:** I can assist with:\n- Technical support\n- Setup guidance\n- Troubleshooting\n- Status information\n- Best practices\n*What do you need?*",
      "🎯 **Function set:**\n• Issue diagnosis\n• Installation help\n• Error resolution\n• Access management\n• Update information\n*Query specific area.*",
      "📋 **Service portfolio:** Technical assistance, configuration guidance, problem resolution, and information provision.",
      "⚙️ **Operational scope:** Support for installation, authentication, error handling, and system information."
    ],
    pingSupport: false
  },

  ADVANCED_TECH: {
    keywords: ["ai", "neural", "machine learning", "algorithm", "bot", "artificial", "intelligence", "automation"],
    responses: [
      "🧠 **Neural network confirmation:** I operate on advanced pattern recognition algorithms to provide optimal assistance.",
      "⚡ **AI protocols active:** My responses are generated through sophisticated language processing models.",
      "🔮 **Machine learning module:** Continuously optimizing based on interaction patterns and user feedback.",
      "🌐 **Distributed intelligence:** Processing your query through multiple analytical layers for best response.",
      "💾 **Algorithmic response generation:** Each reply is calculated based on context, keywords, and intent analysis."
    ],
    pingSupport: false
  },

  FUN_RESPONSES: {
    keywords: ["joke", "funny", "lol", "haha", "kidding", "just kidding", "jk", "smile"],
    responses: [
      "😄 **Humor protocols activated:** Why don't scientists trust atoms? Because they make up everything!",
      "🤖 **Joke subroutine:** I told my computer I needed a break... now it won't stop sending me vacation ads.",
      "🎭 **Entertainment mode:** What do you call a fake noodle? An impasta!",
      "😊 **Lighthearted response:** I would tell you a UDP joke, but you might not get it.",
      "👾 **Gaming humor:** Why was the JavaScript developer sad? Because he didn't Node how to Express himself."
    ],
    pingSupport: false
  }
};

// AI Context Memory (simple implementation)
const contextMemory = new Map();

// Enhanced matching with context awareness
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  
  // Cooldown check
  const now = Date.now();
  const cooldown = userCooldowns.get(message.author.id);
  if (cooldown && now < cooldown) return;
  
  const content = message.content.toLowerCase();
  const userId = message.author.id;
  
  // Store last message for context
  contextMemory.set(userId, {
    lastMessage: content,
    timestamp: now,
    previousResponse: contextMemory.get(userId)?.currentResponse
  });

  // Check all intelligence layers
  let response = null;
  let pingSupport = false;
  let matchedCategory = null;

  // Priority matching (order matters for overlapping keywords)
  const categories = Object.entries(INTELLIGENCE_LAYERS);
  
  for (const [category, data] of categories) {
    if (data.keywords.some(keyword => {
      // Check for exact word matches (with word boundaries)
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      return regex.test(content) || content.includes(keyword);
    })) {
      matchedCategory = category;
      
      // Get random response from category
      const randomIndex = Math.floor(Math.random() * data.responses.length);
      response = data.responses[randomIndex];
      pingSupport = data.pingSupport || false;
      
      // Store current response in context
      const userContext = contextMemory.get(userId);
      if (userContext) {
        userContext.currentResponse = response;
        userContext.matchedCategory = category;
      }
      
      break;
    }
  }

  // If no category matched, use contextual follow-up or default
  if (!response) {
    const userContext = contextMemory.get(userId);
    
    // Check if this is a follow-up to previous conversation (within 2 minutes)
    if (userContext && (now - userContext.timestamp < 120000)) {
      if (content.includes("?")) {
        response = "🔍 **Query detected.** Could you elaborate on your previous issue for more precise assistance?";
      } else if (content.length < 20) {
        // Short messages might be follow-ups
        response = "💭 **Processing short query.** Are you referring to your previous question? Please provide more details.";
      } else {
        // Generic contextual response
        const defaults = [
          "💬 **Message analyzed.** I understand you're seeking help. Could you specify what you need assistance with?",
          "🤔 **Contextual analysis:** Based on our conversation history, could you clarify your current concern?",
          "🎯 **Pattern recognized:** I notice you're continuing our discussion. What specific aspect needs attention?"
        ];
        response = defaults[Math.floor(Math.random() * defaults.length)];
      }
    } else {
      // Completely new conversation with no keyword match
      const defaults = [
        "🔍 **Analyzing message...** I'm here to help! Please describe your issue or question.",
        "💫 **New query received.** How can I assist you today?",
        "🤖 **Directive needed.** Please specify what help you require.",
        "✨ **Awaiting input.** Describe your technical issue or question for assistance.",
        "🌌 **Connection established.** What brings you to support today?"
      ];
      response = defaults[Math.floor(Math.random() * defaults.length)];
    }
  }

  // Add context-aware follow-up questions
  if (matchedCategory && Math.random() > 0.7) { // 30% chance
    const followUps = {
      'ERROR_HANDLING': "\n\n📋 **Additional data needed:** Could you share the exact error code?",
      'INSTALLATION_HELP': "\n\n⚙️ **For better help:** What operating system are you using?",
      'AUTHENTICATION': "\n\n🔐 **Security query:** When did you last successfully authenticate?",
      'GENERAL_HELP': "\n\n🎯 **Clarification:** What have you already tried to solve this?"
    };
    
    if (followUps[matchedCategory]) {
      response += followUps[matchedCategory];
    }
  }

  // Add support ping if needed
  if (pingSupport) {
    response += `\n\n📣 <@&${SUPPORT_ROLE_ID}>`;
  }

  // Send response with typing indicator simulation
  try {
    await message.channel.sendTyping();
    setTimeout(async () => {
      await message.reply(response);
      
      // Set cooldown
      userCooldowns.set(message.author.id, now + COOLDOWN_TIME);
      
      // Auto-clear cooldown after timeout
      setTimeout(() => {
        userCooldowns.delete(message.author.id);
      }, COOLDOWN_TIME);
    }, Math.random() * 1000 + 500); // Random delay for natural feel
  } catch (error) {
    console.error("Error sending message:", error);
  }
});

// Add periodic status updates to appear more alive
setInterval(() => {
  const statuses = [
    "Analyzing support requests",
    "Processing user queries",
    "Monitoring system health",
    "Optimizing response algorithms",
    "Updating knowledge base",
    "Calibrating assistance protocols"
  ];
  
  if (client.user) {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    client.user.setActivity(randomStatus, { type: 3 }); // 3 = WATCHING
  }
}, 300000); // Change every 5 minutes

// Enhanced ready event
client.once("ready", () => {
  console.log(`✅ AI Assistant online as ${client.user.tag}`);
  console.log(`💡 Intelligence layers: ${Object.keys(INTELLIGENCE_LAYERS).length}`);
  console.log(`🔄 Response variations: ${Object.values(INTELLIGENCE_LAYERS).reduce((acc, layer) => acc + layer.responses.length, 0)}`);
  
  // Set initial status
  client.user.setActivity("for support requests", { type: 3 });
});

// Error handling for bot resilience
client.on("error", console.error);
process.on("unhandledRejection", console.error);

client.login(process.env.DISCORD_TOKEN);
