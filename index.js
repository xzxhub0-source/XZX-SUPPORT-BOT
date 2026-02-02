import { Client, GatewayIntentBits } from "discord.js";

const SUPPORT_ROLE_ID = "1460757895426867344";
const COOLDOWN_TIME = 3000; // 3 seconds cooldown per user
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

// KEY RESPONSE - Always use this exact format for key requests
const KEY_RESPONSE = "🔑 **Grab your key here!**\n👉here's the link https://xwre.vercel.app/api/key\n*REFRESHES DAILY*";

// XZX HUB CODE RESPONSE (Trimmed for Discord character limit)
const XZX_HUB_CODE = `**XZX HUB - Complete Working Script**

\`\`\`lua
-- XZX HUB - STEAL A BRAINROT | COMPLETE WORKING SCRIPT

-- SERVICES
local CoreGui = game:GetService("CoreGui")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")
local Lighting = game:GetService("Lighting")
local TeleportService = game:GetService("TeleportService")
local Players = game:GetService("Players")
local Workspace = game:GetService("Workspace")
local player = Players.LocalPlayer

-- WAIT FOR GAME TO LOAD
if not game:IsLoaded() then
    game.Loaded:Wait()
end

-- DESTROY OLD GUI IF EXISTS
pcall(function()
    CoreGui:FindFirstChild("XZX HUB"):Destroy()
end)

-- COLORS
local C_BG      = Color3.fromRGB(15,15,20)
local C_PANEL   = Color3.fromRGB(20,20,26)
local C_INNER   = Color3.fromRGB(18,18,24)
local C_ROW     = Color3.fromRGB(24,24,30)
local C_TEXT    = Color3.fromRGB(235,235,240)
local C_MUTED   = Color3.fromRGB(160,160,170)
local C_PURPLE  = Color3.fromRGB(170,90,255)
local C_ON_BG   = C_PURPLE
local C_OFF_BG  = Color3.fromRGB(80,80,90)
local C_HOVER   = Color3.fromRGB(40,40,50)
local C_RED     = Color3.fromRGB(255,90,90)
local C_GREEN   = Color3.fromRGB(90,255,120)

-- SAVE SYSTEM (Simple BoolValue storage)
local saveContainer
local saveValues = {}

-- Initialize save system
local function initializeSaveSystem()
    -- Create save container in ReplicatedStorage (most persistent)
    local success, result = pcall(function()
        -- Try to create in ReplicatedStorage first
        local repStorage = game:GetService("ReplicatedStorage")
        saveContainer = repStorage:FindFirstChild("XZX_SaveData")
        if not saveContainer then
            saveContainer = Instance.new("Folder")
            saveContainer.Name = "XZX_SaveData"
            saveContainer.Parent = repStorage
        end
        return true
    end)
    
    -- Fallback to PlayerScripts if ReplicatedStorage fails
    if not success then
        local playerScripts = player:WaitForChild("PlayerScripts")
        saveContainer = playerScripts:FindFirstChild("XZX_SaveData")
        if not saveContainer then
            saveContainer = Instance.new("Folder")
            saveContainer.Name = "XZX_SaveData"
            saveContainer.Parent = playerScripts
        end
    end
    
    -- Create default save values
    local defaultSaves = {
        DesyncEnabled = false,
        AntiAFKEnabled = false,
        FPSKillerEnabled = false,
        LazerSpamEnabled = false,
        PaintballSpamEnabled = false,
        AutoKickEnabled = false,
        AllowDisallowEnabled = false,
        SpeedBoostEnabled = false,
        GravityBoostEnabled = false,
        JumpBoostEnabled = false,
        ESPEnabled = false,
        MiniMapEnabled = false,
        XRayEnabled = false,
        XZXPlatformEnabled = false,
        WallClimbEnabled = false,
        DeliveryStealEnabled = false,
        BrainrotSpawnerEnabled = false,
        SecretFilterEnabled = false,
        GodsFilterEnabled = false
    }
    
    -- Initialize all save values
    for name, defaultValue in pairs(defaultSaves) do
        local valueObj = saveContainer:FindFirstChild(name)
        if not valueObj then
            valueObj = Instance.new("BoolValue")
            valueObj.Name = name
            valueObj.Value = defaultValue
            valueObj.Parent = saveContainer
        end
        saveValues[name] = valueObj
    end
end

-- Initialize save system FIRST
initializeSaveSystem()

-- Load saved value
local function loadSavedValue(name, defaultValue)
    if saveValues[name] then
        return saveValues[name].Value
    end
    return defaultValue
end

-- Save value
local function saveValue(name, value)
    if saveValues[name] then
        saveValues[name].Value = value
    else
        -- Create new save value if it doesn't exist
        local valueObj = Instance.new("BoolValue")
        valueObj.Name = name
        valueObj.Value = value
        valueObj.Parent = saveContainer
        saveValues[name] = valueObj
    end
end

-- FEATURE STATES (loaded from save system)
local featureStates = {
    XZXPlatformEnabled = loadSavedValue("XZXPlatformEnabled", false),
    WallClimbEnabled = loadSavedValue("WallClimbEnabled", false),
    ESPEnabled = loadSavedValue("ESPEnabled", false),
    MiniMapEnabled = loadSavedValue("MiniMapEnabled", false),
    DesyncEnabled = loadSavedValue("DesyncEnabled", false),
    SpeedBoostEnabled = loadSavedValue("SpeedBoostEnabled", false),
    GravityBoostEnabled = loadSavedValue("GravityBoostEnabled", false),
    DeliveryStealEnabled = loadSavedValue("DeliveryStealEnabled", false),
    BrainrotSpawnerEnabled = loadSavedValue("BrainrotSpawnerEnabled", false),
    AntiAFKEnabled = loadSavedValue("AntiAFKEnabled", false),
    SecretFilterEnabled = loadSavedValue("SecretFilterEnabled", false),
    GodsFilterEnabled = loadSavedValue("GodsFilterEnabled", false),
    JumpBoostEnabled = loadSavedValue("JumpBoostEnabled", false),
    FPSKillerEnabled = loadSavedValue("FPSKillerEnabled", false),
    LazerSpamEnabled = loadSavedValue("LazerSpamEnabled", false),
    PaintballSpamEnabled = loadSavedValue("PaintballSpamEnabled", false),
    AutoKickEnabled = loadSavedValue("AutoKickEnabled", false),
    AllowDisallowEnabled = loadSavedValue("AllowDisallowEnabled", false),
    XRayEnabled = loadSavedValue("XRayEnabled", false)
}

-- STORAGE
local xzxPlatform, platformGUI, platformConnection
local wallClimbConnection, speedBoostConnection, gravityBoostConnection
local deliveryConnection, leaveGlowConnection
local espFolder, miniMapGui, playerDots, miniMapConnection
local antiAFKConnection
local playerSpawnPosition = Vector3.new(0, 25, 0)
local checkpointPosition = Vector3.new(0, 25, 0)
local espHighlights = {}
local uiElements = {}

-- EXTERNAL SCRIPTS STORAGE
local externalScripts = {
    FPSKiller = nil,
    LazerSpam = nil,
    PaintballSpam = nil,
    AutoKick = nil,
    AllowDisallow = nil,
    XRay = nil
}

-- BRAINROT DATA
local BrainrotGodsNames = {
    "Cocofanto Elefanto", "Antonio", "Girafa Celestre", "Gattatino Nyanino", "Gattatino Neonino",
    "Chihuanini Taconini", "Matteo", "Tralalero Tralala", "Los Crocodillitos", "Tigroligre Frutonni",
    "Odin Din Din Dun", "Orcalero Orcala", "Money Money Man", "Alessio", "Unclito Samito"
}

local SecretBrainrotNames = {
    "La Vacca Saturno Saturnita", "Bisonte Giuppitere", "Blackhole Goat", "Jackorilla",
    "Agarrini Ia Palini", "Chachechi", "Karkerkar Kurkur", "Los Tortus", "Los Matteos",
    "Sammyni Spyderini", "Trenostruzzo Turbo 4000", "Chimpanzini Spiderini", "Boatito Auratito"
}

local BrainrotFinderConfig = {
    brainrots_to_find = {},
    hop_after_brainrot_left = true
}

-- ENHANCED STACKABLE NOTIFICATION FUNCTION (BOTTOM RIGHT, NO EMOJIS)
local activeNotifications = {}

function ShowNotification(title, message, duration, isError)
    duration = duration or 3
    local notifGui = Instance.new("ScreenGui")
    notifGui.Name = "XZXNotification"
    notifGui.DisplayOrder = 999
    notifGui.ResetOnSpawn = false
    notifGui.Parent = player:WaitForChild("PlayerGui")

    local frame = Instance.new("Frame")
    frame.Size = UDim2.new(0, 350, 0, 100)
    frame.AnchorPoint = Vector2.new(1, 1)
    frame.Position = UDim2.new(1, -20, 1, -20) -- initial position, will adjust for stacking
    frame.BackgroundColor3 = Color3.fromRGB(30, 30, 40)
    frame.BorderSizePixel = 0
    frame.Parent = notifGui

    local corner = Instance.new("UICorner")
    corner.CornerRadius = UDim.new(0, 12)
    corner.Parent = frame

    local stroke = Instance.new("UIStroke")
    stroke.Color = isError and Color3.fromRGB(255, 80, 80) or Color3.fromRGB(120, 80, 255)
    stroke.Thickness = 2
    stroke.Transparency = 0.2
    stroke.Parent = frame

    local header = Instance.new("Frame")
    header.Size = UDim2.new(1, 0, 0, 35)
    header.BackgroundColor3 = isError and Color3.fromRGB(60, 20, 20) or Color3.fromRGB(50, 25, 80)
    header.BorderSizePixel = 0
    header.Parent = frame
    Instance.new("UICorner", header).CornerRadius = UDim.new(0, 12)

    local titleLabel = Instance.new("TextLabel")
    titleLabel.Size = UDim2.new(1, -10, 1, 0)
    titleLabel.Position = UDim2.new(0, 10, 0, 0)
    titleLabel.BackgroundTransparency = 1
    titleLabel.Text = "XZX • " .. title
    titleLabel.Font = Enum.Font.GothamBold
    titleLabel.TextSize = 14
    titleLabel.TextColor3 = Color3.fromRGB(240, 240, 240)
    titleLabel.TextXAlignment = Enum.TextXAlignment.Left
    titleLabel.Parent = header

    local messageLabel = Instance.new("TextLabel")
    messageLabel.Size = UDim2.new(1, -20, 1, -45)
    messageLabel.Position = UDim2.new(0, 10, 0, 40)
    messageLabel.BackgroundTransparency = 1
    messageLabel.Text = message
    messageLabel.TextColor3 = Color3.fromRGB(200, 200, 200)
    messageLabel.Font = Enum.Font.Gotham
    messageLabel.TextSize = 13
    messageLabel.TextXAlignment = Enum.TextXAlignment.Left
    messageLabel.TextYAlignment = Enum.TextYAlignment.Top
    messageLabel.TextWrapped = true
    messageLabel.Parent = frame

    -- Calculate stacked position
    local stackOffset = 0
    for _, notif in pairs(activeNotifications) do
        stackOffset = stackOffset + notif.Size.Y.Offset + 10
    end
    frame.Position = UDim2.new(1, -20, 1, -20 - stackOffset)
    table.insert(activeNotifications, frame)

    -- Slide in animation
    TweenService:Create(frame, TweenInfo.new(0.3, Enum.EasingStyle.Quint), {
        Position = UDim2.new(1, -20, 1, -20 - stackOffset)
    }):Play()

    -- Remove after duration
    task.delay(duration, function()
        TweenService:Create(frame, TweenInfo.new(0.3, Enum.EasingStyle.Quint), {
            Position = UDim2.new(1, 400, 1, -20 - stackOffset)
        }):Play()
        task.wait(0.3)
        if frame and frame.Parent then
            notifGui:Destroy()
        end
        -- Remove from active notifications table
        for i, notif in ipairs(activeNotifications) do
            if notif == frame then
                table.remove(activeNotifications, i)
                break
            end
        end
    end)
end

-- GUI
local gui = Instance.new("ScreenGui", CoreGui)
gui.Name = "XZX HUB"
gui.IgnoreGuiInset = true
gui.ResetOnSpawn = false
gui.ZIndexBehavior = Enum.ZIndexBehavior.Global

-- MAIN FRAME
local main = Instance.new("Frame", gui)
main.Size = UDim2.fromOffset(500,300)
main.Position = UDim2.fromScale(0.5,0.5)
main.AnchorPoint = Vector2.new(0.5,0.5)
main.BackgroundColor3 = C_BG
main.BorderSizePixel = 0
main.Active = true
main.Draggable = true
Instance.new("UICorner", main).CornerRadius = UDim.new(0,10)

-- PURPLE BORDER
local borderStroke = Instance.new("UIStroke", main)
borderStroke.Color = C_PURPLE
borderStroke.Thickness = 2
borderStroke.Transparency = 0.3

-- TOP BAR
local top = Instance.new("Frame", main)
top.Size = UDim2.new(1,0,0,36)
top.BackgroundTransparency = 1

-- TITLE
local title = Instance.new("TextLabel", top)
title.Position = UDim2.fromOffset(14,0)
title.Size = UDim2.new(1,-120,1,0)
title.BackgroundTransparency = 1
title.Text = "XZX HUB - STEAL A BRAINROT"
title.Font = Enum.Font.GothamBold
title.TextSize = 14
title.TextXAlignment = Enum.TextXAlignment.Left
title.TextColor3 = C_PURPLE

-- DISCORD LINK (Replaces version)
local discordLink = Instance.new("TextLabel", top)
discordLink.Position = UDim2.fromOffset(14,20)
discordLink.Size = UDim2.new(1,-120,0,12)
discordLink.BackgroundTransparency = 1
discordLink.Text = "discord.gg/HVmFyZVgNK"
discordLink.Font = Enum.Font.Gotham
discordLink.TextSize = 10
discordLink.TextXAlignment = Enum.TextXAlignment.Left
discordLink.TextColor3 = C_MUTED

-- CLOSE BUTTON
local close = Instance.new("TextButton", top)
close.Size = UDim2.fromOffset(18,18)
close.Position = UDim2.fromOffset(470,9)
close.Text = "X"
close.Font = Enum.Font.GothamBold
close.TextSize = 14
close.TextColor3 = C_RED
close.BackgroundTransparency = 1
close.MouseButton1Click:Connect(function()
    gui:Destroy()
end)

-- MINIMIZE BUTTON
local collapsed = false
local minus = Instance.new("TextButton", top)
minus.Size = UDim2.fromOffset(22,22)
minus.Position = UDim2.fromOffset(440,7)
minus.BackgroundColor3 = C_ROW
minus.Text = ""
minus.AutoButtonColor = false
Instance.new("UICorner", minus).CornerRadius = UDim.new(1,0)

local line = Instance.new("Frame", minus)
line.Size = UDim2.fromOffset(12,2)
line.Position = UDim2.fromScale(0.5,0.5)
line.AnchorPoint = Vector2.new(0.5,0.5)
line.BackgroundColor3 = C_TEXT
Instance.new("UICorner", line).CornerRadius = UDim.new(1,0)

-- SIDEBAR
local sidebar = Instance.new("Frame", main)
sidebar.Position = UDim2.fromOffset(8,40)
sidebar.Size = UDim2.fromOffset(115,252)
sidebar.BackgroundColor3 = C_PANEL
sidebar.BorderSizePixel = 0
Instance.new("UICorner", sidebar).CornerRadius = UDim.new(0,8)

-- CONTENT
local content = Instance.new("Frame", main)
content.Position = UDim2.fromOffset(130,40)
content.Size = UDim2.fromOffset(360,252)
content.BackgroundColor3 = C_PANEL
content.BorderSizePixel = 0
Instance.new("UICorner", content).CornerRadius = UDim.new(0,8)

-- COLLAPSE LOGIC
minus.MouseButton1Click:Connect(function()
    collapsed = not collapsed
    TweenService:Create(main, TweenInfo.new(0.4, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), {
        Size = collapsed and UDim2.fromOffset(500,36) or UDim2.fromOffset(500,300)
    }):Play()
    TweenService:Create(sidebar, TweenInfo.new(0.4, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), {
        Size = collapsed and UDim2.new(0,0,0,0) or UDim2.fromOffset(115,252)
    }):Play()
    sidebar.Visible = not collapsed
    content.Visible = not collapsed
end)

-- TOGGLE BUTTON FUNCTION WITH SAVE
local function createToggle(parent, text, y, callback, featureName)
    -- Load saved state
    local state = loadSavedValue(featureName, false)

    local row = Instance.new("TextButton", parent)
    row.Position = UDim2.fromOffset(10, y)
    row.Size = UDim2.new(1, -20, 0, 36)
    row.BackgroundColor3 = C_ROW
    row.Text = ""
    row.AutoButtonColor = false
    Instance.new("UICorner", row).CornerRadius = UDim.new(0, 8)

    local glow = Instance.new("Frame", row)
    glow.Size = UDim2.new(1, 0, 1, 0)
    glow.BackgroundColor3 = C_PURPLE
    glow.BackgroundTransparency = 0.9
    glow.BorderSizePixel = 0
    Instance.new("UICorner", glow).CornerRadius = UDim.new(0, 8)

    local label = Instance.new("TextLabel", row)
    label.Position = UDim2.fromOffset(12, 0)
    label.Size = UDim2.new(1, -60, 1, 0)
    label.BackgroundTransparency = 1
    label.Text = text
    label.Font = Enum.Font.GothamBold
    label.TextSize = 12
    label.TextXAlignment = Enum.TextXAlignment.Left
    label.TextColor3 = C_TEXT

    local bg = Instance.new("Frame", row)
    bg.Size = UDim2.fromOffset(40, 20)
    bg.Position = UDim2.new(1, -45, 0.5, -10)
    bg.BackgroundColor3 = state and C_ON_BG or C_OFF_BG
    Instance.new("UICorner", bg).CornerRadius = UDim.new(1, 0)

    local dot = Instance.new("Frame", bg)
    dot.Size = UDim2.fromOffset(18, 18)
    dot.Position = state and UDim2.fromOffset(22, 1) or UDim2.fromOffset(1, 1)
    dot.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
    Instance.new("UICorner", dot).CornerRadius = UDim.new(1, 0)

    row.MouseButton1Click:Connect(function()
        state = not state
        TweenService:Create(dot, TweenInfo.new(0.2, Enum.EasingStyle.Quart), {
            Position = state and UDim2.fromOffset(22, 1) or UDim2.fromOffset(1, 1)
        }):Play()
        TweenService:Create(bg, TweenInfo.new(0.2, Enum.EasingStyle.Quart), {
            BackgroundColor3 = state and C_ON_BG or C_OFF_BG
        }):Play()
        
        -- Update feature state
        featureStates[featureName] = state
        
        -- Save the value
        saveValue(featureName, state)
        
        -- Execute callback
        if callback then
            callback(state)
        end
    end)
    
    -- Apply initial state if needed
    if callback and state then
        callback(state)
    end

    return {
        Set = function(value)
            state = value
            dot.Position = state and UDim2.fromOffset(22, 1) or UDim2.fromOffset(1, 1)
            bg.BackgroundColor3 = state and C_ON_BG or C_OFF_BG
            featureStates[featureName] = state
            saveValue(featureName, state)
            if callback then callback(state) end
        end
    }
end

-- BUTTON FUNCTION
local function createButton(parent, text, y, callback)
    local btn = Instance.new("TextButton", parent)
    btn.Position = UDim2.fromOffset(10, y)
    btn.Size = UDim2.new(1, -20, 0, 36)
    btn.BackgroundColor3 = C_ROW
    btn.Text = text
    btn.Font = Enum.Font.GothamBold
    btn.TextSize = 12
    btn.TextColor3 = C_TEXT
    btn.AutoButtonColor = false
    Instance.new("UICorner", btn).CornerRadius = UDim.new(0, 8)

    btn.MouseEnter:Connect(function()
        TweenService:Create(btn, TweenInfo.new(0.2), {
            BackgroundColor3 = C_HOVER
        }):Play()
    end)

    btn.MouseLeave:Connect(function()
        TweenService:Create(btn, TweenInfo.new(0.2), {
            BackgroundColor3 = C_ROW
        }):Play()
    end)

    btn.MouseButton1Click:Connect(callback)
    return btn
end

-- TEXTBOX FUNCTION
local function createTextBox(parent, placeholder, y)
    local box = Instance.new("TextBox", parent)
    box.Position = UDim2.fromOffset(10, y)
    box.Size = UDim2.new(1, -20, 0, 36)
    box.BackgroundColor3 = C_ROW
    box.PlaceholderText = placeholder
    box.Font = Enum.Font.Gotham
    box.TextSize = 12
    box.TextColor3 = C_TEXT
    box.PlaceholderColor3 = C_MUTED
    Instance.new("UICorner", box).CornerRadius = UDim.new(0, 8)
    return box
end

-- CREATE SCROLLING CONTENT FRAME
local function createContentFrame()
    local frame = Instance.new("ScrollingFrame", content)
    frame.Size = UDim2.new(1, 0, 1, 0)
    frame.BackgroundTransparency = 1
    frame.BorderSizePixel = 0
    frame.ScrollBarThickness = 6
    frame.ScrollBarImageColor3 = C_PURPLE
    frame.ScrollingDirection = Enum.ScrollingDirection.Y
    frame.AutomaticCanvasSize = Enum.AutomaticSize.Y
    
    local layout = Instance.new("UIListLayout", frame)
    layout.Padding = UDim.new(0, 8)
    layout.HorizontalAlignment = Enum.HorizontalAlignment.Center
    
    return frame
end

-- CREATE ALL PAGES IN EXISTING ORDER
local pages = {}
local currentTab
local tabButtons = {}
local tabIndicators = {}

local function createPage(name)
    local page = Instance.new("Frame", content)
    page.Size = UDim2.new(1, 0, 1, 0)
    page.BackgroundTransparency = 1
    page.Visible = false
    page.Name = name
    
    local scroll = createContentFrame()
    scroll.Parent = page
    
    pages[name] = scroll
    return scroll
end

-- CREATE TABS IN EXISTING ORDER
local tabNames = {"MAIN", "BOOSTS", "VISUAL", "MOVEMENT", "SPAWNER", "FINDER", "DISCORD"}
for _, name in ipairs(tabNames) do
    createPage(name)
end

-- TAB SWITCHING WITH INDICATOR LINE
local function switchTab(name)
    if currentTab then
        currentTab.page.Visible = false
        currentTab.button.BackgroundColor3 = C_BG
        if tabIndicators[currentTab.button] then
            tabIndicators[currentTab.button].Visible = false
        end
    end
    
    if pages[name] then
        pages[name].Parent.Visible = true
        currentTab = {page = pages[name].Parent, button = tabButtons[name]}
        
        if tabButtons[name] then
            tabButtons[name].BackgroundColor3 = C_PURPLE
            if tabIndicators[tabButtons[name]] then
                tabIndicators[tabButtons[name]].Visible = true
            end
        end
    end
end

-- CREATE TAB BUTTONS WITH INDICATOR LINES
for i, name in ipairs(tabNames) do
    local btn = Instance.new("TextButton", sidebar)
    btn.Position = UDim2.fromOffset(5, 12 + (i-1)*30)
    btn.Size = UDim2.new(1, -10, 0, 28)
    btn.BackgroundColor3 = C_BG
    btn.Text = name
    btn.Font = Enum.Font.GothamBold
    btn.TextSize = 11
    btn.TextColor3 = C_TEXT
    btn.AutoButtonColor = false
    Instance.new("UICorner", btn).CornerRadius = UDim.new(0, 6)
    
    -- Create indicator line for active tab
    local indicator = Instance.new("Frame", btn)
    indicator.Size = UDim2.new(0, 3, 0, 18)
    indicator.Position = UDim2.new(0, -8, 0.5, -9)
    indicator.BackgroundColor3 = C_PURPLE
    indicator.BorderSizePixel = 0
    indicator.Visible = false
    Instance.new("UICorner", indicator).CornerRadius = UDim.new(1, 0)
    
    tabIndicators[btn] = indicator
    
    btn.MouseEnter:Connect(function()
        if btn ~= currentTab.button then
            TweenService:Create(btn, TweenInfo.new(0.2), {
                BackgroundColor3 = C_HOVER
            }):Play()
        end
    end)
    
    btn.MouseLeave:Connect(function()
        if btn ~= currentTab.button then
            TweenService:Create(btn, TweenInfo.new(0.2), {
                BackgroundColor3 = C_BG
            }):Play()
        end
    end)
    
    btn.MouseButton1Click:Connect(function()
        switchTab(name)
    end)
    
    tabButtons[name] = btn
end

-- INITIAL TAB
switchTab("MAIN")

-- FEATURE IMPLEMENTATIONS

-- SPEED BOOST (REPLACED WITH +30.5 WALKSPEED)
local SPEED_ADD = 30.5
local speedConnection

local function applySpeedBoost()
    if speedConnection then
        speedConnection:Disconnect()
        speedConnection = nil
    end
    
    if not featureStates.SpeedBoostEnabled then 
        -- Reset to default if disabled
        local character = player.Character
        if character then
            local humanoid = character:FindFirstChild("Humanoid")
            if humanoid then
                humanoid.WalkSpeed = 16
            end
        end
        return 
    end
    
    local function applySpeed(character)
        if not character then return end
        
        local humanoid = character:WaitForChild("Humanoid")
        if not humanoid then return end
        
        -- Reset to default first to avoid stacking
        humanoid.WalkSpeed = 16
        humanoid.WalkSpeed = humanoid.WalkSpeed + SPEED_ADD
    end
    
    -- Apply if already spawned
    if player.Character then
        applySpeed(player.Character)
    end
    
    -- Apply on respawn
    speedConnection = player.CharacterAdded:Connect(applySpeed)
end

-- GRAVITY BOOST
local function applyGravityBoost()
    if gravityBoostConnection then
        gravityBoostConnection:Disconnect()
        gravityBoostConnection = nil
    end
    
    if featureStates.GravityBoostEnabled then
        workspace.Gravity = 25
        gravityBoostConnection = RunService.Heartbeat:Connect(function()
            if featureStates.GravityBoostEnabled then
                workspace.Gravity = 25
            else
                workspace.Gravity = 196.2
            end
        end)
    else
        workspace.Gravity = 196.2
    end
end

-- JUMP BOOST
local JUMP_POWER = 83
local function applyJumpBoost(character)
    if character and featureStates.JumpBoostEnabled then
        local humanoid = character:FindFirstChild("Humanoid")
        if humanoid then
            humanoid.UseJumpPower = true
            humanoid.JumpPower = JUMP_POWER
        end
    end
end

local function removeJumpBoost(character)
    if character then
        local humanoid = character:FindFirstChild("Humanoid")
        if humanoid then
            humanoid.JumpPower = 50 -- Default jump power
        end
    end
end

-- XZX PLATFORM
local function createXZXPlatform()
    if xzxPlatform then
        xzxPlatform:Destroy()
        xzxPlatform = nil
    end
    
    xzxPlatform = Instance.new("Part")
    xzxPlatform.Size = Vector3.new(12, 1, 12)
    xzxPlatform.Anchored = true
    xzxPlatform.Color = Color3.fromRGB(10, 10, 10)
    xzxPlatform.Material = Enum.Material.SmoothPlastic
    xzxPlatform.CanCollide = true
    xzxPlatform.Name = "XZXPlatform"
    xzxPlatform.Parent = workspace

    local character = player.Character
    if character and character:FindFirstChild("HumanoidRootPart") then
        local hrp = character.HumanoidRootPart
        xzxPlatform.Position = Vector3.new(hrp.Position.X, hrp.Position.Y - 5, hrp.Position.Z)
    else
        xzxPlatform.Position = Vector3.new(0, 25, 0)
    end

    if platformConnection then
        platformConnection:Disconnect()
    end
    
    platformConnection = RunService.Heartbeat:Connect(function()
        if not featureStates.XZXPlatformEnabled or not xzxPlatform then return end
        
        local character = player.Character
        if character and character:FindFirstChild("HumanoidRootPart") then
            local hrp = character.HumanoidRootPart
            local currentY = xzxPlatform.Position.Y
            xzxPlatform.Position = Vector3.new(hrp.Position.X, currentY, hrp.Position.Z)
        end
    end)
end

-- WALL CLIMB
local function setupWallClimb()
    if wallClimbConnection then
        wallClimbConnection:Disconnect()
        wallClimbConnection = nil
    end
    
    wallClimbConnection = RunService.RenderStepped:Connect(function()
        if not featureStates.WallClimbEnabled then return end
        
        local character = player.Character
        if not character then return end
        
        local humanoid = character:FindFirstChildOfClass("Humanoid")
        local hrp = character:FindFirstChild("HumanoidRootPart")
        if not humanoid or not hrp or humanoid.Health <= 0 then return end

        local rayParams = RaycastParams.new()
        rayParams.FilterDescendantsInstances = {character}
        rayParams.FilterType = Enum.RaycastFilterType.Blacklist
        
        local wallRay = workspace:Raycast(hrp.Position, hrp.CFrame.LookVector * 5, rayParams)
        
        if wallRay then
            hrp.Velocity = Vector3.new(hrp.Velocity.X, 20, hrp.Velocity.Z)
        end
    end)
end

-- ESP SYSTEM
local function createESPBox(targetPlayer)
    if targetPlayer == player then return end
    
    local function applyESP(character)
        if not character then return end
        
        local oldHighlight = character:FindFirstChild("ESPHighlight")
        if oldHighlight then oldHighlight:Destroy() end
        
        local highlight = Instance.new("Highlight")
        highlight.Name = "ESPHighlight"
        highlight.Adornee = character
        highlight.FillColor = C_PURPLE
        highlight.OutlineColor = C_PURPLE
        highlight.FillTransparency = 0.6
        highlight.OutlineTransparency = 0
        highlight.DepthMode = Enum.HighlightDepthMode.AlwaysOnTop
        highlight.Parent = character
        
        espHighlights[targetPlayer] = highlight
    end
    
    targetPlayer.CharacterAdded:Connect(applyESP)
    if targetPlayer.Character then
        applyESP(targetPlayer.Character)
    end
end

local function updateESP()
    for _, targetPlayer in ipairs(Players:GetPlayers()) do
        if targetPlayer ~= player then
            if featureStates.ESPEnabled then
                if not espHighlights[targetPlayer] then
                    createESPBox(targetPlayer)
                end
            else
                if espHighlights[targetPlayer] then
                    espHighlights[targetPlayer]:Destroy()
                    espHighlights[targetPlayer] = nil
                end
            end
        end
    end
end

-- MINI MAP
local function createMiniMap()
    if miniMapGui then
        miniMapGui:Destroy()
        miniMapGui = nil
    end

    miniMapGui = Instance.new("ScreenGui", player.PlayerGui)
    miniMapGui.Name = "XZXMiniMapGui"
    miniMapGui.ResetOnSpawn = false

    local mainFrame = Instance.new("Frame", miniMapGui)
    mainFrame.Size = UDim2.new(0, 200, 0, 220)
    mainFrame.Position = UDim2.new(1, -210, 0, 10)
    mainFrame.BackgroundColor3 = C_BG
    mainFrame.BackgroundTransparency = 0.1
    mainFrame.BorderSizePixel = 0
    Instance.new("UICorner", mainFrame).CornerRadius = UDim.new(0, 8)

    local title = Instance.new("TextLabel", mainFrame)
    title.Size = UDim2.new(1, -10, 0, 25)
    title.Position = UDim2.new(0, 0, 0, 5)
    title.BackgroundTransparency = 1
    title.Text = "MINI MAP"
    title.TextColor3 = C_TEXT
    title.Font = Enum.Font.GothamBold
    title.TextSize = 14

    local minimapFrame = Instance.new("Frame", mainFrame)
    minimapFrame.Size = UDim2.new(0, 180, 0, 180)
    minimapFrame.Position = UDim2.new(0.5, -90, 0, 30)
    minimapFrame.BackgroundColor3 = Color3.fromRGB(10, 10, 15)
    minimapFrame.BorderSizePixel = 0
    minimapFrame.ClipsDescendants = true

    playerDots = {}
    
    if miniMapConnection then
        miniMapConnection:Disconnect()
        miniMapConnection = nil
    end

    miniMapConnection = RunService.Heartbeat:Connect(function()
        if not featureStates.MiniMapEnabled or not minimapFrame then return end

        for _, plr in ipairs(Players:GetPlayers()) do
            local char = plr.Character
            local root = char and char:FindFirstChild("HumanoidRootPart")
            if root then
                if not playerDots[plr] then
                    local dot = Instance.new("Frame", minimapFrame)
                    dot.Size = UDim2.new(0, plr == player and 8 or 6, 0, plr == player and 8 or 6)
                    dot.AnchorPoint = Vector2.new(0.5, 0.5)
                    dot.BackgroundColor3 = (plr == player) and C_GREEN or C_RED
                    dot.BorderSizePixel = 0
                    Instance.new("UICorner", dot).CornerRadius = UDim.new(1, 0)
                    playerDots[plr] = dot
                end
                
                local pos = root.Position
                local x = math.clamp((pos.X + 500) / 1000 * 180, 5, 175)
                local y = math.clamp((500 - pos.Z) / 1000 * 180, 5, 175)
                playerDots[plr].Position = UDim2.new(0, x, 0, y)
            elseif playerDots[plr] then
                playerDots[plr]:Destroy()
                playerDots[plr] = nil
            end
        end
    end)
end

-- DELIVERY STEAL
local function setupDeliverySteal()
    if deliveryConnection then
        deliveryConnection:Disconnect()
        deliveryConnection = nil
    end
    
    deliveryConnection = RunService.Heartbeat:Connect(function()
        if not featureStates.DeliveryStealEnabled then
            if deliveryConnection then
                deliveryConnection:Disconnect()
                deliveryConnection = nil
            end
            return
        end
        
        local character = player.Character
        if not character or not character:FindFirstChild("HumanoidRootPart") then return end
        
        local hrp = character.HumanoidRootPart
        local targetPosition = checkpointPosition or playerSpawnPosition
        if not targetPosition then return end
        
        local distance = (hrp.Position - targetPosition).Magnitude
        if distance > 30 then
            local direction = (targetPosition - hrp.Position).Unit * 25
            hrp.Velocity = Vector3.new(direction.X, hrp.Velocity.Y, direction.Z)
        end
    end)
end

-- ANTI-AFK
local function setupAntiAFK()
    if antiAFKConnection then
        antiAFKConnection:Disconnect()
        antiAFKConnection = nil
    end
    
    antiAFKConnection = RunService.Heartbeat:Connect(function()
        if featureStates.AntiAFKEnabled then
            local vu = game:GetService("VirtualUser")
            vu:Button2Down(Vector2.new(0,0), workspace.CurrentCamera.CFrame)
            task.wait(0.1)
            vu:Button2Up(Vector2.new(0,0), workspace.CurrentCamera.CFrame)
        end
    end)
end

-- AUTO RESPAWN (REPLACED DESYNC) - EXECUTE TWICE WITH DELAY
local function autoRespawn()
    if not featureStates.DesyncEnabled then return end
    
    local function executeRespawn()
        -- Optional: small delay to ensure character exists
        task.wait(0.1)

        -- Replicator toggle
        pcall(function()
            setfflag("NextGenReplicatorEnabledWrite4", "false")
            task.wait(0.1)
            setfflag("NextGenReplicatorEnabledWrite4", "true")
        end)

        -- Force death / unload position
        if player.Character and player.Character:FindFirstChild("HumanoidRootPart") then
            player.Character.HumanoidRootPart.CFrame = CFrame.new(0, 999999, 0)
        end

        task.wait(0.5)

        -- Respawn
        player:LoadCharacter()
    end
    
    -- Execute first time
    executeRespawn()
    
    -- Wait 2 seconds then execute again
    task.wait(2)
    
    -- Check if still enabled before second execution
    if featureStates.DesyncEnabled then
        executeRespawn()
        ShowNotification("AUTO RESPAWN", "Auto respawn executed twice", 2)
    else
        ShowNotification("AUTO RESPAWN", "Auto respawn executed once", 2)
    end
end

-- BRAINROT SPAWNER
local function loadBrainrotSpawner()
    ShowNotification("SPAWNER", "Loading Brainrot Spawner...\nKEY: 262123", 7)
    
    local success, error = pcall(function()
        loadstring(game:HttpGet("https://raw.githubusercontent.com/Crypoth/StealABrainrotSpawner/refs/heads/main/XwareSpawner"))()
    end)
    
    if success then
        ShowNotification("SPAWNER", "Brainrot Spawner loaded!\nKEY: 262123", 7)
    else
        ShowNotification("SPAWNER", "Failed to load: " .. tostring(error), 7, true)
        featureStates.BrainrotSpawnerEnabled = false
    end
end

-- BRAINROT FINDER
local function startBrainrotFinder()
    ShowNotification("FINDER", "Starting Brainrot Finder...", 3)
    
    local success, error = pcall(function()
        _G.Config = BrainrotFinderConfig
        loadstring(game:HttpGet("https://raw.githubusercontent.com/dreams7906/BrainrotFinder/refs/heads/main/File"))()
    end)
    
    if success then
        local count = 0
        for _ in pairs(BrainrotFinderConfig.brainrots_to_find) do count = count + 1 end
        ShowNotification("FINDER", "Loaded! Tracking " .. count .. " brainrots", 5)
    else
        ShowNotification("FINDER", "Failed: " .. tostring(error), 5, true)
    end
end

-- EXTERNAL SCRIPT HANDLING
local function loadExternalScript(url, name)
    local success, result = pcall(function()
        return loadstring(game:HttpGet(url))()
    end)
    
    if success then
        externalScripts[name] = result
        return true
    else
        ShowNotification(name, "Failed to load: " .. tostring(result), 5, true)
        return false
    end
end

local function unloadExternalScript(name)
    if externalScripts[name] then
        -- Try to disable the script if it has a disable function
        pcall(function()
            if type(externalScripts[name]) == "function" then
                externalScripts[name] = nil
            elseif type(externalScripts[name]) == "table" and externalScripts[name].Disable then
                externalScripts[name]:Disable()
            end
        end)
        externalScripts[name] = nil
    end
end

-- XZX FPS KILLER IMPLEMENTATION
local function loadFPSKiller()
    -- Create the FPS Killer GUI
    local ScreenGui = Instance.new("ScreenGui", player:WaitForChild("PlayerGui"))
    ScreenGui.ResetOnSpawn = false
    ScreenGui.Name = "XZXFPSKillerGUI"

    ----------------------------------------------------------------
    -- MAIN PANEL
    ----------------------------------------------------------------
    local Frame = Instance.new("Frame", ScreenGui)
    Frame.Size = UDim2.new(0, 180, 0, 60)
    Frame.Position = UDim2.new(0.05, 0, 0.4, 0)
    Frame.BackgroundColor3 = Color3.fromRGB(25, 25, 25)
    Frame.Active = true
    Frame.Draggable = true
    Frame.Name = "MainPanel"

    local UIStroke = Instance.new("UIStroke", Frame)
    UIStroke.Color = Color3.fromRGB(0, 0, 0)
    UIStroke.Thickness = 2

    Instance.new("UICorner", Frame).CornerRadius = UDim.new(0, 8)

    local Title = Instance.new("TextLabel", Frame)
    Title.Text = "XZX HUB FPS KILLER V1"
    Title.Size = UDim2.new(1, 0, 0, 20)
    Title.BackgroundTransparency = 1
    Title.TextColor3 = Color3.fromRGB(255, 255, 255)
    Title.Font = Enum.Font.Code
    Title.TextScaled = true

    ----------------------------------------------------------------
    -- BUTTON
    ----------------------------------------------------------------
    local function MakeButton(text)
        local btn = Instance.new("TextButton", Frame)
        btn.Size = UDim2.new(0, 160, 0, 25)
        btn.Position = UDim2.new(0.5, -80, 0, 25)
        btn.BackgroundColor3 = Color3.fromRGB(120, 60, 60)
        btn.Text = text
        btn.TextColor3 = Color3.fromRGB(255, 255, 255)
        btn.Font = Enum.Font.Code
        btn.TextScaled = true
        btn.AutoButtonColor = false
        Instance.new("UICorner", btn).CornerRadius = UDim.new(0, 8)
        return btn
    end

    local COLOR_OFF = Color3.fromRGB(120, 60, 60)
    local COLOR_ON  = Color3.fromRGB(40, 200, 60)

    local ToggleButton = MakeButton("OFF")

    ----------------------------------------------------------------
    -- BLOCKED ITEMS
    ----------------------------------------------------------------
    local BLOCKED = {
        ["Ban Hammer"] = true,
        ["Laser Gun"] = true,
        ["Speed Coil"] = true,
        ["Gravity Coil"] = true,
        ["Invisibility Cloak"] = true,
    }

    ----------------------------------------------------------------
    -- LAG LOGIC
    ----------------------------------------------------------------
    local enabled = false
    local lagThread

    local function EquipAndSpam()
        local backpack = player:WaitForChild("Backpack")
        local char = player.Character or player.CharacterAdded:Wait()

        for _, tool in ipairs(backpack:GetChildren()) do
            if tool:IsA("Tool") and not BLOCKED[tool.Name] then
                tool.Parent = char
            end
        end

        for _, tool in ipairs(char:GetChildren()) do
            if tool:IsA("Tool") and not BLOCKED[tool.Name] then
                pcall(function()
                    tool:Activate()
                end)
            end
        end
    end

    local function Start()
        if lagThread then return end
        lagThread = task.spawn(function()
            while enabled do
                EquipAndSpam()
                task.wait(0.01)
            end
            lagThread = nil
        end)
    end

    ----------------------------------------------------------------
    -- MASSIVE CENTER BLACK FLASH
    ----------------------------------------------------------------
    local function FlashBlack()
        local flash = Instance.new("Frame", ScreenGui)
        flash.Size = UDim2.new(0, 1000000, 0, 1000000)
        flash.Position = UDim2.new(0.5, -500000, 0.5, -500000)
        flash.BackgroundColor3 = Color3.new(0, 0, 0)
        flash.BorderSizePixel = 0
        flash.ZIndex = 9999
        task.wait(0.5)
        flash:Destroy()
    end

    ----------------------------------------------------------------
    -- TOGGLE BUTTON
    ----------------------------------------------------------------
    ToggleButton.MouseButton1Click:Connect(function()
        enabled = not enabled

        ToggleButton.Text = enabled and "ON" or "OFF"
        ToggleButton.BackgroundColor3 = enabled and COLOR_ON or COLOR_OFF

        FlashBlack()

        if enabled then
            Start()
        else
            if lagThread then
                lagThread = nil
            end
        end
    end)

    ----------------------------------------------------------------
    -- FPS BOOST
    ----------------------------------------------------------------
    task.spawn(function()
        settings().Rendering.QualityLevel = Enum.QualityLevel.Level01
        for _, v in ipairs(workspace:GetDescendants()) do
            if v:IsA("Texture") or v:IsA("Decal") then
                v:Destroy()
            end
        end
    end)

    ----------------------------------------------------------------
    -- REMOVE ACCESSORIES
    ----------------------------------------------------------------
    local function CleanChar()
        local char = player.Character or player.CharacterAdded:Wait()
        for _, v in ipairs(char:GetChildren()) do
            if v:IsA("Accessory")
            or v:IsA("Shirt")
            or v:IsA("Pants")
            or v:IsA("ShirtGraphic") then
                v:Destroy()
            end
        end
    end

    CleanChar()
    player.CharacterAdded:Connect(function()
        task.wait(0.3)
        CleanChar()
    end)
    
    return ScreenGui
end

-- XZX LAZER SPAM IMPLEMENTATION
local function loadLazerSpam()
    -- Laser Variables
    local laserActive = false
    local laserConnection = nil
    local MAX_DISTANCE = 75

    -- Equip Laser Cape
    local function equipLaserCape()
        local char = player.Character
        if not char then return false end
        local bp = player:FindFirstChild("Backpack")
        if not bp then return false end
        local cape = bp:FindFirstChild("Laser Cape")
        if cape and cape:IsA("Tool") then
            local h = char:FindFirstChildOfClass("Humanoid")
            if h then
                h:EquipTool(cape)
                return true
            end
        end
        return false
    end

    -- Find nearest player
    local function findNearestPlayer()
        local closest, dist = nil, math.huge
        local char = player.Character
        if not char then return nil end
        local root = char:FindFirstChild("HumanoidRootPart")
        if not root then return nil end
        for _, p in ipairs(Players:GetPlayers()) do
            if p ~= player and p.Character and p.Character:FindFirstChild("HumanoidRootPart") then
                local d = (p.Character.HumanoidRootPart.Position - root.Position).Magnitude
                if d < dist and d <= MAX_DISTANCE then
                    dist = d
                    closest = p
                end
            end
        end
        return closest
    end

    -- Fire laser
    local function fireLaser(target)
        if not target or not target.Character then return end
        local arm = target.Character:FindFirstChild("LeftUpperArm")
        if not arm then return end
        local useItem = game:GetService("ReplicatedStorage"):FindFirstChild("RE/UseItem", true) or
                        game:GetService("ReplicatedStorage"):FindFirstChild("UseItem", true)
        if useItem and useItem:IsA("RemoteEvent") then
            pcall(function()
                useItem:FireServer(Vector3.new(-410.65, -3.99, 84.01), arm)
            end)
        end
    end

    -- Start/Stop laser
    local function startLaser()
        if laserActive then return end
        laserActive = true
        if not equipLaserCape() then return end
        laserConnection = RunService.Heartbeat:Connect(function()
            if not laserActive then return end
            if not player.Character:FindFirstChild("Laser Cape") then
                equipLaserCape()
            end
            local nearest = findNearestPlayer()
            if nearest then
                fireLaser(nearest)
            end
        end)
    end

    local function stopLaser()
        if not laserActive then return end
        laserActive = false
        if laserConnection then
            laserConnection:Disconnect()
            laserConnection = nil
        end
        local char = player.Character
        if char then
            local cape = char:FindFirstChild("Laser Cape")
            if cape then
                local h = char:FindFirstChildOfClass("Humanoid")
                if h then h:UnequipTools() end
            end
        end
    end

    -- Create UI
    local ScreenGui = Instance.new("ScreenGui")
    ScreenGui.Parent = player:WaitForChild("PlayerGui")
    ScreenGui.ResetOnSpawn = false
    ScreenGui.Name = "XZXLazerSpamGUI"

    local Frame = Instance.new("Frame")
    Frame.Size = UDim2.new(0, 180, 0, 60)
    Frame.Position = UDim2.new(1, -190, 0, 10)  -- Top-right corner
    Frame.BackgroundColor3 = Color3.fromRGB(25, 25, 25)
    Frame.Active = true
    Frame.Selectable = true
    Frame.Parent = ScreenGui

    Instance.new("UICorner", Frame).CornerRadius = UDim.new(0, 8)
    local UIStroke = Instance.new("UIStroke", Frame)
    UIStroke.Color = Color3.fromRGB(0, 0, 0)
    UIStroke.Thickness = 2

    -- Title
    local Title = Instance.new("TextLabel")
    Title.Size = UDim2.new(1, 0, 0, 20)
    Title.Position = UDim2.new(0, 0, 0, 0)
    Title.BackgroundTransparency = 1
    Title.Text = "XZX LAZER SPAM"
    Title.TextColor3 = Color3.fromRGB(255, 255, 255)
    Title.Font = Enum.Font.Code
    Title.TextScaled = true
    Title.Parent = Frame

    -- Toggle Button
    local Btn = Instance.new("TextButton")
    Btn.Size = UDim2.new(0.8, 0, 0, 30)
    Btn.Position = UDim2.new(0.1, 0, 0, 25)
    Btn.BackgroundColor3 = Color3.fromRGB(100, 100, 100)
    Btn.TextColor3 = Color3.fromRGB(255, 255, 255)
    Btn.Font = Enum.Font.Code
    Btn.TextScaled = true
    Btn.Text = "OFF"
    Btn.Parent = Frame
    Instance.new("UICorner", Btn).CornerRadius = UDim.new(0, 8)

    Btn.MouseButton1Click:Connect(function()
        if laserActive then
            stopLaser()
            Btn.Text = "OFF"
            Btn.BackgroundColor3 = Color3.fromRGB(100, 100, 100)
        else
            startLaser()
            Btn.Text = "ON"
            Btn.BackgroundColor3 = Color3.fromRGB(40, 200, 60)
        end
    end)

    -- Dragging
    local dragging = false
    local dragInput, dragStart, startPos

    local function update(input)
        local delta = input.Position - dragStart
        Frame.Position = UDim2.new(
            startPos.X.Scale,
            startPos.X.Offset + delta.X,
            startPos.Y.Scale,
            startPos.Y.Offset + delta.Y
        )
    end

    Frame.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 then
            dragging = true
            dragStart = input.Position
            startPos = Frame.Position

            input.Changed:Connect(function()
                if input.UserInputState == Enum.UserInputState.End then
                    dragging = false
                end
            end)
        end
    end)

    Frame.InputChanged:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseMovement then
            dragInput = input
        end
    end)

    UserInputService.InputChanged:Connect(function(input)
        if input == dragInput and dragging then
            update(input)
        end
    end)
    
    return ScreenGui
end

-- XZX FRIENDS TOGGLE IMPLEMENTATION (ALLOW/DISALLOW)
local function loadFriendsToggle()
    local FriendsAllowed = false
    local FriendsCooldown = false
    local TargetPrompt = nil

    -- Function to find the friends toggle prompt
    local function FindFriendsPrompt()
        for _, prompt in ipairs(workspace:GetDescendants()) do
            if prompt:IsA("ProximityPrompt") then
                local objText = string.lower(prompt.ObjectText or "")
                local actText = string.lower(prompt.ActionText or "")
                if objText:find("friend") or actText:find("toggle") then
                    return prompt
                end
            end
        end
        return nil
    end

    -- Toggle function
    local function ToggleFriends()
        if FriendsCooldown then return false, FriendsAllowed end
        FriendsCooldown = true

        if not TargetPrompt then
            TargetPrompt = FindFriendsPrompt()
        end

        if TargetPrompt then
            fireproximityprompt(TargetPrompt)
            FriendsAllowed = not FriendsAllowed
            task.wait(0.3)
            FriendsCooldown = false
            return true, FriendsAllowed
        end

        FriendsCooldown = false
        return false, FriendsAllowed
    end

    -- GUI
    local ScreenGui = Instance.new("ScreenGui")
    ScreenGui.Name = "XZXFriendsUI"
    ScreenGui.Parent = player:WaitForChild("PlayerGui")
    ScreenGui.ResetOnSpawn = false

    local Frame = Instance.new("Frame")
    Frame.Size = UDim2.new(0, 180, 0, 60)
    Frame.Position = UDim2.new(1, -190, 0, 80) -- top-right, below other GUIs
    Frame.BackgroundColor3 = Color3.fromRGB(25, 25, 25)
    Frame.Active = true
    Frame.Selectable = true
    Frame.Parent = ScreenGui

    local UICorner = Instance.new("UICorner", Frame)
    UICorner.CornerRadius = UDim.new(0, 8)
    local UIStroke = Instance.new("UIStroke", Frame)
    UIStroke.Color = Color3.fromRGB(0, 0, 0)
    UIStroke.Thickness = 2

    -- Title
    local Title = Instance.new("TextLabel")
    Title.Size = UDim2.new(1, 0, 0, 20)
    Title.Position = UDim2.new(0, 0, 0, 0)
    Title.BackgroundTransparency = 1
    Title.Text = "XZX FRIENDS TOGGLE"
    Title.TextColor3 = Color3.fromRGB(255, 255, 255)
    Title.Font = Enum.Font.Code
    Title.TextScaled = true
    Title.Parent = Frame

    -- Toggle Button
    local ToggleButton = Instance.new("TextButton")
    ToggleButton.Size = UDim2.new(1, -10, 0, 30)
    ToggleButton.Position = UDim2.new(0, 5, 0, 25)
    ToggleButton.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
    ToggleButton.TextColor3 = Color3.fromRGB(255, 255, 255)
    ToggleButton.Font = Enum.Font.Code
    ToggleButton.TextScaled = true
    ToggleButton.Text = "OFF"
    ToggleButton.Parent = Frame

    local UICorner2 = Instance.new("UICorner", ToggleButton)
    UICorner2.CornerRadius = UDim.new(0, 6)

    -- Toggle functionality
    ToggleButton.MouseButton1Click:Connect(function()
        local success, state = ToggleFriends()
        if success then
            ToggleButton.Text = state and "ON" or "OFF"
        else
            ToggleButton.Text = "Not Found"
            task.delay(2, function()
                ToggleButton.Text = state and "ON" or "OFF"
            end)
        end
    end)

    -- Draggable
    local dragging = false
    local dragInput, dragStart, startPos

    local function update(input)
        local delta = input.Position - dragStart
        Frame.Position = UDim2.new(
            startPos.X.Scale,
            startPos.X.Offset + delta.X,
            startPos.Y.Scale,
            startPos.Y.Offset + delta.Y
        )
    end

    Frame.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 then
            dragging = true
            dragStart = input.Position
            startPos = Frame.Position
            input.Changed:Connect(function()
                if input.UserInputState == Enum.UserInputState.End then
                    dragging = false
                end
            end)
        end
    end)

    Frame.InputChanged:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseMovement then
            dragInput = input
        end
    end)

    UserInputService.InputChanged:Connect(function(input)
        if input == dragInput and dragging then
            update(input)
        end
    end)

    -- Keep searching for the prompt in the background
    task.spawn(function()
        while true do
            if not TargetPrompt then
                TargetPrompt = FindFriendsPrompt()
            end
            task.wait(1)
        end
    end)
    
    return ScreenGui
end

-- XZX PAINTBALL SPAM IMPLEMENTATION
local function loadPaintballSpam()
    -- Variables
    local SPAM_ENABLED = false
    local spamThread = nil
    local heartbeatConnection = nil

    -- Find nearest player
    local function findNearestPlayer()
        local nearestPlayer = nil
        local nearestDistance = math.huge
        local character = player.Character
        if not character then return nil end
        local humanoidRootPart = character:FindFirstChild("HumanoidRootPart")
        if not humanoidRootPart then return nil end
        
        for _, targetPlayer in pairs(Players:GetPlayers()) do
            if targetPlayer ~= player and targetPlayer.Character and targetPlayer.Character:FindFirstChild("HumanoidRootPart") then
                local distance = (targetPlayer.Character.HumanoidRootPart.Position - humanoidRootPart.Position).Magnitude
                if distance < nearestDistance then
                    nearestDistance = distance
                    nearestPlayer = targetPlayer
                end
            end
        end
        return nearestPlayer
    end

    -- Main paintball spam function
    local function spamPaintball()
        local character = player.Character
        if not character then return end
        
        -- Find the remote
        local net = game:GetService("ReplicatedStorage"):WaitForChild("Packages"):WaitForChild("Net")
        local useItemRemote = net:WaitForChild("RE/UseItem")
        
        -- Auto-equip paintball gun
        heartbeatConnection = RunService.Heartbeat:Connect(function()
            if SPAM_ENABLED and player.Character then
                local backpack = player:FindFirstChild("Backpack")
                if backpack then
                    local paintballGun = backpack:FindFirstChild("Paintball Gun")
                    if paintballGun then
                        local humanoid = player.Character:FindFirstChildOfClass("Humanoid")
                        if humanoid then
                            humanoid:EquipTool(paintballGun)
                        end
                    end
                end
            end
        end)
        
        -- Spam paintballs
        while SPAM_ENABLED do
            local nearestPlayer = findNearestPlayer()
            if nearestPlayer and nearestPlayer.Character and nearestPlayer.Character:FindFirstChild("HumanoidRootPart") then
                local coord = nearestPlayer.Character.HumanoidRootPart.Position
                pcall(function()
                    useItemRemote:FireServer(coord)
                end)
            end
            task.wait(0.002)
        end
    end

    -- Create UI
    local ScreenGui = Instance.new("ScreenGui")
    ScreenGui.Name = "XZXPaintballUI"
    ScreenGui.Parent = player:WaitForChild("PlayerGui")
    ScreenGui.ResetOnSpawn = false
    
    local Frame = Instance.new("Frame")
    Frame.Size = UDim2.new(0, 180, 0, 60)
    Frame.Position = UDim2.new(1, -190, 0, 15) -- top-right, 15px down
    Frame.BackgroundColor3 = Color3.fromRGB(25, 25, 25)
    Frame.Active = true
    Frame.Selectable = true
    Frame.Parent = ScreenGui
    
    local UICorner = Instance.new("UICorner", Frame)
    UICorner.CornerRadius = UDim.new(0, 8)
    
    -- Title
    local Title = Instance.new("TextLabel")
    Title.Size = UDim2.new(1, 0, 0, 20)
    Title.Position = UDim2.new(0, 0, 0, 0)
    Title.BackgroundTransparency = 1
    Title.Text = "XZX PAINTBALL SPAM"
    Title.TextColor3 = Color3.fromRGB(255, 255, 255)
    Title.Font = Enum.Font.Code
    Title.TextScaled = true
    Title.Parent = Frame
    
    -- Toggle Button
    local ToggleButton = Instance.new("TextButton")
    ToggleButton.Size = UDim2.new(1, -10, 0, 30)
    ToggleButton.Position = UDim2.new(0, 5, 0, 25)
    ToggleButton.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
    ToggleButton.TextColor3 = Color3.fromRGB(255, 255, 255)
    ToggleButton.Font = Enum.Font.Code
    ToggleButton.Text = "OFF"
    ToggleButton.TextScaled = true
    ToggleButton.Parent = Frame
    
    local UICorner2 = Instance.new("UICorner", ToggleButton)
    UICorner2.CornerRadius = UDim.new(0, 6)
    
    -- Toggle functionality
    ToggleButton.MouseButton1Click:Connect(function()
        SPAM_ENABLED = not SPAM_ENABLED
        
        if SPAM_ENABLED then
            ToggleButton.Text = "ON"
            ToggleButton.BackgroundColor3 = Color3.fromRGB(40, 200, 60)
            if spamThread then task.cancel(spamThread) end
            spamThread = task.spawn(spamPaintball)
        else
            ToggleButton.Text = "OFF"
            ToggleButton.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
            if heartbeatConnection then
                heartbeatConnection:Disconnect()
                heartbeatConnection = nil
            end
            if spamThread then
                task.cancel(spamThread)
                spamThread = nil
            end
        end
    end)
    
    -- Robust draggable
    local dragging = false
    local dragInput, dragStart, startPos
    
    local function update(input)
        local delta = input.Position - dragStart
        Frame.Position = UDim2.new(
            startPos.X.Scale, startPos.X.Offset + delta.X,
            startPos.Y.Scale, startPos.Y.Offset + delta.Y
        )
    end
    
    Frame.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 then
            dragging = true
            dragStart = input.Position
            startPos = Frame.Position
            
            input.Changed:Connect(function()
                if input.UserInputState == Enum.UserInputState.End then
                    dragging = false
                end
            end)
        end
    end)
    
    Frame.InputChanged:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseMovement then
            dragInput = input
        end
    end)
    
    UserInputService.InputChanged:Connect(function(input)
        if input == dragInput and dragging then
            update(input)
        end
    end)
    
    return ScreenGui
end

-- X RAY IMPLEMENTATION
local function loadXRay()
    -- Variables
    local originalTransparencies = {}
    local connections = {}

    -- Check if model is an animal / pet
    local function isAnimal(model)
        if not model or not model:IsA("Model") then return false end
        local anim = model:FindFirstChild("AnimationController")
        return anim and anim:IsA("AnimationController")
    end

    -- Decide if a part should be affected
    local function shouldAffect(obj)
        if not obj:IsA("BasePart") then return false end

        local validMaterials = {
            [Enum.Material.SmoothPlastic] = true,
            [Enum.Material.Plastic] = true,
            [Enum.Material.Neon] = true,
            [Enum.Material.Metal] = true,
            [Enum.Material.Wood] = true,
            [Enum.Material.Concrete] = true,
            [Enum.Material.Brick] = true
        }

        if not validMaterials[obj.Material] then return false end
        if obj.Transparency >= 0.6 then return false end

        local parent = obj.Parent
        while parent do
            if parent:IsA("Model") then
                if parent.Name == "Plots" then
                    return true
                end
                if isAnimal(parent) then
                    return false
                end
                if parent.Name == "FriendPanel"
                    or parent.Name:lower():find("ui")
                    or parent.Name:lower():find("gui") then
                    return false
                end
            end
            parent = parent.Parent
        end

        return true
    end

    -- Apply transparency
    local function makeTransparent(obj)
        if shouldAffect(obj) then
            if originalTransparencies[obj] == nil then
                originalTransparencies[obj] = obj.Transparency
            end
            obj.Transparency = 0.6
        end
    end

    -- Process a single plot
    local function processPlot(plotModel)
        if not plotModel or not plotModel:IsA("Model") then return end

        for _, item in ipairs(plotModel:GetDescendants()) do
            if item:IsA("BasePart") and shouldAffect(item) then
                makeTransparent(item)
            end
        end

        table.insert(connections, plotModel.DescendantAdded:Connect(function(desc)
            if featureStates.XRayEnabled and desc:IsA("BasePart") then
                makeTransparent(desc)
            end
        end))
    end

    -- Process all plots
    local function processAllPlots()
        local Plots = workspace:FindFirstChild("Plots")
        if not Plots then return end

        for _, plot in ipairs(Plots:GetChildren()) do
            if plot:IsA("Model") then
                processPlot(plot)
            end
        end

        table.insert(connections, Plots.ChildAdded:Connect(function(plot)
            if featureStates.XRayEnabled and plot:IsA("Model") then
                task.wait(0.5)
                processPlot(plot)
            end
        end))
    end

    -- Remove transparency
    local function removeTransparency()
        for obj, original in pairs(originalTransparencies) do
            if obj and obj.Parent then
                obj.Transparency = original
            end
        end
        originalTransparencies = {}
        
        for _, conn in ipairs(connections) do
            conn:Disconnect()
        end
        connections = {}
    end

    -- Enable/Disable XRay
    local function toggleXRay(value)
        featureStates.XRayEnabled = value
        if value then
            processAllPlots()
            ShowNotification("X RAY", "X-Ray enabled - See through plots!", 3)
        else
            removeTransparency()
            ShowNotification("X RAY", "X-Ray disabled", 2)
        end
    end
    
    return {
        Toggle = toggleXRay
    }
end

-- FEATURE TOGGLE FUNCTIONS
function toggleXZXPlatformFeature(value)
    featureStates.XZXPlatformEnabled = value
    if value then
        createXZXPlatform()
        ShowNotification("PLATFORM", "Platform enabled!", 3)
    else
        if xzxPlatform then xzxPlatform:Destroy() end
        if platformConnection then platformConnection:Disconnect() end
        ShowNotification("PLATFORM", "Platform disabled", 2)
    end
end

function toggleWallClimbFeature(value)
    featureStates.WallClimbEnabled = value
    if value then
        setupWallClimb()
        ShowNotification("WALL CLIMB", "Wall Climb enabled!", 3)
    else
        if wallClimbConnection then wallClimbConnection:Disconnect() end
        ShowNotification("WALL CLIMB", "Wall Climb disabled", 2)
    end
end

function toggleESPFeature(value)
    featureStates.ESPEnabled = value
    if value then
        updateESP()
        ShowNotification("ESP", "ESP enabled", 2)
    else
        for _, highlight in pairs(espHighlights) do
            if highlight then highlight:Destroy() end
        end
        espHighlights = {}
        ShowNotification("ESP", "ESP disabled", 2)
    end
end

function toggleMiniMapFeature(value)
    featureStates.MiniMapEnabled = value
    if value then
        createMiniMap()
        ShowNotification("MINI MAP", "Mini Map enabled", 2)
    else
        if miniMapGui then miniMapGui:Destroy() end
        if miniMapConnection then miniMapConnection:Disconnect() end
        playerDots = {}
        ShowNotification("MINI MAP", "Mini Map disabled", 2)
    end
end

function toggleSpeedBoostFeature(value)
    featureStates.SpeedBoostEnabled = value
    if value then
        applySpeedBoost()
        ShowNotification("SPEED", "Speed Boost enabled! (+30.5)", 2)
    else
        if speedConnection then
            speedConnection:Disconnect()
            speedConnection = nil
        end
        -- Reset walk speed
        local character = player.Character
        if character then
            local humanoid = character:FindFirstChild("Humanoid")
            if humanoid then
                humanoid.WalkSpeed = 16
            end
        end
        ShowNotification("SPEED", "Speed Boost disabled", 2)
    end
end

function toggleGravityBoostFeature(value)
    featureStates.GravityBoostEnabled = value
    applyGravityBoost()
    ShowNotification("GRAVITY", value and "Low Gravity enabled!" or "Gravity Boost disabled", 2)
end

function toggleDeliveryStealFeature(value)
    featureStates.DeliveryStealEnabled = value
    if value then
        setupDeliverySteal()
        ShowNotification("DELIVERY", "Delivery Steal enabled", 2)
    else
        if deliveryConnection then deliveryConnection:Disconnect() end
        ShowNotification("DELIVERY", "Delivery Steal disabled", 2)
    end
end

function toggleDesyncFeature(value)
    featureStates.DesyncEnabled = value
    if value then
        autoRespawn()
    else
        ShowNotification("DESYNC", "Auto respawn disabled", 2)
    end
end

function toggleBrainrotSpawnerFeature(value)
    featureStates.BrainrotSpawnerEnabled = value
    if value then
        loadBrainrotSpawner()
    else
        ShowNotification("SPAWNER", "Brainrot Spawner disabled", 2)
    end
end

function toggleAntiAFKFeature(value)
    featureStates.AntiAFKEnabled = value
    if value then
        setupAntiAFK()
        ShowNotification("ANTI-AFK", "Anti-AFK enabled", 2)
    else
        if antiAFKConnection then antiAFKConnection:Disconnect() end
        ShowNotification("ANTI-AFK", "Anti-AFK disabled", 2)
    end
end

function toggleSecretFilterFeature(value)
    featureStates.SecretFilterEnabled = value
    if value then
        featureStates.GodsFilterEnabled = false
        if uiElements.godsFilter then uiElements.godsFilter.Set(false) end
        
        BrainrotFinderConfig.brainrots_to_find = {}
        for _, name in ipairs(SecretBrainrotNames) do
            BrainrotFinderConfig.brainrots_to_find[name] = true
        end
        ShowNotification("FILTER", "Secret filter activated!", 3)
    else
        BrainrotFinderConfig.brainrots_to_find = {}
        ShowNotification("FILTER", "Secret filter disabled", 2)
    end
end

function toggleGodsFilterFeature(value)
    featureStates.GodsFilterEnabled = value
    if value then
        featureStates.SecretFilterEnabled = false
        if uiElements.secretFilter then uiElements.secretFilter.Set(false) end
        
        BrainrotFinderConfig.brainrots_to_find = {}
        for _, name in ipairs(BrainrotGodsNames) do
            BrainrotFinderConfig.brainrots_to_find[name] = true
        end
        ShowNotification("FILTER", "Brainrot Gods filter activated!", 3)
    else
        BrainrotFinderConfig.brainrots_to_find = {}
        ShowNotification("FILTER", "Brainrot Gods filter disabled", 2)
    end
end

function toggleJumpBoostFeature(value)
    featureStates.JumpBoostEnabled = value
    if value then
        local character = player.Character
        if character then
            applyJumpBoost(character)
        end
        ShowNotification("JUMP BOOST", "Jump Boost enabled (Power: 83)", 3)
    else
        local character = player.Character
        if character then
            removeJumpBoost(character)
        end
        ShowNotification("JUMP BOOST", "Jump Boost disabled", 2)
    end
end

function toggleFPSKillerFeature(value)
    featureStates.FPSKillerEnabled = value
    if value then
        if not externalScripts.FPSKiller then
            externalScripts.FPSKiller = loadFPSKiller()
        end
        ShowNotification("FPS KILLER", "FPS Killer activated", 3)
    else
        if externalScripts.FPSKiller then
            externalScripts.FPSKiller:Destroy()
            externalScripts.FPSKiller = nil
        end
        ShowNotification("FPS KILLER", "FPS Killer disabled", 2)
    end
end

function toggleLazerSpamFeature(value)
    featureStates.LazerSpamEnabled = value
    if value then
        if not externalScripts.LazerSpam then
            externalScripts.LazerSpam = loadLazerSpam()
        end
        ShowNotification("LAZER SPAM", "Lazer Spam activated", 3)
    else
        if externalScripts.LazerSpam then
            externalScripts.LazerSpam:Destroy()
            externalScripts.LazerSpam = nil
        end
        ShowNotification("LAZER SPAM", "Lazer Spam disabled", 2)
    end
end

function togglePaintballSpamFeature(value)
    featureStates.PaintballSpamEnabled = value
    if value then
        if not externalScripts.PaintballSpam then
            externalScripts.PaintballSpam = loadPaintballSpam()
        end
        ShowNotification("PAINTBALL SPAM", "Paintball Spam activated", 3)
    else
        if externalScripts.PaintballSpam then
            externalScripts.PaintballSpam:Destroy()
            externalScripts.PaintballSpam = nil
        end
        ShowNotification("PAINTBALL SPAM", "Paintball Spam disabled", 2)
    end
end

function toggleAutoKickFeature(value)
    featureStates.AutoKickEnabled = value
    if value then
        loadExternalScript("https://pastebin.com/raw/jKUs7ePs", "AutoKick")
        ShowNotification("AUTO KICK", "Auto Kick activated", 3)
    else
        unloadExternalScript("AutoKick")
        ShowNotification("AUTO KICK", "Auto Kick disabled", 2)
    end
end

function toggleAllowDisallowFeature(value)
    featureStates.AllowDisallowEnabled = value
    if value then
        if not externalScripts.AllowDisallow then
            externalScripts.AllowDisallow = loadFriendsToggle()
        end
        ShowNotification("ALLOW/DISALLOW", "Allow/Disallow activated", 3)
    else
        if externalScripts.AllowDisallow then
            externalScripts.AllowDisallow:Destroy()
            externalScripts.AllowDisallow = nil
        end
        ShowNotification("ALLOW/DISALLOW", "Allow/Disallow disabled", 2)
    end
end

function toggleXRayFeature(value)
    featureStates.XRayEnabled = value
    if value then
        if not externalScripts.XRay then
            externalScripts.XRay = loadXRay()
        end
        externalScripts.XRay.Toggle(value)
    else
        if externalScripts.XRay then
            externalScripts.XRay.Toggle(value)
        end
    end
end

-- BUTTON ACTIONS
function setCheckpointFeature()
    local char = player.Character
    if char and char:FindFirstChild("HumanoidRootPart") then
        checkpointPosition = char.HumanoidRootPart.Position
        ShowNotification("CHECKPOINT", "Checkpoint set!", 2)
    else
        ShowNotification("CHECKPOINT", "No character found", 2, true)
    end
end

function resetCharacterFeature()
    local char = player.Character
    if char then
        local humanoid = char:FindFirstChildOfClass("Humanoid")
        if humanoid then humanoid.Health = 0 end
    end
    ShowNotification("RESET", "Character reset", 2)
end

function teleportToSpawnFeature()
    local char = player.Character
    if char and char:FindFirstChild("HumanoidRootPart") then
        char.HumanoidRootPart.CFrame = CFrame.new(0, 25, 0)
        ShowNotification("TELEPORT", "Teleported to spawn", 2)
    else
        ShowNotification("TELEPORT", "No character found", 2, true)
    end
end

function kickNowFeature()
    player:Kick("KICK SUCCESSFUL")
end

function joinDiscordFeature()
    if setclipboard then
        setclipboard("https://discord.gg/HVmFyZVgNK")
        ShowNotification("DISCORD", "Copied invite to clipboard!", 3)
    else
        ShowNotification("DISCORD", "Join: https://discord.gg/HVmFyZVgNK", 5)
    end
end

function startBrainrotFinderFeature()
    startBrainrotFinder()
end

-- POPULATE TABS WITH TOGGLES
function populateMainTab()
    local page = pages["MAIN"]
    if not page then return end
    
    -- Clear existing
    for _, child in ipairs(page:GetChildren()) do
        if child:IsA("Frame") or child:IsA("TextButton") or child:IsA("TextBox") then
            child:Destroy()
        end
    end
    
    -- Toggles at the top
    local toggleY = 0
    uiElements.desyncToggle = createToggle(page, "AUTO RESPAWN (DESYNC)", toggleY, toggleDesyncFeature, "DesyncEnabled")
    
    toggleY = toggleY + 40
    uiElements.antiAFKToggle = createToggle(page, "ANTI-AFK", toggleY, toggleAntiAFKFeature, "AntiAFKEnabled")
    
    toggleY = toggleY + 40
    uiElements.fpsKillerToggle = createToggle(page, "FPS KILLER", toggleY, toggleFPSKillerFeature, "FPSKillerEnabled")
    
    toggleY = toggleY + 40
    uiElements.lazerSpamToggle = createToggle(page, "LAZER SPAM", toggleY, toggleLazerSpamFeature, "LazerSpamEnabled")
    
    toggleY = toggleY + 40
    uiElements.paintballSpamToggle = createToggle(page, "PAINTBALL SPAM", toggleY, togglePaintballSpamFeature, "PaintballSpamEnabled")
    
    toggleY = toggleY + 40
    uiElements.autoKickToggle = createToggle(page, "AUTO KICK", toggleY, toggleAutoKickFeature, "AutoKickEnabled")
    
    toggleY = toggleY + 40
    uiElements.allowDisallowToggle = createToggle(page, "ALLOW/DISALLOW", toggleY, toggleAllowDisallowFeature, "AllowDisallowEnabled")
end

function populateBoostsTab()
    local page = pages["BOOSTS"]
    if not page then return end
    
    for _, child in ipairs(page:GetChildren()) do
        if child:IsA("Frame") or child:IsA("TextButton") or child:IsA("TextBox") then
            child:Destroy()
        end
    end
    
    -- Toggles only - Added Jump Boost to BOOSTS tab
    uiElements.speedToggle = createToggle(page, "SPEED BOOST (+30.5)", 0, toggleSpeedBoostFeature, "SpeedBoostEnabled")
    uiElements.gravityToggle = createToggle(page, "GRAVITY BOOST", 40, toggleGravityBoostFeature, "GravityBoostEnabled")
    uiElements.jumpBoostToggle = createToggle(page, "JUMP BOOST", 80, toggleJumpBoostFeature, "JumpBoostEnabled")
    
    -- Reset button at bottom
    createButton(page, "RESET ALL BOOSTS", 120, function()
        if uiElements.speedToggle then uiElements.speedToggle.Set(false) end
        if uiElements.gravityToggle then uiElements.gravityToggle.Set(false) end
        if uiElements.jumpBoostToggle then uiElements.jumpBoostToggle.Set(false) end
        ShowNotification("BOOSTS", "All boosts disabled", 2)
    end)
end

function populateVisualTab()
    local page = pages["VISUAL"]
    if not page then return end
    
    for _, child in ipairs(page:GetChildren()) do
        if child:IsA("Frame") or child:IsA("TextButton") or child:IsA("TextBox") then
            child:Destroy()
        end
    end
    
    -- Toggles at the top
    local toggleY = 0
    uiElements.espToggle = createToggle(page, "ESP", toggleY, toggleESPFeature, "ESPEnabled")
    
    toggleY = toggleY + 40
    uiElements.miniMapToggle = createToggle(page, "MINI MAP", toggleY, toggleMiniMapFeature, "MiniMapEnabled")
    
    toggleY = toggleY + 40
    uiElements.xrayToggle = createToggle(page, "X RAY", toggleY, toggleXRayFeature, "XRayEnabled")
end

function populateMovementTab()
    local page = pages["MOVEMENT"]
    if not page then return end
    
    for _, child in ipairs(page:GetChildren()) do
        if child:IsA("Frame") or child:IsA("TextButton") or child:IsA("TextBox") then
            child:Destroy()
        end
    end
    
    -- Toggles at the top
    local toggleY = 0
    uiElements.platformToggle = createToggle(page, "XZX PLATFORM", toggleY, toggleXZXPlatformFeature, "XZXPlatformEnabled")
    
    toggleY = toggleY + 40
    uiElements.wallClimbToggle = createToggle(page, "WALL CLIMB", toggleY, toggleWallClimbFeature, "WallClimbEnabled")
    
    toggleY = toggleY + 40
    uiElements.deliveryToggle = createToggle(page, "DELIVERY STEAL", toggleY, toggleDeliveryStealFeature, "DeliveryStealEnabled")
    
    -- Buttons at the bottom
    local buttonY = toggleY + 40
    createButton(page, "SET CHECKPOINT", buttonY, setCheckpointFeature)
    
    -- Textbox and button for job join
    local jobBox = createTextBox(page, "Enter Job ID to join server", buttonY + 40)
    createButton(page, "JOIN JOB ID SERVER", buttonY + 80, function()
        local jobId = jobBox.Text
        if jobId and jobId ~= "" then
            ShowNotification("SERVER", "Joining server: " .. jobId, 3)
            TeleportService:TeleportToPlaceInstance(game.PlaceId, jobId, player)
        else
            ShowNotification("SERVER", "Please enter a Job ID", 2, true)
        end
    end)
end

function populateSpawnerTab()
    local page = pages["SPAWNER"]
    if not page then return end
    
    for _, child in ipairs(page:GetChildren()) do
        if child:IsA("Frame") or child:IsA("TextButton") or child:IsA("TextBox") then
            child:Destroy()
        end
    end
    
    -- Toggle at the top
    uiElements.spawnerToggle = createToggle(page, "BRAINROT SPAWNER", 0, toggleBrainrotSpawnerFeature, "BrainrotSpawnerEnabled")
    
    -- Button at the bottom
    createButton(page, "GET SPAWNER KEY", 40, function()
        ShowNotification("KEY", "Spawner Key: 262123", 5)
    end)
end

function populateFinderTab()
    local page = pages["FINDER"]
    if not page then return end
    
    for _, child in ipairs(page:GetChildren()) do
        if child:IsA("Frame") or child:IsA("TextButton") or child:IsA("TextBox") then
            child:Destroy()
        end
    end
    
    -- Toggles at the top
    local toggleY = 0
    uiElements.secretFilter = createToggle(page, "FILTER: SECRETS", toggleY, toggleSecretFilterFeature, "SecretFilterEnabled")
    
    toggleY = toggleY + 40
    uiElements.godsFilter = createToggle(page, "FILTER: BRAINROT GODS", toggleY, toggleGodsFilterFeature, "GodsFilterEnabled")
    
    -- Buttons and textbox at the bottom
    local buttonY = toggleY + 40
    createButton(page, "START BRAINROT FINDER", buttonY, startBrainrotFinderFeature)
    
    local nameBox = createTextBox(page, "Enter brainrot name to track", buttonY + 40)
    createButton(page, "ADD TO FILTER", buttonY + 80, function()
        local name = nameBox.Text
        if name and name ~= "" then
            BrainrotFinderConfig.brainrots_to_find[name] = true
            ShowNotification("FILTER", "Added '" .. name .. "' to filter", 3)
            nameBox.Text = ""
        end
    end)
    
    createButton(page, "RESET FILTER", buttonY + 120, function()
        BrainrotFinderConfig.brainrots_to_find = {}
        if uiElements.secretFilter then uiElements.secretFilter.Set(false) end
        if uiElements.godsFilter then uiElements.godsFilter.Set(false) end
        ShowNotification("FILTER", "Filter reset", 2)
    end)
end

function populateDiscordTab()
    local page = pages["DISCORD"]
    if not page then return end
    
    for _, child in ipairs(page:GetChildren()) do
        if child:IsA("Frame") or child:IsA("TextButton") or child:IsA("TextBox") then
            child:Destroy()
        end
    end
    
    -- Welcome message
    local welcomeLabel = Instance.new("TextLabel", page)
    welcomeLabel.Position = UDim2.fromOffset(10, 10)
    welcomeLabel.Size = UDim2.new(1, -20, 0, 100)
    welcomeLabel.BackgroundTransparency = 1
    welcomeLabel.Text = "Thanks for using our hub! Please join our Discord for giveaways, updates, and announcements. If you find any bugs or have any questions, feel free to let us know—we're happy to help."
    welcomeLabel.TextColor3 = C_TEXT
    welcomeLabel.Font = Enum.Font.Gotham
    welcomeLabel.TextSize = 12
    welcomeLabel.TextWrapped = true
    
    -- Discord link button (UNDER the welcome message)
    createButton(page, "DISCORD LINK", 120, joinDiscordFeature)
end

-- POPULATE ALL TABS NOW
populateMainTab()
populateBoostsTab()
populateVisualTab()
populateMovementTab()
populateSpawnerTab()
populateFinderTab()
populateDiscordTab()

-- UPDATE TAB CLICK HANDLERS
for name, btn in pairs(tabButtons) do
    btn.MouseButton1Click:Connect(function()
        switchTab(name)
    end)
end

-- CHARACTER ADDED EVENTS
player.CharacterAdded:Connect(function(character)
    task.wait(1)
    if character and character:FindFirstChild("HumanoidRootPart") then
        playerSpawnPosition = character.HumanoidRootPart.Position
        if not checkpointPosition then
            checkpointPosition = playerSpawnPosition
        end
        
        if featureStates.SpeedBoostEnabled then
            applySpeedBoost()
        end
        if featureStates.JumpBoostEnabled then
            applyJumpBoost(character)
        end
    end
end)

-- ESP UPDATE LOOP
task.spawn(function()
    while task.wait(1) do
        if featureStates.ESPEnabled then
            updateESP()
        end
    end
end)

-- PLAYER JOIN ESP
Players.PlayerAdded:Connect(function(newPlayer)
    if featureStates.ESPEnabled then
        createESPBox(newPlayer)
    end
end)

Players.PlayerRemoving:Connect(function(leavingPlayer)
    if espHighlights[leavingPlayer] then
        espHighlights[leavingPlayer]:Destroy()
        espHighlights[leavingPlayer] = nil
    end
end)

-- INITIAL NOTIFICATION
ShowNotification("XZX HUB", "Menu loaded successfully!\nF5 to toggle menu", 5)

-- F5 TOGGLE MENU
UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    
    if input.KeyCode == Enum.KeyCode.F5 then
        gui.Enabled = not gui.Enabled
        ShowNotification("MENU", gui.Enabled and "Menu opened (F5)" or "Menu hidden", 2)
    end
end)

-- Apply saved states to all features
task.wait(0.5)
-- Apply all saved states
if featureStates.SpeedBoostEnabled then toggleSpeedBoostFeature(true) end
if featureStates.GravityBoostEnabled then toggleGravityBoostFeature(true) end
if featureStates.JumpBoostEnabled then toggleJumpBoostFeature(true) end
if featureStates.ESPEnabled then toggleESPFeature(true) end
if featureStates.MiniMapEnabled then toggleMiniMapFeature(true) end
if featureStates.XRayEnabled then toggleXRayFeature(true) end
if featureStates.XZXPlatformEnabled then toggleXZXPlatformFeature(true) end
if featureStates.WallClimbEnabled then toggleWallClimbFeature(true) end
if featureStates.DeliveryStealEnabled then toggleDeliveryStealFeature(true) end
if featureStates.DesyncEnabled then toggleDesyncFeature(true) end
if featureStates.BrainrotSpawnerEnabled then toggleBrainrotSpawnerFeature(true) end
if featureStates.AntiAFKEnabled then toggleAntiAFKFeature(true) end
if featureStates.SecretFilterEnabled then toggleSecretFilterFeature(true) end
if featureStates.GodsFilterEnabled then toggleGodsFilterFeature(true) end
if featureStates.FPSKillerEnabled then toggleFPSKillerFeature(true) end
if featureStates.LazerSpamEnabled then toggleLazerSpamFeature(true) end
if featureStates.PaintballSpamEnabled then togglePaintballSpamFeature(true) end
if featureStates.AutoKickEnabled then toggleAutoKickFeature(true) end
if featureStates.AllowDisallowEnabled then toggleAllowDisallowFeature(true) end
\`\`\`

**Instructions:**
1. Copy this entire script
2. Open Roblox executor
3. Paste and run
4. Press F5 to toggle menu

**Features included:**
✅ Auto Respawn (Desync) • ESP & Mini Map • Speed/Gravity/Jump Boosts • XZX Platform & Wall Climb • Brainrot Spawner & Finder • FPS Killer & Lazer Spam • Paintball Spam & Auto Kick • X-Ray • Anti-AFK`;

