import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Copy, Code, FileCode, Zap, Package, Server, Monitor, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GeneratedScript {
  filename: string;
  content: string;
  type: 'client' | 'server' | 'config' | 'manifest' | 'ui' | 'html' | 'css' | 'js';
}

const frameworkOptions = [
  { value: 'esx', label: 'ESX Framework' },
  { value: 'qbcore', label: 'QB-Core Framework' },
  { value: 'standalone', label: 'Standalone (bez framework)' }
];

export function LuaGenerator() {
  const [selectedFramework, setSelectedFramework] = useState('esx');
  const [generatedScripts, setGeneratedScripts] = useState<GeneratedScript[]>([]);
  const [selectedScript, setSelectedScript] = useState<string>('');
  const { toast } = useToast();

  const generateScripts = () => {
    const scripts: GeneratedScript[] = [];

    // Generate all FiveM resource files
    scripts.push({
      filename: 'fxmanifest.lua',
      content: generateManifest(),
      type: 'manifest'
    });

    scripts.push({
      filename: 'config.lua',
      content: generateConfig(),
      type: 'config'
    });

    scripts.push({
      filename: 'server/main.lua',
      content: generateServerScript(),
      type: 'server'
    });

    scripts.push({
      filename: 'client/main.lua',
      content: generateClientScript(),
      type: 'client'
    });

    scripts.push({
      filename: 'ui/index.html',
      content: generateUIHTML(),
      type: 'html'
    });

    scripts.push({
      filename: 'ui/style.css',
      content: generateUICSS(),
      type: 'css'
    });

    scripts.push({
      filename: 'ui/script.js',
      content: generateUIJS(),
      type: 'js'
    });

    scripts.push({
      filename: 'README.md',
      content: generateREADME(),
      type: 'config'
    });

    setGeneratedScripts(scripts);
    setSelectedScript(scripts[0].filename);
    
    toast({
      title: "Zasób FiveM wygenerowany!",
      description: `Kompletny zasób z ${scripts.length} plikami gotowy do użycia`
    });
  };

  const generateManifest = () => {
    return `fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'zav-logs'
author 'Zav Logs System'
description 'Advanced logging system for FiveM with Discord webhooks and admin UI'
version '2.0.0'

-- Server scripts
server_scripts {
    'config.lua',
    'server/main.lua'
}

-- Client scripts
client_scripts {
    'config.lua',
    'client/main.lua'
}

-- UI files
ui_page 'ui/index.html'
files {
    'ui/index.html',
    'ui/style.css',
    'ui/script.js'
}

-- Dependencies
${selectedFramework === 'esx' ? 'dependency \'es_extended\'' : ''}
${selectedFramework === 'qbcore' ? 'dependency \'qb-core\'' : ''}

-- Metadata
provides {
    'logging-system',
    'discord-webhooks',
    'admin-panel'
}

-- Exports
exports {
    'LogCommand',
    'LogEvent',
    'SendDiscordLog'
}`;
  };

  const generateConfig = () => {
    return `Config = {}
Config.Debug = false

-- Framework Configuration
Config.Framework = '${selectedFramework}'

-- Bot Name (DO NOT CHANGE)
Config.BotName = 'zav-logs'

-- Discord Webhook Configuration
Config.Webhooks = {
    ['admin'] = '',
    ['economy'] = '',
    ['vehicles'] = '',
    ['items'] = '',
    ['jobs'] = '',
    ['moderation'] = '',
    ['events'] = '',
    ['general'] = ''
}

-- UI Configuration
Config.UI = {
    enabled = true,
    command = 'zavlogs',
    keybind = 'F9',
    adminOnly = true
}

-- Commands to log
Config.Commands = {
    ['givecar'] = {
        enabled = true,
        category = 'vehicles',
        webhook = 'vehicles',
        title = '🚗 Vehicle Spawned',
        color = 3447003,
        description = 'Admin spawned a vehicle'
    },
    ['giveitem'] = {
        enabled = true,
        category = 'items',
        webhook = 'items',
        title = '📦 Item Given',
        color = 15844367,
        description = 'Admin gave an item to player'
    },
    ['givemoney'] = {
        enabled = true,
        category = 'economy',
        webhook = 'economy',
        title = '💰 Money Given',
        color = 5763719,
        description = 'Admin gave money to player'
    },
    ['setjob'] = {
        enabled = true,
        category = 'jobs',
        webhook = 'jobs',
        title = '💼 Job Changed',
        color = 9442302,
        description = 'Admin changed player job'
    },
    ['kick'] = {
        enabled = true,
        category = 'moderation',
        webhook = 'moderation',
        title = '👢 Player Kicked',
        color = 15158332,
        description = 'Admin kicked a player'
    },
    ['ban'] = {
        enabled = true,
        category = 'moderation',
        webhook = 'moderation',
        title = '🔨 Player Banned',
        color = 10038562,
        description = 'Admin banned a player'
    }
}

-- Events to log
Config.Events = {
    ['playerConnecting'] = {
        enabled = true,
        category = 'events',
        webhook = 'events',
        title = '🔗 Player Connecting',
        color = 3066993,
        description = 'Player is connecting to server'
    },
    ['playerDropped'] = {
        enabled = true,
        category = 'events',
        webhook = 'events',
        title = '📤 Player Disconnected',
        color = 15158332,
        description = 'Player disconnected from server'
    },
    ['chatMessage'] = {
        enabled = false,
        category = 'events',
        webhook = 'events',
        title = '💬 Chat Message',
        color = 16776960,
        description = 'Player sent a chat message'
    },
    ['playerDied'] = {
        enabled = true,
        category = 'events',
        webhook = 'events',
        title = '💀 Player Died',
        color = 16711680,
        description = 'Player died in game'
    }
}

-- Permission levels
Config.Permissions = {
    ['admin'] = {
        canUseUI = true,
        canViewLogs = true,
        canExecuteCommands = true
    },
    ['moderator'] = {
        canUseUI = true,
        canViewLogs = true,
        canExecuteCommands = false
    },
    ['user'] = {
        canUseUI = false,
        canViewLogs = false,
        canExecuteCommands = false
    }
}`;
  };

  const generateServerScript = () => {
    return `-- Zav Logs Server Script
-- Framework initialization
${selectedFramework === 'esx' ? "ESX = exports['es_extended']:getSharedObject()" : ''}
${selectedFramework === 'qbcore' ? "local QBCore = exports['qb-core']:GetCoreObject()" : ''}

-- Utility functions
local function GetPlayerName(playerId)
    return GetPlayerName(playerId) or 'Unknown'
end

local function GetPlayerIdentifiers(playerId)
    local identifiers = {}
    if playerId then
        for _, identifier in pairs(GetPlayerIdentifiers(playerId)) do
            if string.match(identifier, 'steam:') then
                identifiers.steam = identifier
            elseif string.match(identifier, 'license:') then
                identifiers.license = identifier
            elseif string.match(identifier, 'discord:') then
                identifiers.discord = identifier
            end
        end
    end
    return identifiers
end

local function IsPlayerAdmin(playerId)
    ${selectedFramework === 'esx' ? `
    local xPlayer = ESX.GetPlayerFromId(playerId)
    return xPlayer and xPlayer.getGroup() ~= 'user'
    ` : ''}
    ${selectedFramework === 'qbcore' ? `
    local Player = QBCore.Functions.GetPlayer(playerId)
    return Player and Player.PlayerData.job.name == 'admin'
    ` : ''}
    ${selectedFramework === 'standalone' ? `
    return IsPlayerAceAllowed(playerId, 'zavlogs.admin')
    ` : ''}
end

-- Discord webhook function
function SendDiscordLog(webhook, title, description, fields, color)
    local webhookUrl = Config.Webhooks[webhook]
    if not webhookUrl or webhookUrl == '' then
        if Config.Debug then
            print('[Zav Logs] No webhook configured for: ' .. webhook)
        end
        return
    end

    local embed = {
        {
            title = title,
            description = description,
            color = color,
            fields = fields or {},
            footer = {
                text = Config.BotName .. ' • ' .. os.date('%Y-%m-%d %H:%M:%S'),
                icon_url = 'https://i.imgur.com/your-icon.png'
            },
            timestamp = os.date('!%Y-%m-%dT%H:%M:%SZ')
        }
    }

    local payload = {
        username = Config.BotName,
        avatar_url = 'https://i.imgur.com/your-avatar.png',
        embeds = embed
    }

    PerformHttpRequest(webhookUrl, function(err, text, headers)
        if Config.Debug then
            print('[Zav Logs] Webhook response: ' .. (text or 'No response'))
        end
    end, 'POST', json.encode(payload), {
        ['Content-Type'] = 'application/json'
    })
end

-- Log command function
function LogCommand(command, adminId, targetId, ...)
    local cmdConfig = Config.Commands[command]
    if not cmdConfig or not cmdConfig.enabled then
        return
    end

    local adminName = GetPlayerName(adminId)
    local targetName = targetId and GetPlayerName(targetId) or 'N/A'
    local args = {...}

    local fields = {
        {name = 'Admin', value = adminName, inline = true},
        {name = 'Target', value = targetName, inline = true},
        {name = 'Command', value = '/' .. command, inline = true}
    }

    -- Add command-specific fields
    if command == 'givecar' then
        fields[#fields + 1] = {name = 'Vehicle', value = args[1] or 'Unknown', inline = true}
    elseif command == 'giveitem' then
        fields[#fields + 1] = {name = 'Item', value = args[1] or 'Unknown', inline = true}
        fields[#fields + 1] = {name = 'Amount', value = tostring(args[2] or 1), inline = true}
    elseif command == 'givemoney' then
        fields[#fields + 1] = {name = 'Amount', value = '$' .. tostring(args[1] or 0), inline = true}
        fields[#fields + 1] = {name = 'Type', value = args[2] or 'cash', inline = true}
    elseif command == 'setjob' then
        fields[#fields + 1] = {name = 'Job', value = args[1] or 'Unknown', inline = true}
        fields[#fields + 1] = {name = 'Grade', value = tostring(args[2] or 0), inline = true}
    elseif command == 'kick' or command == 'ban' then
        fields[#fields + 1] = {name = 'Reason', value = args[1] or 'No reason', inline = false}
    end

    SendDiscordLog(cmdConfig.webhook, cmdConfig.title, cmdConfig.description, fields, cmdConfig.color)
end

-- Log event function
function LogEvent(eventName, ...)
    local eventConfig = Config.Events[eventName]
    if not eventConfig or not eventConfig.enabled then
        return
    end

    local args = {...}
    local fields = {}

    if eventName == 'playerConnecting' then
        fields = {
            {name = 'Player', value = args[1] or 'Unknown', inline = true},
            {name = 'ID', value = tostring(args[2] or 'Unknown'), inline = true},
            {name = 'Steam', value = args[3] or 'Unknown', inline = false}
        }
    elseif eventName == 'playerDropped' then
        fields = {
            {name = 'Player', value = args[1] or 'Unknown', inline = true},
            {name = 'ID', value = tostring(args[2] or 'Unknown'), inline = true},
            {name = 'Reason', value = args[3] or 'Unknown', inline = false}
        }
    elseif eventName == 'chatMessage' then
        fields = {
            {name = 'Player', value = args[1] or 'Unknown', inline = true},
            {name = 'Message', value = args[2] or 'Empty', inline = false}
        }
    end

    SendDiscordLog(eventConfig.webhook, eventConfig.title, eventConfig.description, fields, eventConfig.color)
end

-- Event handlers
AddEventHandler('playerConnecting', function(name, setKickReason, deferrals)
    local playerId = source
    local identifiers = GetPlayerIdentifiers(playerId)
    LogEvent('playerConnecting', name, playerId, identifiers.steam)
end)

AddEventHandler('playerDropped', function(reason)
    local playerId = source
    local playerName = GetPlayerName(playerId)
    LogEvent('playerDropped', playerName, playerId, reason)
end)

AddEventHandler('chatMessage', function(source, name, message)
    LogEvent('chatMessage', name, message)
end)

-- UI Command
RegisterCommand(Config.UI.command, function(source, args)
    if not IsPlayerAdmin(source) then
        return
    end
    
    TriggerClientEvent('zavlogs:openUI', source)
end, false)

-- Server events
RegisterNetEvent('zavlogs:executeCommand')
AddEventHandler('zavlogs:executeCommand', function(command, args)
    local source = source
    
    if not IsPlayerAdmin(source) then
        return
    end
    
    -- Execute command and log it
    LogCommand(command, source, args.targetId, table.unpack(args.params or {}))
end)

-- Exports
exports('LogCommand', LogCommand)
exports('LogEvent', LogEvent)
exports('SendDiscordLog', SendDiscordLog)

print('^2[Zav Logs] ^7Server script loaded successfully for ^3' .. Config.Framework .. '^7 framework')`;
  };

  const generateClientScript = () => {
    return `-- Zav Logs Client Script
${selectedFramework === 'esx' ? "ESX = exports['es_extended']:getSharedObject()" : ''}
${selectedFramework === 'qbcore' ? "local QBCore = exports['qb-core']:GetCoreObject()" : ''}

local isUIOpen = false

-- UI Functions
local function toggleUI()
    isUIOpen = not isUIOpen
    SetNuiFocus(isUIOpen, isUIOpen)
    SendNUIMessage({
        type = 'setVisible',
        visible = isUIOpen
    })
end

-- Events
RegisterNetEvent('zavlogs:openUI')
AddEventHandler('zavlogs:openUI', function()
    toggleUI()
end)

-- Keybind
RegisterKeyMapping(Config.UI.command, 'Open Zav Logs UI', 'keyboard', Config.UI.keybind)

-- NUI Callbacks
RegisterNUICallback('close', function(data, cb)
    toggleUI()
    cb('ok')
end)

print('^2[Zav Logs] ^7Client script loaded successfully')`;
  };

  const generateUIHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zav Logs</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="container" class="hidden">
        <div class="header">
            <h1>Zav Logs System</h1>
            <button id="close-btn">&times;</button>
        </div>
        <div class="content">
            <div class="tabs">
                <button class="tab-btn active" data-tab="overview">Overview</button>
                <button class="tab-btn" data-tab="logs">Recent Logs</button>
                <button class="tab-btn" data-tab="settings">Settings</button>
            </div>
            <div class="tab-content">
                <div id="overview" class="tab-panel active">
                    <h2>System Overview</h2>
                    <div class="stats">
                        <div class="stat-card">
                            <h3>Total Logs</h3>
                            <span class="stat-number">1,234</span>
                        </div>
                        <div class="stat-card">
                            <h3>Today</h3>
                            <span class="stat-number">56</span>
                        </div>
                        <div class="stat-card">
                            <h3>Active Webhooks</h3>
                            <span class="stat-number">8</span>
                        </div>
                    </div>
                </div>
                <div id="logs" class="tab-panel">
                    <h2>Recent Logs</h2>
                    <div class="log-list">
                        <div class="log-item">
                            <span class="log-time">10:30 AM</span>
                            <span class="log-type admin">ADMIN</span>
                            <span class="log-message">Player kicked by admin</span>
                        </div>
                    </div>
                </div>
                <div id="settings" class="tab-panel">
                    <h2>Settings</h2>
                    <div class="settings-section">
                        <label>
                            <input type="checkbox" checked> Enable Discord Webhooks
                        </label>
                        <label>
                            <input type="checkbox" checked> Log Admin Commands
                        </label>
                        <label>
                            <input type="checkbox"> Log Chat Messages
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`;
  };

  const generateUICSS = () => {
    return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: transparent;
    color: white;
}

#container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 800px;
    height: 70%;
    background: rgba(0, 0, 0, 0.9);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
}

.hidden {
    display: none !important;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header h1 {
    color: #a855f7;
    font-size: 24px;
}

#close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 5px;
    transition: background 0.3s;
}

#close-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.content {
    flex: 1;
    padding: 20px;
    overflow: hidden;
}

.tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.tab-btn {
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
}

.tab-btn.active,
.tab-btn:hover {
    background: #a855f7;
}

.tab-panel {
    display: none;
    height: calc(100% - 60px);
    overflow-y: auto;
}

.tab-panel.active {
    display: block;
}

.stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.stat-card {
    background: rgba(255, 255, 255, 0.05);
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-card h3 {
    font-size: 14px;
    color: #ccc;
    margin-bottom: 10px;
}

.stat-number {
    font-size: 32px;
    font-weight: bold;
    color: #a855f7;
}

.log-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.log-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.log-time {
    color: #888;
    font-size: 12px;
    min-width: 60px;
}

.log-type {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: bold;
    min-width: 60px;
    text-align: center;
}

.log-type.admin {
    background: #ef4444;
    color: white;
}

.log-message {
    flex: 1;
    font-size: 14px;
}

.settings-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.settings-section label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 10px;
    border-radius: 5px;
    transition: background 0.3s;
}

.settings-section label:hover {
    background: rgba(255, 255, 255, 0.05);
}

.settings-section input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #a855f7;
}`;
  };

  const generateUIJS = () => {
    return `// Zav Logs UI Script
let isVisible = false;

// Tab functionality
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active tab panel
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
    });
});

// Close button
document.getElementById('close-btn').addEventListener('click', () => {
    hideUI();
});

// NUI Message handler
window.addEventListener('message', (event) => {
    const data = event.data;
    
    if (data.type === 'setVisible') {
        if (data.visible) {
            showUI();
        } else {
            hideUI();
        }
    }
});

// ESC key handler
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isVisible) {
        hideUI();
    }
});

function showUI() {
    isVisible = true;
    document.getElementById('container').classList.remove('hidden');
}

function hideUI() {
    isVisible = false;
    document.getElementById('container').classList.add('hidden');
    
    // Send close message to client - FiveM compatible
    if (typeof GetParentResourceName !== 'undefined') {
        fetch(\`https://\${GetParentResourceName()}/close\`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
    }
}

// FiveM resource name function
function GetParentResourceName() {
    return 'zav-logs';
}`;
  };

  const generateREADME = () => {
    return `# Zav Logs System

Advanced logging system for FiveM servers with Discord webhook integration and admin UI.

## Features

- 🔗 Discord webhook integration
- 👮 Admin command logging
- 🎮 Player event tracking
- 🖥️ In-game admin UI
- ⚙️ Configurable settings
- 🔧 Framework support (ESX, QB-Core, Standalone)

## Installation

1. Download and extract to your resources folder
2. Add \`ensure zav-logs\` to your server.cfg
3. Configure webhooks in config.lua
4. Restart your server

## Configuration

Edit \`config.lua\` to customize:
- Discord webhook URLs
- Commands to log
- Events to track
- UI settings
- Permissions

## Commands

- \`/zavlogs\` - Open admin UI (admins only)
- Default keybind: \`F9\`

## Framework: ${selectedFramework.toUpperCase()}

This resource is configured for ${frameworkOptions.find(f => f.value === selectedFramework)?.label}.

## Support

For support and updates, visit our Discord server.

---
Generated by Zav Logs Generator`;
  };

  const downloadScript = (script: GeneratedScript) => {
    const blob = new Blob([script.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = script.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Plik pobrany!",
      description: `${script.filename} został pobrany`
    });
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Skopiowano!",
        description: "Kod został skopiowany do schowka"
      });
    } catch (err) {
      toast({
        title: "Błąd",
        description: "Nie udało się skopiować kodu",
        variant: "destructive"
      });
    }
  };

  const getFileIcon = (type: GeneratedScript['type']) => {
    switch (type) {
      case 'server': return <Server className="w-4 h-4" />;
      case 'client': return <Monitor className="w-4 h-4" />;
      case 'config': return <Settings className="w-4 h-4" />;
      case 'manifest': return <Package className="w-4 h-4" />;
      case 'html':
      case 'css':
      case 'js':
        return <Code className="w-4 h-4" />;
      default: return <FileCode className="w-4 h-4" />;
    }
  };

  const selectedScriptContent = generatedScripts.find(s => s.filename === selectedScript);

  return (
    <div className="space-y-6">
      <Card className="card-dark">
        <CardHeader className="card-header-dark">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            Generator Zasobów FiveM
          </CardTitle>
          <CardDescription>
            Generuj kompletne zasoby FiveM z systemem logowania, webhookami Discord i interfejsem admina
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Framework</label>
            <Select value={selectedFramework} onValueChange={setSelectedFramework}>
              <SelectTrigger className="input-dark">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dropdown-dark">
                {frameworkOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="dropdown-item-dark">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={generateScripts} 
            className="w-full btn-primary"
            size="lg"
          >
            <Zap className="w-4 h-4 mr-2" />
            Generuj Zasób FiveM
          </Button>
        </CardContent>
      </Card>

      {generatedScripts.length > 0 && (
        <Card className="card-dark">
          <CardHeader className="card-header-dark">
            <CardTitle>Wygenerowane Pliki</CardTitle>
            <CardDescription>
              {generatedScripts.length} plików gotowych do pobrania
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="files" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="files" className="tab-trigger">Lista Plików</TabsTrigger>
                <TabsTrigger value="preview" className="tab-trigger">Podgląd</TabsTrigger>
              </TabsList>
              
              <TabsContent value="files" className="mt-4">
                <div className="grid gap-2">
                  {generatedScripts.map((script, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-3">
                        {getFileIcon(script.type)}
                        <span className="text-sm font-medium text-gray-300">{script.filename}</span>
                        <Badge variant="outline" className="badge-dark text-xs">
                          {script.type}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(script.content)}
                          className="btn-outline"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => downloadScript(script)}
                          className="btn-secondary"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="mt-4">
                <div className="space-y-4">
                  <Select value={selectedScript} onValueChange={setSelectedScript}>
                    <SelectTrigger className="input-dark">
                      <SelectValue placeholder="Wybierz plik do podglądu" />
                    </SelectTrigger>
                    <SelectContent className="dropdown-dark">
                      {generatedScripts.map(script => (
                        <SelectItem key={script.filename} value={script.filename} className="dropdown-item-dark">
                          {script.filename}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedScriptContent && (
                    <div className="relative">
                      <Textarea
                        value={selectedScriptContent.content}
                        readOnly
                        className="min-h-[400px] font-mono text-sm input-dark"
                      />
                      <Button
                        size="sm"
                        className="absolute top-2 right-2 btn-outline"
                        onClick={() => copyToClipboard(selectedScriptContent.content)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
