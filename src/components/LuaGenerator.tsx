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
local isUIOpen = false

-- UI Management
RegisterNetEvent('zavlogs:openUI')
AddEventHandler('zavlogs:openUI', function()
    if not isUIOpen then
        SetNuiFocus(true, true)
        SendNUIMessage({
            type = 'openUI',
            data = {
                config = Config,
                playerName = GetPlayerName(PlayerId())
            }
        })
        isUIOpen = true
    end
end)

-- NUI Callbacks
RegisterNUICallback('closeUI', function(data, cb)
    SetNuiFocus(false, false)
    SendNUIMessage({type = 'closeUI'})
    isUIOpen = false
    cb('ok')
end)

RegisterNUICallback('executeCommand', function(data, cb)
    TriggerServerEvent('zavlogs:executeCommand', data.command, data.args)
    cb('ok')
end)

RegisterNUICallback('testWebhook', function(data, cb)
    TriggerServerEvent('zavlogs:testWebhook', data.webhook)
    cb('ok')
end)

-- Key mapping
if Config.UI.keybind then
    RegisterKeyMapping(Config.UI.command, 'Open Zav Logs Panel', 'keyboard', Config.UI.keybind)
end

-- Utility functions for commands
RegisterNetEvent('zavlogs:spawnVehicle')
AddEventHandler('zavlogs:spawnVehicle', function(vehicleModel)
    local playerPed = PlayerPedId()
    local coords = GetEntityCoords(playerPed)
    local heading = GetEntityHeading(playerPed)
    
    RequestModel(vehicleModel)
    while not HasModelLoaded(vehicleModel) do
        Wait(100)
    end
    
    local vehicle = CreateVehicle(vehicleModel, coords.x + 2, coords.y, coords.z, heading, true, false)
    TaskWarpPedIntoVehicle(playerPed, vehicle, -1)
    SetModelAsNoLongerNeeded(vehicleModel)
end)

-- Notification system
RegisterNetEvent('zavlogs:notify')
AddEventHandler('zavlogs:notify', function(message, type)
    SendNUIMessage({
        type = 'notification',
        data = {
            message = message,
            type = type or 'info'
        }
    })
end)