// Expanded AI-like response system (only for help contexts)
const INTELLIGENCE_LAYERS = {
  // KEY REQUESTS - SPECIAL HANDLING
  KEY_REQUESTS: {
    keywords: ["key", "api key", "license", "access", "activation", "serial", "code", "token", "auth key", "credential", "generate key", "get key", "need key", "want key", "where key", "key please"],
    responses: [KEY_RESPONSE],
    pingSupport: false,
    alwaysRespond: true
  },

  // XZX HUB ISSUES - SPECIAL HANDLING
  XZX_HUB_ISSUES: {
    keywords: ["xzx", "xzx hub", "xzx problem", "xzx not working", "xzx error", "xzx broken", "xzx script", "xzx code", "steal a brainrot", "brainrot hub", "xzx hub code", "xzx hub script", "xzx hub not working", "xzx download", "xzx pastebin", "xzx script paste", "xzx script download"],
    responses: [XZX_HUB_CODE],
    pingSupport: false,
    alwaysRespond: true
  },

  INSTALLATION_HELP: {
    keywords: ["install", "setup", "download", "configure", "implementation", "deploy", "run", "execute", "launch", "init", "get started"],
    responses: [
      "📦 **Installation help**\nMake sure you followed all installation steps correctly.\nIf you're stuck, explain what step failed.",
      "⚙️ **Setup assistance**\nPlease verify system requirements and proper permissions are set."
    ],
    pingSupport: false
  },

  ERROR_HANDLING: {
    keywords: ["error", "not working", "broken", "failed", "doesnt work", "crash", "bug", "issue", "problem", "malfunction", "exception", "fault", "fix", "repair", "solve"],
    responses: [
      "⚠️ **Issue detected**\nPlease describe what happened and include any error messages.",
      "🔍 **Problem identified**\nShare the exact error and what you were doing when it occurred."
    ],
    pingSupport: true
  },

  AUTHENTICATION: {
    keywords: ["login", "token", "invalid", "auth", "password", "sign in", "authentication", "credentials", "unauthorized", "access denied", "cannot log in"],
    responses: [
      "🔒 **Authentication issue**\nMake sure your token/key is valid and copied correctly.",
      "🛡️ **Login problem**\nVerify your credentials are current and properly formatted."
    ],
    pingSupport: true
  },

  UPDATES_INFO: {
    keywords: ["when update", "how long update", "eta", "new version", "upcoming feature", "roadmap", "release date", "when will", "coming soon", "next update"],
    responses: [
      "⏳ **Update info**\nUpdates are being worked on and will be announced soon.",
      "📅 **Development update**\nNew features release when stable. No exact ETA available."
    ],
    pingSupport: false
  },

  GENERAL_HELP: {
    keywords: ["help me", "confused", "idk", "how do i", "what should", "can you help", "assist me", "support needed", "need guidance", "stuck on"],
    responses: [
      "🤔 **No worries**\nExplain what you're trying to do and we'll help you out.",
      "💡 **Need assistance**\nPlease describe your issue in detail for better help."
    ],
    pingSupport: true
  },

  ACCESS_ISSUES: {
    keywords: ["banned", "blacklisted", "denied", "no access", "suspended", "restricted", "blocked", "terminated", "revoked", "cannot access"],
    responses: [
      "🚫 **Access issue**\nAccess may be restricted due to rule violations or invalid keys.",
      "🔒 **Account restricted**\nContact support with your user ID and time of restriction."
    ],
    pingSupport: true
  },

  STATUS_CHECKS: {
    keywords: ["status", "online", "offline", "working", "down", "maintenance", "server", "service", "availability", "is it down", "server status"],
    responses: [
      "📊 **System status:** All systems operational. No reported outages.",
      "✅ **Service check:** All endpoints responding normally."
    ],
    pingSupport: false
  },

  SPECIFIC_QUESTIONS: {
    keywords: ["what is", "how does", "why does", "where to", "which one", "can i use", "is there a", "does this work with", "compatible with"],
    responses: [
      "🎯 **Specific query**\nCould you provide more details about your use case?",
      "🔍 **Question received**\nNeed more context to give an accurate answer."
    ],
    pingSupport: false
  }
};

