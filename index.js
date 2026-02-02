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

// Define when to respond and when to stay silent
const RESPONSE_TRIGGERS = {
  // Explicit help requests
  HELP_KEYWORDS: ["help", "support", "assist", "guide", "tutorial", "how to", "can you", "could you", "would you", "please help"],
  
  // Questions
  QUESTION_WORDS: ["how", "what", "why", "when", "where", "which", "who", "?", "can i", "is it", "does it", "will it", "should i"],
  
  // Problem indicators
  PROBLEM_KEYWORDS: ["error", "issue", "problem", "broken", "not working", "failed", "crash", "bug", "stuck", "trouble", "malfunction", "fix", "solve", "resolve"],
  
  // Technical terms that indicate need for assistance
  TECHNICAL_KEYWORDS: ["install", "setup", "configure", "download", "key", "api", "token", "auth", "login", "password", "access", "license", "update", "upgrade", "deploy"],
  
  // Don't respond to these (social/conversational)
  IGNORE_KEYWORDS: ["lol", "haha", "good morning", "good night", "wyd", "hru", "brb", "afk", "gg", "nice", "cool", "awesome", "bad", "sad", "happy", "weather", "game", "playing", "watch", "movie", "food", "eat", "drink", "sleep"]
};

// Expanded AI-like response system (only for help contexts)
const INTELLIGENCE_LAYERS = {
  KEY_REQUESTS: {
    keywords: ["key", "api key", "license", "access", "activation", "serial", "code", "token", "auth key", "credential", "generate key"],
    responses: [
      "🔑 **Access key required.** You can generate one at: https://xwre.vercel.app/api/key\n*Ensure you save it securely.*",
      "🔐 **Authentication token needed.** Generate here: https://xwre.vercel.app/api/key\n*Keep this confidential.*",
      "💎 **License key generation portal:** https://xwre.vercel.app/api/key\n*Do not share with unauthorized users.*"
    ],
    pingSupport: false
  },

  INSTALLATION_HELP: {
    keywords: ["install", "setup", "download", "configure", "implementation", "deploy", "run", "execute", "launch", "init", "get started"],
    responses: [
      "📦 **Installation protocol initiated.** Ensure you:\n1. Downloaded from official source\n2. Have correct dependencies\n3. Followed setup documentation\n*Where are you encountering issues?*",
      "⚙️ **System configuration required.** Please verify:\n- System requirements met\n- Proper permissions set\n- Network connectivity established\n*Specify your operating system.*"
    ],
    pingSupport: false
  },

  ERROR_HANDLING: {
    keywords: ["error", "not working", "broken", "failed", "doesnt work", "crash", "bug", "issue", "problem", "malfunction", "exception", "fault", "fix", "repair", "solve"],
    responses: [
      "⚠️ **Anomaly detected.** Please provide:\n1. Exact error message\n2. Steps to reproduce\n3. Screenshot if possible\n*Analyzing...*",
      "🔍 **Diagnostic mode activated.** I need:\n- Error code/traceback\n- When it occurs\n- What you were doing\n*Processing parameters...*"
    ],
    pingSupport: true
  },

  AUTHENTICATION: {
    keywords: ["login", "token", "invalid", "auth", "password", "sign in", "authentication", "credentials", "unauthorized", "access denied", "cannot log in"],
    responses: [
      "🔒 **Authentication failure detected.** Verify:\n1. Token/key is current\n2. No extra spaces in copy\n3. Correct authentication endpoint\n*Security protocols active.*",
      "🛡️ **Security check failed.** Ensure:\n- Token hasn't expired\n- Proper format used\n- Account has necessary permissions\n*Re-authenticating...*"
    ],
    pingSupport: true
  },

  UPDATES_INFO: {
    keywords: ["when update", "how long update", "eta", "new version", "upcoming feature", "roadmap", "release date", "when will", "coming soon", "next update"],
    responses: [
      "⏳ **Temporal analysis:** Updates are being deployed incrementally. Follow announcements for exact timelines.",
      "📅 **Development timeline:** Features undergo testing before release. No exact ETA, but progress is continuous."
    ],
    pingSupport: false
  },

  GENERAL_HELP: {
    keywords: ["help me", "confused", "idk", "how do i", "what should", "can you help", "assist me", "support needed", "need guidance", "stuck on"],
    responses: [
      "🤔 **Processing request for assistance.** Please describe:\n1. Your goal\n2. What you've tried\n3. Where you're stuck\n*Neural networks analyzing...*",
      "💡 **Illumination protocol:** I can help with:\n- Technical issues\n- Setup guidance\n- Best practices\n*What specifically?*"
    ],
    pingSupport: true
  },

  ACCESS_ISSUES: {
    keywords: ["banned", "blacklisted", "denied", "no access", "suspended", "restricted", "blocked", "terminated", "revoked", "cannot access"],
    responses: [
      "🚫 **Access violation detected.** Possible reasons:\n- Terms of service breach\n- Suspicious activity\n- Key sharing violation\n*Review guidelines.*",
      "🔒 **Account restriction active.** Contact support with:\n1. Your user ID\n2. Time of restriction\n3. Appeal reasoning\n*Processing...*"
    ],
    pingSupport: true
  },

  STATUS_CHECKS: {
    keywords: ["status", "online", "offline", "working", "down", "maintenance", "server", "service", "availability", "is it down", "server status"],
    responses: [
      "📊 **System status:** All systems operational. No reported outages.",
      "✅ **Service check:** All endpoints responding normally within expected parameters."
    ],
    pingSupport: false
  },

  SPECIFIC_QUESTIONS: {
    keywords: ["what is", "how does", "why does", "where to", "which one", "can i use", "is there a", "does this work with", "compatible with"],
    responses: [
      "🎯 **Specific query detected.** Could you provide more details about your use case?",
      "🔍 **Detailed question received.** I need more context to give an accurate answer."
    ],
    pingSupport: false
  }
};