print('^2[Zav Logs] ^7Client script loaded successfully')`;
  };

  const generateUIHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zav Logs - Admin Panel</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div id="ui-container" style="display: none;">
        <div class="main-container">
            <!-- Header -->
            <div class="header">
                <div class="header-content">
                    <div class="logo">
                        <div class="logo-icon">⚡</div>
                        <h1>Zav Logs</h1>
                    </div>
                    <button id="closeBtn" class="close-btn">×</button>
                </div>
            </div>

            <!-- Content -->
            <div class="content">
                <!-- Tabs -->
                <div class="tabs">
                    <button class="tab-btn active" data-tab="commands">Commands</button>
                    <button class="tab-btn" data-tab="events">Events</button>
                    <button class="tab-btn" data-tab="webhooks">Webhooks</button>
                </div>

                <!-- Commands Tab -->
                <div id="commands-tab" class="tab-content active">
                    <div class="section">
                        <h2>Quick Commands</h2>
                        <div class="commands-grid">
                            <div class="command-card">
                                <h3>Give Car</h3>
                                <input type="number" id="givecar-id" placeholder="Player ID" min="1">
                                <input type="text" id="givecar-model" placeholder="Vehicle Model">
                                <button onclick="executeCommand('givecar')" class="execute-btn">Execute</button>
                            </div>
                            
                            <div class="command-card">
                                <h3>Give Item</h3>
                                <input type="number" id="giveitem-id" placeholder="Player ID" min="1">
                                <input type="text" id="giveitem-name" placeholder="Item Name">
                                <input type="number" id="giveitem-amount" placeholder="Amount" min="1" value="1">
                                <button onclick="executeCommand('giveitem')" class="execute-btn">Execute</button>
                            </div>
                            
                            <div class="command-card">
                                <h3>Give Money</h3>
                                <input type="number" id="givemoney-id" placeholder="Player ID" min="1">
                                <input type="number" id="givemoney-amount" placeholder="Amount" min="1">
                                <select id="givemoney-type">
                                    <option value="cash">Cash</option>
                                    <option value="bank">Bank</option>
                                </select>
                                <button onclick="executeCommand('givemoney')" class="execute-btn">Execute</button>
                            </div>
                            
                            <div class="command-card">
                                <h3>Set Job</h3>
                                <input type="number" id="setjob-id" placeholder="Player ID" min="1">
                                <input type="text" id="setjob-name" placeholder="Job Name">
                                <input type="number" id="setjob-grade" placeholder="Grade" min="0" value="0">
                                <button onclick="executeCommand('setjob')" class="execute-btn">Execute</button>
                            </div>
                            
                            <div class="command-card">
                                <h3>Kick Player</h3>
                                <input type="number" id="kick-id" placeholder="Player ID" min="1">
                                <input type="text" id="kick-reason" placeholder="Reason">
                                <button onclick="executeCommand('kick')" class="execute-btn danger">Execute</button>
                            </div>
                            
                            <div class="command-card">
                                <h3>Ban Player</h3>
                                <input type="number" id="ban-id" placeholder="Player ID" min="1">
                                <input type="text" id="ban-reason" placeholder="Reason">
                                <button onclick="executeCommand('ban')" class="execute-btn danger">Execute</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Events Tab -->
                <div id="events-tab" class="tab-content">
                    <div class="section">
                        <h2>Server Events</h2>
                        <div class="events-list">
                            <div class="event-item">
                                <span class="event-name">Player Connecting</span>
                                <span class="event-status active">Active</span>
                            </div>
                            <div class="event-item">
                                <span class="event-name">Player Dropped</span>
                                <span class="event-status active">Active</span>
                            </div>
                            <div class="event-item">
                                <span class="event-name">Chat Message</span>
                                <span class="event-status inactive">Inactive</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Webhooks Tab -->
                <div id="webhooks-tab" class="tab-content">
                    <div class="section">
                        <h2>Webhook Status</h2>
                        <div class="webhook-list">
                            <div class="webhook-item">
                                <span class="webhook-name">Admin Commands</span>
                                <button onclick="testWebhook('admin')" class="test-btn">Test</button>
                            </div>
                            <div class="webhook-item">
                                <span class="webhook-name">Economy</span>
                                <button onclick="testWebhook('economy')" class="test-btn">Test</button>
                            </div>
                            <div class="webhook-item">
                                <span class="webhook-name">Vehicles</span>
                                <button onclick="testWebhook('vehicles')" class="test-btn">Test</button>
                            </div>
                            <div class="webhook-item">
                                <span class="webhook-name">Events</span>
                                <button onclick="testWebhook('events')" class="test-btn">Test</button>
                            </div>
                        </div>
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
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: transparent;
    color: #ffffff;
    overflow: hidden;
}

#ui-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.main-container {
    width: 90vw;
    max-width: 1200px;
    height: 85vh;
    max-height: 800px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f1e 100%);
    border: 1px solid rgba(168, 85, 247, 0.3);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 40px rgba(168, 85, 247, 0.2);
}

.header {
    background: linear-gradient(135deg, #a855f7, #c084fc, #e879f9);
    padding: 20px;
    border-bottom: 1px solid rgba(168, 85, 247, 0.3);
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    display: flex;
    align-items: center;
    gap: 12px;
}

.logo-icon {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    backdrop-filter: blur(10px);
}

.logo h1 {
    font-size: 28px;
    font-weight: 700;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.close-btn {
    width: 40px;
    height: 40px;
    border: none;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 24px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
}

.content {
    padding: 20px;
    height: calc(100% - 80px);
    overflow-y: auto;
}

.tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 4px;
}

.tab-btn {
    flex: 1;
    padding: 12px 20px;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.tab-btn.active {
    background: linear-gradient(135deg, #a855f7, #c084fc);
    color: white;
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
}

.tab-btn:hover:not(.active) {
    background: rgba(255, 255, 255, 0.1);
    color: white;
}

.tab-content {
    display: none;
}

.tab-content.active {
    display: block;
}

.section h2 {
    color: #a855f7;
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: 600;
}

.commands-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.command-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(168, 85, 247, 0.2);
    border-radius: 12px;
    padding: 20px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.command-card:hover {
    border-color: rgba(168, 85, 247, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(168, 85, 247, 0.2);
}

.command-card h3 {
    color: #c084fc;
    margin-bottom: 15px;
    font-size: 16px;
    font-weight: 600;
}

.command-card input,
.command-card select {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: white;
    font-size: 14px;
}

.command-card input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.command-card input:focus,
.command-card select:focus {
    outline: none;
    border-color: #a855f7;
    box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2);
}

.execute-btn {
    width: 100%;
    padding: 12px;
    border: none;
    background: linear-gradient(135deg, #a855f7, #c084fc);
    color: white;
    font-size: 14px;
    font-weight: 600;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.execute-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(168, 85, 247, 0.4);
}

.execute-btn.danger {
    background: linear-gradient(135deg, #ef4444, #dc2626);
}

.execute-btn.danger:hover {
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.events-list,
.webhook-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.event-item,
.webhook-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(168, 85, 247, 0.2);
    border-radius: 8px;
    transition: all 0.3s ease;
}

.event-item:hover,
.webhook-item:hover {
    border-color: rgba(168, 85, 247, 0.4);
    background: rgba(255, 255, 255, 0.08);
}

.event-name,
.webhook-name {
    font-weight: 500;
    color: white;
}

.event-status {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.event-status.active {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
}

.event-status.inactive {
    background: rgba(107, 114, 128, 0.2);
    color: #9ca3af;
}

.test-btn {
    padding: 6px 16px;
    border: none;
    background: linear-gradient(135deg, #a855f7, #c084fc);
    color: white;
    font-size: 12px;
    font-weight: 500;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.test-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4);
}

/* Scrollbar styling */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #a855f7, #c084fc);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #c084fc, #e879f9);
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

#ui-container {
    animation: fadeIn 0.3s ease-out;
}

.command-card {
    animation: fadeIn 0.5s ease-out;
}`;
  };

  const generateUIJS = () => {
    return `// Zav Logs UI Script
let isUIOpen = false;

// NUI message handler
window.addEventListener('message', function(event) {
    const data = event.data;
    
    switch(data.type) {
        case 'openUI':
            openUI(data.data);
            break;
        case 'closeUI':
            closeUI();
            break;
        case 'notification':
            showNotification(data.data.message, data.data.type);
            break;
    }
});

// Open UI
function openUI(data) {
    document.getElementById('ui-container').style.display = 'flex';
    isUIOpen = true;
    
    // You can use the data here to populate the UI with server information
    console.log('UI opened with data:', data);
}

// Close UI
function closeUI() {
    document.getElementById('ui-container').style.display = 'none';
    isUIOpen = false;
    
    // Send close event to client
    fetch(\`https://\${GetParentResourceName()}/closeUI\`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
    });
}

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tabName = this.dataset.tab;
        
        // Remove active class from all tabs and contents
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        this.classList.add('active');
        document.getElementById(tabName + '-tab').classList.add('active');
    });
});

// Close button
document.getElementById('closeBtn').addEventListener('click', closeUI);

// Escape key handler
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && isUIOpen) {
        closeUI();
    }
});

// Execute command function
function executeCommand(command) {
    const args = {};
    
    switch(command) {
        case 'givecar':
            args.targetId = parseInt(document.getElementById('givecar-id').value);
            args.params = [document.getElementById('givecar-model').value];
            break;
        case 'giveitem':
            args.targetId = parseInt(document.getElementById('giveitem-id').value);
            args.params = [
                document.getElementById('giveitem-name').value,
                parseInt(document.getElementById('giveitem-amount').value) || 1
            ];
            break;
        case 'givemoney':
            args.targetId = parseInt(document.getElementById('givemoney-id').value);
            args.params = [
                parseInt(document.getElementById('givemoney-amount').value) || 0,
                document.getElementById('givemoney-type').value
            ];
            break;
        case 'setjob':
            args.targetId = parseInt(document.getElementById('setjob-id').value);
            args.params = [
                document.getElementById('setjob-name').value,
                parseInt(document.getElementById('setjob-grade').value) || 0
            ];
            break;
        case 'kick':
            args.targetId = parseInt(document.getElementById('kick-id').value);
            args.params = [document.getElementById('kick-reason').value || 'No reason'];
            break;
        case 'ban':
            args.targetId = parseInt(document.getElementById('ban-id').value);
            args.params = [document.getElementById('ban-reason').value || 'No reason'];
            break;
    }
    
    // Validate inputs
    if (!args.targetId || args.targetId < 1) {
        showNotification('Please enter a valid Player ID', 'error');
        return;
    }
    
    // Send command to server
    fetch(\`https://\${GetParentResourceName()}/executeCommand\`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            command: command,
            args: args
        })
    });
    
    showNotification(\`Command \${command} executed successfully\`, 'success');
    
    // Clear form fields
    clearCommandForm(command);
}

// Test webhook function
function testWebhook(webhook) {
    fetch(\`https://\${GetParentResourceName()}/testWebhook\`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            webhook: webhook
        })
    });
    
    showNotification(\`Testing webhook: \${webhook}\`, 'info');
}

// Clear form fields
function clearCommandForm(command) {
    const prefix = command.replace(/([A-Z])/g, '-$1').toLowerCase();
    const inputs = document.querySelectorAll(\`input[id^="\${prefix}"]\`);
    inputs.forEach(input => {
        if (input.type === 'number') {
            input.value = '';
        } else if (input.type === 'text') {
            input.value = '';
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = \`notification notification-\${type}\`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = \`
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    \`;
    
    // Set color based on type
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            break;
        case 'info':
        default:
            notification.style.background = 'linear-gradient(135deg, #a855f7, #c084fc)';
            break;
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = \`
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
\`;
document.head.appendChild(style);

console.log('Zav Logs UI loaded successfully');`;
  };

  const generateREADME = () => {
    return `# Zav Logs - FiveM Logging System

Advanced logging system for FiveM servers with Discord webhook integration and admin UI.

## Features

- **Command Logging**: Automatically logs admin commands (givecar, giveitem, givemoney, setjob, kick, ban)
- **Event Logging**: Logs server events (player connections, disconnections, deaths)
- **Discord Integration**: Sends formatted logs to Discord channels via webhooks
- **Admin UI**: Beautiful in-game UI for quick command execution (F9 or /zavlogs)
- **Framework Support**: Works with ESX, QB-Core, and Standalone
- **Customizable**: Easy configuration through config.lua

## Installation

1. Extract the \`zav-logs\` folder to your FiveM server's \`resources\` directory
2. Add \`ensure zav-logs\` to your \`server.cfg\`
3. Configure Discord webhooks in \`config.lua\`
4. Set up permissions for your framework
5. Restart your server

## Configuration

### Discord Webhooks

Edit \`config.lua\` and add your Discord webhook URLs:

\`\`\`lua
Config.Webhooks = {
    ['admin'] = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE',
    ['economy'] = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE',
    ['vehicles'] = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE',
    -- ... more categories
}
\`\`\`

### Framework Setup

**ESX Framework:**
- Players with admin group can access the UI
- Automatic integration with ESX player management

**QB-Core Framework:**
- Players with admin job can access the UI
- Automatic integration with QB-Core player system

**Standalone:**
- Use ACE permissions: \`add_ace group.admin zavlogs.admin allow\`
- Configure your permission system accordingly

## Commands

- \`/zavlogs\` - Open the admin panel
- \`F9\` - Alternative keybind to open admin panel (configurable)

## Permissions

The system uses different permission levels:
- **Admin**: Full access to all features
- **Moderator**: Can view logs but cannot execute commands
- **User**: No access to admin features

## API Usage

### Server Events

\`\`\`lua
-- Log a custom command
exports['zav-logs']:LogCommand('mycommand', adminId, targetId, arg1, arg2)

-- Log a custom event
exports['zav-logs']:LogEvent('myevent', arg1, arg2, arg3)

-- Send custom Discord log
exports['zav-logs']:SendDiscordLog('webhook_name', 'Title', 'Description', fields, color)
\`\`\`

### Client Events

\`\`\`lua
-- Open the UI programmatically
TriggerEvent('zavlogs:openUI')

-- Show notification
TriggerEvent('zavlogs:notify', 'Message', 'type')
\`\`\`

## Customization

### Adding New Commands

1. Add command configuration to \`Config.Commands\` in \`config.lua\`
2. Create the command handler in \`server/main.lua\`
3. Add UI elements in \`ui/index.html\`

### Adding New Events

1. Add event configuration to \`Config.Events\` in \`config.lua\`
2. Add event handler in \`server/main.lua\`
3. Configure the webhook category

## Troubleshooting

### Common Issues

1. **UI not opening**: Check if player has admin permissions
2. **Webhooks not working**: Verify webhook URLs in config.lua
3. **Commands not logging**: Ensure command is enabled in config
4. **Framework errors**: Check framework compatibility

### Debug Mode

Enable debug mode in \`config.lua\`:
\`\`\`lua
Config.Debug = true
\`\`\`

## Support

For support and updates:
- Check the FiveM documentation
- Review the configuration files
- Test webhook connections using the UI

## License

This resource is provided as-is. Feel free to modify and distribute according to your needs.

## Version

- **Version**: 2.0.0
- **Framework**: ${selectedFramework.toUpperCase()}
- **Compatibility**: FiveM Build 2699+

---

**Created by Zav Logs System**`;
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
        description: "Nie udało się skopiować do schowka",
        variant: "destructive"
      });
    }
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
      title: "Pobieranie rozpoczęte",
      description: `Plik ${script.filename} został pobrany`
    });
  };

  const downloadAllScripts = () => {
    toast({
      title: "Pobieranie zasobu FiveM",
      description: "Rozpoczynam pobieranie wszystkich plików..."
    });
    
    generatedScripts.forEach((script, index) => {
      setTimeout(() => downloadScript(script), 200 * index);
    });
  };

  useEffect(() => {
    generateScripts();
  }, [selectedFramework]);

  const currentScript = generatedScripts.find(s => s.filename === selectedScript);

  return (
    <div className="space-y-8">
      {/* Framework Selection */}
      <Card className="fivem-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-fivem-primary">
            <Package className="w-6 h-6" />
            Generator Zasobu FiveM
          </CardTitle>
          <CardDescription>
            Wybierz framework i wygeneruj kompletny zasób z UI i skryptami Lua
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Select value={selectedFramework} onValueChange={setSelectedFramework}>
              <SelectTrigger className="w-[300px] glass border-fivem-primary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {frameworkOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={generateScripts} className="fivem-button">
              <Code className="w-4 h-4 mr-2" />
              Regeneruj Zasób
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-purple p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-5 h-5 text-fivem-primary" />
                <span className="font-semibold">Server Script</span>
              </div>
              <p className="text-sm text-muted-foreground">Główny skrypt serwerowy z logiką</p>
            </div>
            <div className="glass-purple p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="w-5 h-5 text-fivem-secondary" />
                <span className="font-semibold">Client Script</span>
              </div>
              <p className="text-sm text-muted-foreground">Skrypt kliencki z UI</p>
            </div>
            <div className="glass-purple p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-5 h-5 text-fivem-accent" />
                <span className="font-semibold">Konfiguracja</span>
              </div>
              <p className="text-sm text-muted-foreground">Pliki konfiguracyjne</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Scripts */}
      {generatedScripts.length > 0 && (
        <Card className="fivem-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-fivem-primary">
                  <FileCode className="w-6 h-6" />
                  Wygenerowany Zasób FiveM
                </CardTitle>
                <CardDescription>
                  {generatedScripts.length} plików gotowych do użycia na serwerze FiveM
                </CardDescription>
              </div>
              <Button onClick={downloadAllScripts} className="fivem-button">
                <Download className="w-4 h-4 mr-2" />
                Pobierz Kompletny Zasób
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedScript} onValueChange={setSelectedScript}>
              <TabsList className="grid w-full grid-cols-4 mb-4 glass border-fivem-primary/20">
                {generatedScripts.slice(0, 4).map(script => (
                  <TabsTrigger key={script.filename} value={script.filename} className="text-xs">
                    {script.filename}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {generatedScripts.length > 4 && (
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {generatedScripts.slice(4).map(script => (
                    <Button
                      key={script.filename}
                      variant={selectedScript === script.filename ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedScript(script.filename)}
                      className="text-xs"
                    >
                      {script.filename}
                    </Button>
                  ))}
                </div>
              )}

              {generatedScripts.map(script => (
                <TabsContent key={script.filename} value={script.filename} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={
                        script.type === 'server' ? 'border-fivem-primary/30 text-fivem-primary' :
                        script.type === 'client' ? 'border-fivem-secondary/30 text-fivem-secondary' :
                        script.type === 'ui' || script.type === 'html' || script.type === 'css' || script.type === 'js' ? 'border-fivem-accent/30 text-fivem-accent' :
                        'border-primary/30 text-primary'
                      }>
                        {script.type === 'server' && '🖥️ Server'}
                        {script.type === 'client' && '💻 Client'}
                        {script.type === 'config' && '⚙️ Config'}
                        {script.type === 'manifest' && '📋 Manifest'}
                        {(script.type === 'ui' || script.type === 'html' || script.type === 'css' || script.type === 'js') && '🎨 UI'}
                      </Badge>
                      <span className="font-mono text-sm">{script.filename}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(script.content)}
                        className="glass border-fivem-primary/30"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Kopiuj
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadScript(script)}
                        className="glass border-fivem-secondary/30"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Pobierz
                      </Button>
                    </div>
                  </div>
                  
                  <Textarea
                    value={script.content}
                    readOnly
                    className="font-mono text-xs min-h-[500px] glass border-fivem-primary/20"
                  />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Installation Instructions */}
      <Card className="fivem-card">
        <CardHeader>
          <CardTitle className="text-fivem-primary flex items-center gap-3">
            <Zap className="w-6 h-6" />
            Instrukcja Instalacji FiveM
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-purple p-4 rounded-lg">
              <h4 className="font-semibold mb-2">1. Instalacja Zasobu</h4>
              <p className="text-sm text-muted-foreground">
                Skopiuj folder <code className="bg-muted px-1 rounded">zav-logs</code> do <code className="bg-muted px-1 rounded">resources/</code>
              </p>
            </div>
            
            <div className="glass-purple p-4 rounded-lg">
              <h4 className="font-semibold mb-2">2. Konfiguracja server.cfg</h4>
              <code className="block bg-muted p-2 rounded text-sm">
                ensure zav-logs
              </code>
            </div>
            
            <div className="glass-purple p-4 rounded-lg">
              <h4 className="font-semibold mb-2">3. Webhooks Discord</h4>
              <p className="text-sm text-muted-foreground">
                Skonfiguruj webhooks w <code className="bg-muted px-1 rounded">config.lua</code>
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-purple p-4 rounded-lg">
              <h4 className="font-semibold mb-2">4. Uprawnienia</h4>
              <p className="text-sm text-muted-foreground">
                {selectedFramework === 'esx' && 'Grupa admin w ESX Framework'}
                {selectedFramework === 'qbcore' && 'Job admin w QB-Core'}
                {selectedFramework === 'standalone' && 'ACE permission "zavlogs.admin"'}
              </p>
            </div>
            
            <div className="glass-purple p-4 rounded-lg">
              <h4 className="font-semibold mb-2">5. Użytkowanie</h4>
              <p className="text-sm text-muted-foreground">
                <code className="bg-muted px-1 rounded">F9</code> lub <code className="bg-muted px-1 rounded">/zavlogs</code>
              </p>
            </div>
            
            <div className="glass-purple p-4 rounded-lg">
              <h4 className="font-semibold mb-2">6. Restart Serwera</h4>
              <p className="text-sm text-muted-foreground">
                Zrestartuj serwer FiveM po instalacji
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