// Check if message needs help response
function needsHelpResponse(message) {
  const content = message.content.toLowerCase();
  
  // Don't respond to very short messages (likely social)
  if (content.length < 4) return false;
  
  // Don't respond to URLs only
  if (content.match(/^https?:\/\/\S+$/)) return false;
  
  // Check for ignore keywords (social conversation)
  const hasIgnoreKeyword = RESPONSE_TRIGGERS.IGNORE_KEYWORDS.some(keyword => 
    content.includes(keyword) || new RegExp(`\\b${keyword}\\b`, 'i').test(content)
  );
  
  if (hasIgnoreKeyword) return false;
  
  // Check for explicit help requests
  const hasHelpKeyword = RESPONSE_TRIGGERS.HELP_KEYWORDS.some(keyword => 
    content.includes(keyword) && content.length > 8
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
    content.includes(keyword) && (hasQuestionWord || content.length > 12)
  );
  
  // Must have at least one trigger AND not be obviously social
  const shouldRespond = (hasHelpKeyword || hasProblemKeyword || 
                        (hasQuestionWord && hasTechnicalKeyword) ||
                        (hasTechnicalKeyword && content.length > 15));
  
  return shouldRespond;
}

// Check if message is specifically about XZX Hub
function isXZXHubRequest(message) {
  const content = message.content.toLowerCase();
  
  // Check for XZX Hub keywords
  const xzxKeywords = INTELLIGENCE_LAYERS.XZX_HUB_ISSUES.keywords;
  
  // More flexible matching for XZX Hub issues
  const hasXZXWord = xzxKeywords.some(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    return regex.test(content) || content.includes(keyword);
  });
  
  // Also check for phrases with "hub" and problems
  const hubPhrases = ["hub not", "hub error", "hub broken", "hub script", "hub code"];
  const hasHubPhrase = hubPhrases.some(phrase => 
    content.includes(phrase) && (content.includes("xzx") || content.includes("brainrot"))
  );
  
  return hasXZXWord || hasHubPhrase;
}