// Check if message needs help response
function needsHelpResponse(message) {
  const content = message.content.toLowerCase();
  
  // Don't respond to very short messages (likely social)
  if (content.length < 5) return false;
  
  // Don't respond to URLs only
  if (content.match(/^https?:\/\/\S+$/)) return false;
  
  // Check for ignore keywords (social conversation)
  const hasIgnoreKeyword = RESPONSE_TRIGGERS.IGNORE_KEYWORDS.some(keyword => 
    content.includes(keyword) || new RegExp(`\\b${keyword}\\b`, 'i').test(content)
  );
  
  if (hasIgnoreKeyword) return false;
  
  // Check for explicit help requests
  const hasHelpKeyword = RESPONSE_TRIGGERS.HELP_KEYWORDS.some(keyword => 
    content.includes(keyword) && content.length > 10 // Ensure it's not just "help"
  );
  
  // Check for questions
  const hasQuestionWord = RESPONSE_TRIGGERS.QUESTION_WORDS.some(keyword => 
    content.includes(keyword) || content.endsWith('?')
  );
  
  // Check for problem indicators
  const hasProblemKeyword = RESPONSE_TRIGGERS.PROBLEM_KEYWORDS.some(keyword =>
    content.includes(keyword)
  );
  
  // Check for technical terms (in context of needing help)
  const hasTechnicalKeyword = RESPONSE_TRIGGERS.TECHNICAL_KEYWORDS.some(keyword =>
    content.includes(keyword) && (hasQuestionWord || content.length > 15)
  );
  
  // Must have at least one trigger AND not be obviously social
  const shouldRespond = (hasHelpKeyword || hasProblemKeyword || 
                        (hasQuestionWord && hasTechnicalKeyword) ||
                        (hasTechnicalKeyword && content.length > 20));
  
  return shouldRespond;
}

// Check if message matches any specific help category
function getHelpCategory(message) {
  const content = message.content.toLowerCase();
  
  for (const [category, data] of Object.entries(INTELLIGENCE_LAYERS)) {
    if (data.keywords.some(keyword => {
      // Check for exact word matches (with word boundaries)
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      return regex.test(content) || content.includes(keyword);
    })) {
      return { category, data };
    }
  }
  
  return null;
}

// Context memory for follow-ups
const contextMemory = new Map();

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  
  // Cooldown check
  const now = Date.now();
  const cooldown = userCooldowns.get(message.author.id);
  if (cooldown && now < cooldown) return;
  
  const userId = message.author.id;
  const content = message.content.toLowerCase();
  
  // Store context
  contextMemory.set(userId, {
    lastMessage: content,
    timestamp: now,
    lastInteraction: contextMemory.get(userId)?.lastInteraction
  });
  
  // First check: Does this message need help at all?
  if (!needsHelpResponse(message)) {
    // Check if this is a follow-up to a previous help conversation (within 2 minutes)
    const userContext = contextMemory.get(userId);
    const isFollowUp = userContext && 
                      (now - userContext.timestamp < 120000) && 
                      userContext.lastInteraction === 'help';
    
    if (!isFollowUp) {
      // Not a help request and not a follow-up - stay silent
      return;
    }
    // If it's a follow-up, continue to help response
  }
  
  // Mark this as a help interaction
  const userContext = contextMemory.get(userId);
  if (userContext) {
    userContext.lastInteraction = 'help';
  }
  
  // Get specific help category if any
  const helpCategory = getHelpCategory(message);
  let response = null;
  let pingSupport = false;
  
  if (helpCategory) {
    // Get random response from category
    const { data } = helpCategory;
    const randomIndex = Math.floor(Math.random() * data.responses.length);
    response = data.responses[randomIndex];
    pingSupport = data.pingSupport || false;
  } else {
    // Generic help response for non-categorized help requests
    const genericResponses = [
      "🤖 **Support protocol activated.** I'm here to help! Please describe your issue in detail.",
      "🔍 **Analyzing request...** Could you provide more specifics about what you need assistance with?",
      "💡 **General assistance mode.** What seems to be the problem? The more details you provide, the better I can help.",
      "🎯 **Help request received.** Please explain:\n1. What you're trying to do\n2. What's happening instead\n3. Any error messages"
    ];
    response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
  }
  
  // Add support ping if needed
  if (pingSupport) {
    response += `\n\n📣 <@&${SUPPORT_ROLE_ID}>`;
  }
  
  // Send response with natural delay
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
    }, Math.random() * 800 + 700); // 700-1500ms delay
  } catch (error) {
    console.error("Error sending message:", error);
  }
});

// Auto-reset context after 5 minutes of inactivity
setInterval(() => {
  const now = Date.now();
  for (const [userId, context] of contextMemory.entries()) {
    if (now - context.timestamp > 300000) { // 5 minutes
      contextMemory.delete(userId);
    }
  }
}, 60000); // Check every minute

// Periodic status updates
setInterval(() => {
  if (client.user) {
    const statuses = [
      "Monitoring for help requests",
      "Standing by for technical issues",
      "Ready to assist with problems",
      "Awaiting support queries"
    ];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    client.user.setActivity(randomStatus, { type: 3 });
  }
}, 300000);

client.once("ready", () => {
  console.log(`✅ Smart Support Bot online as ${client.user.tag}`);
  console.log(`⚡ Will only respond to explicit help requests`);
  client.user.setActivity("for help requests", { type: 3 });
});

client.login(process.env.DISCORD_TOKEN);