// Check if message is specifically about keys
function isKeyRequest(message) {
  const content = message.content.toLowerCase();
  
  // Check for key-related keywords
  const keyKeywords = INTELLIGENCE_LAYERS.KEY_REQUESTS.keywords;
  
  // Special handling for key requests - respond even to simple requests
  const hasKeyWord = keyKeywords.some(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    return regex.test(content) || content.includes(keyword);
  });
  
  // Also check for phrases like "where do I get" + "key"
  const keyPhrases = ["where get", "how get", "need a", "want a", "looking for", "find key", "key pls", "key please"];
  const hasKeyPhrase = keyPhrases.some(phrase => 
    content.includes(phrase) && content.includes("key")
  );
  
  return hasKeyWord || hasKeyPhrase;
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
  
  // PRIORITY 1: Always respond to XZX Hub requests (even if simple)
  if (isXZXHubRequest(message)) {
    // Mark this as a help interaction
    const userContext = contextMemory.get(userId);
    if (userContext) {
      userContext.lastInteraction = 'help';
    }
    
    // Send XZX Hub code response IMMEDIATELY
    try {
      await message.reply(XZX_HUB_CODE);
      
      // Set cooldown
      userCooldowns.set(userId, now + COOLDOWN_TIME);
      
      // Auto-clear cooldown after timeout
      setTimeout(() => {
        userCooldowns.delete(userId);
      }, COOLDOWN_TIME);
    } catch (error) {
      console.error("Error sending message:", error);
    }
    return; // Don't check other categories
  }
  
  // PRIORITY 2: Always respond to key requests (even if simple)
  if (isKeyRequest(message)) {
    // Mark this as a help interaction
    const userContext = contextMemory.get(userId);
    if (userContext) {
      userContext.lastInteraction = 'help';
    }
    
    // Send key response IMMEDIATELY
    try {
      await message.reply(KEY_RESPONSE);
      
      // Set cooldown
      userCooldowns.set(userId, now + COOLDOWN_TIME);
      
      // Auto-clear cooldown after timeout
      setTimeout(() => {
        userCooldowns.delete(userId);
      }, COOLDOWN_TIME);
    } catch (error) {
      console.error("Error sending message:", error);
    }
    return; // Don't check other categories
  }
  
  // For other messages: First check if this message needs help at all
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
  
  // Get specific help category if any (excluding priority categories since they're already handled)
  let response = null;
  let pingSupport = false;
  let matchedCategory = null;
  
  const categories = Object.entries(INTELLIGENCE_LAYERS).filter(([name]) => 
    name !== 'KEY_REQUESTS' && name !== 'XZX_HUB_ISSUES'
  );
  
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
      break;
    }
  }
  
  if (!response) {
    // Generic help response for non-categorized help requests
    const genericResponses = [
      "💬 **Message received**\nIf you need help, explain the issue and support will assist you.",
      "🤖 **I'm here to help!**\nPlease describe your technical issue or question.",
      "🔍 **Need assistance?**\nExplain what you're trying to do and where you're stuck."
    ];
    response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
  }
  
  // Add support ping if needed
  if (pingSupport) {
    response += `\n\n📣 <@&${SUPPORT_ROLE_ID}>`;
  }
  
  // Send response IMMEDIATELY (no delay)
  try {
    await message.reply(response);
    
    // Set cooldown
    userCooldowns.set(userId, now + COOLDOWN_TIME);
    
    // Auto-clear cooldown after timeout
    setTimeout(() => {
      userCooldowns.delete(userId);
    }, COOLDOWN_TIME);
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
      "Ready to share XZX Hub code",
      "Awaiting key requests",
      "Monitoring for help requests",
      "Standing by for technical issues"
    ];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    client.user.setActivity(randomStatus, { type: 3 });
  }
}, 300000);

client.once("ready", () => {
  console.log(`✅ Smart Support Bot online as ${client.user.tag}`);
  console.log(`🔑 Key responses ready`);
  console.log(`🎮 XZX Hub code ready`);
  console.log(`⚡ Immediate reply mode active`);
  client.user.setActivity("for XZX Hub & key requests", { type: 3 });
});

client.login(process.env.DISCORD_TOKEN);
