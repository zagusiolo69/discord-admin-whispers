
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Copy, Code, FileCode, Zap, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GeneratedScript {
  filename: string;
  content: string;
  type: 'client' | 'server' | 'config' | 'manifest' | 'ui';
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

    // Config file
    scripts.push({
      filename: 'config.lua',
      content: generateConfigFile(),
      type: 'config'
    });

    // Server file
    scripts.push({
      filename: 'server.lua',
      content: generateServerFile(selectedFramework),
      type: 'server'
    });

    // Client file
    scripts.push({
      filename: 'client.lua',
      content: generateClientFile(selectedFramework),
      type: 'client'
    });

    // fxmanifest.lua
    scripts.push({
      filename: 'fxmanifest.lua',
      content: generateManifest(selectedFramework),
      type: 'manifest'
    });

    // UI files
    scripts.push({
      filename: 'ui/index.html',
      content: generateUIHTML(),
      type: 'ui'
    });

    scripts.push({
      filename: 'ui/style.css',
      content: generateUICSS(),
      type: 'ui'
    });

    scripts.push({
      filename: 'ui/script.js',
      content: generateUIJS(),
      type: 'ui'
    });

    // README
    scripts.push({
      filename: 'README.md',
      content: generateREADME(),
      type: 'config'
    });

    setGeneratedScripts(scripts);
    setSelectedScript(scripts[0].filename);
    
    toast({
      title: "Zasób wygenerowany!",
      description: `Wygenerowano kompletny zasób FiveM z ${scripts.length} plikami`
    });
  };

  const generateConfigFile = () => {
    return `-- Zav Logs Configuration
Config = {}

-- Framework type
Config.Framework = "${selectedFramework}"

-- Discord Webhook URLs
Config.Webhooks = {
    ['economy'] = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE',
    ['vehicles'] = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE',
    ['items'] = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE',
    ['jobs'] = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE',
    ['moderation'] = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE',
    ['events'] = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE',
    ['general'] = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE'
}

-- Bot name (locked)
Config.BotName = "zav-logs"

-- Commands to log
Config.Commands = {
    ['givecar'] = {
        enabled = true,
        category = 'vehicles',
        title = '🚗 Spawned Vehicle',
        color = 3447003,
        format = function(admin, target, vehicle)
            return {
                {name = "Admin", value = admin or "System", inline = true},
                {name = "Target Player", value = target or "Unknown", inline = true},
                {name = "Vehicle", value = vehicle or "Unknown", inline = true}
            }
        end
    },
    ['giveitem'] = {
        enabled = true,
        category = 'items',
        title = '📦 Given Item',
        color = 15844367,
        format = function(admin, target, item, amount)
            return {
                {name = "Admin", value = admin or "System", inline = true},
                {name = "Target Player", value = target or "Unknown", inline = true},
                {name = "Item", value = item or "Unknown", inline = true},
                {name = "Amount", value = tostring(amount or 1), inline = true}
            }
        end
    },
    ['setjob'] = {
        enabled = true,
        category = 'jobs',
        title = '💼 Job Changed',
        color = 9442302,
        format = function(admin, target, job, grade)
            return {
                {name = "Admin", value = admin or "System", inline = true},
                {name = "Target Player", value = target or "Unknown", inline = true},
                {name = "Job", value = job or "Unknown", inline = true},
                {name = "Grade", value = tostring(grade or 0), inline = true}
            }
        end
    },
    ['givemoney'] = {
        enabled = true,
        category = 'economy',
        title = '💰 Money Given',
        color = 5763719,
        format = function(admin, target, amount, moneyType)
            return {
                {name = "Admin", value = admin or "System", inline = true},
                {name = "Target Player", value = target or "Unknown", inline = true},
                {name = "Amount", value = "$" .. tostring(amount or 0), inline = true},
                {name = "Type", value = moneyType or "cash", inline = true}
            }
        end
    },
    ['kick'] = {
        enabled = true,
        category = 'moderation',
        title = '👢 Player Kicked',
        color = 15158332,
        format = function(admin, target, reason)
            return {
                {name = "Admin", value = admin or "System", inline = true},
                {name = "Kicked Player", value = target or "Unknown", inline = true},
                {name = "Reason", value = reason or "No reason", inline = false}
            }
        end
    },
    ['ban'] = {
        enabled = true,
        category = 'moderation',
        title = '🔨 Player Banned',
        color = 10038562,
        format = function(admin, target, duration, reason)
            return {
                {name = "Admin", value = admin or "System", inline = true},
                {name = "Banned Player", value = target or "Unknown", inline = true},
                {name = "Duration", value = duration or "Permanent", inline = true},
                {name = "Reason", value = reason or "No reason", inline = false}
            }
        end
    }
}

-- Events to log
Config.Events = {
    ['playerConnecting'] = {
        enabled = true,
        category = 'events',
        title = '🔗 Player Connecting',
        color = 3066993,
        format = function(playerName, playerId, steamId)
            return {
                {name = "Player", value = playerName or "Unknown", inline = true},
                {name = "Server ID", value = tostring(playerId or "Unknown"), inline = true},
                {name = "Steam ID", value = steamId or "Unknown", inline = false}
            }
        end
    },
    ['playerDropped'] = {
        enabled = true,
        category = 'events',
        title = '📤 Player Disconnected',
        color = 15158332,
        format = function(playerName, playerId, reason)
            return {
                {name = "Player", value = playerName or "Unknown", inline = true},
                {name = "Server ID", value = tostring(playerId or "Unknown"), inline = true},
                {name = "Reason", value = reason or "Unknown", inline = false}
            }
        end
    },
    ['chatMessage'] = {
        enabled = false,
        category = 'events',
        title = '💬 Chat Message',
        color = 16776960,
        format = function(playerName, message)
            return {
                {name = "Player", value = playerName or "Unknown", inline = true},
                {name = "Message", value = message or "Empty", inline = false}
            }
        end
    }
}

-- UI Settings
Config.UI = {
    enabled = true,
    command = 'zavlogs',
    keybind = 'F9'
}`;
  };

  const generateServerFile = (framework: string) => {
    return `-- Zav Logs Server Script
${framework === 'esx' ? "ESX = exports['es_extended']:getSharedObject()" : ''}
${framework === 'qbcore' ? "local QBCore = exports['qb-core']:GetCoreObject()" : ''}

-- Function to send Discord webhook
function SendToDiscord(category, title, description, fields, color)
    local webhook = Config.Webhooks[category]
    if not webhook or webhook == 'https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE' then
        return
    end

    local embed = {
        {
            title = title,
            description = description,
            color = color,
            fields = fields,
            footer = {
                text = Config.BotName .. " • " .. os.date("%Y-%m-%d %H:%M:%S")
            },
            timestamp = os.date("!%Y-%m-%dT%H:%M:%SZ")
        }
    }

    local payload = {
        username = Config.BotName,
        avatar_url = "https://cdn.discordapp.com/attachments/1234567890/1234567890/logo.png",
        embeds = embed
    }

    PerformHttpRequest(webhook, function(err, text, headers) end, 'POST', json.encode(payload), {['Content-Type'] = 'application/json'})
end

-- Function to get player name safely
function GetPlayerNameSafe(playerId)
    if not playerId then return "Unknown" end
    local name = GetPlayerName(playerId)
    return name or "Unknown"
end

-- Function to get player identifiers
function GetPlayerIdentifiers(playerId)
    local identifiers = {}
    if playerId then
        local playerIdentifiers = GetPlayerIdentifiers(playerId)
        for _, identifier in pairs(playerIdentifiers) do
            if string.match(identifier, "steam:") then
                identifiers.steam = identifier
            elseif string.match(identifier, "license:") then
                identifiers.license = identifier
            end
        end
    end
    return identifiers
end

-- Log admin command
function LogAdminCommand(command, adminId, targetId, ...)
    local cmdConfig = Config.Commands[command]
    if not cmdConfig or not cmdConfig.enabled then
        return
    end

    local adminName = GetPlayerNameSafe(adminId)
    local targetName = targetId and GetPlayerNameSafe(targetId) or "N/A"
    
    local fields = {}
    if cmdConfig.format then
        fields = cmdConfig.format(adminName, targetName, ...)
    else
        fields = {
            {name = "Admin", value = adminName, inline = true},
            {name = "Command", value = "/" .. command, inline = true},
            {name = "Target", value = targetName, inline = true}
        }
    end

    SendToDiscord(
        cmdConfig.category,
        cmdConfig.title,
        "Admin command executed on the server",
        fields,
        cmdConfig.color
    )
end

-- Log event
function LogEvent(eventName, ...)
    local eventConfig = Config.Events[eventName]
    if not eventConfig or not eventConfig.enabled then
        return
    end

    local fields = {}
    if eventConfig.format then
        fields = eventConfig.format(...)
    else
        fields = {
            {name = "Event", value = eventName, inline = true},
            {name = "Data", value = table.concat({...}, ", "), inline = false}
        }
    end

    SendToDiscord(
        eventConfig.category,
        eventConfig.title,
        "Event triggered on the server",
        fields,
        eventConfig.color
    )
end

-- Event handlers
AddEventHandler('playerConnecting', function(playerName, setKickReason, deferrals)
    local playerId = source
    local identifiers = GetPlayerIdentifiers(playerId)
    
    LogEvent('playerConnecting', playerName, playerId, identifiers.steam or "Unknown")
end)

AddEventHandler('playerDropped', function(reason)
    local playerId = source
    local playerName = GetPlayerNameSafe(playerId)
    
    LogEvent('playerDropped', playerName, playerId, reason)
end)

AddEventHandler('chatMessage', function(source, name, message)
    LogEvent('chatMessage', name, message)
end)

-- Export functions
exports('LogAdminCommand', LogAdminCommand)
exports('LogEvent', LogEvent)

-- UI Command
RegisterCommand(Config.UI.command, function(source, args, rawCommand)
    local xPlayer = nil
    ${framework === 'esx' ? 'xPlayer = ESX.GetPlayerFromId(source)' : ''}
    ${framework === 'qbcore' ? 'local Player = QBCore.Functions.GetPlayer(source); if Player then xPlayer = Player.PlayerData end' : ''}
    
    -- Check if player is admin
    local isAdmin = false
    ${framework === 'esx' ? 'if xPlayer and xPlayer.getGroup() ~= "user" then isAdmin = true end' : ''}
    ${framework === 'qbcore' ? 'if xPlayer and xPlayer.job and xPlayer.job.name == "admin" then isAdmin = true end' : ''}
    ${framework === 'standalone' ? 'if IsPlayerAceAllowed(source, "zavlogs.access") then isAdmin = true end' : ''}
    
    if isAdmin then
        TriggerClientEvent('zavlogs:openUI', source)
    end
end, false)

-- Example command implementations
${generateFrameworkCommands(framework)}

print("^2[Zav Logs] ^7Loaded successfully for ^3" .. Config.Framework .. "^7 framework")`;
  };

  const generateFrameworkCommands = (framework: string) => {
    if (framework === 'esx') {
      return `
-- ESX Commands
RegisterCommand('givecar', function(source, args, rawCommand)
    local xPlayer = ESX.GetPlayerFromId(source)
    if not xPlayer or xPlayer.getGroup() == 'user' then
        return
    end

    local targetId = tonumber(args[1])
    local vehicle = args[2]
    
    if not targetId or not vehicle then
        xPlayer.showNotification('Usage: /givecar [id] [vehicle]')
        return
    end

    local xTarget = ESX.GetPlayerFromId(targetId)
    if not xTarget then
        xPlayer.showNotification('Player not found')
        return
    end

    TriggerClientEvent('zavlogs:spawnVehicle', targetId, vehicle)
    LogAdminCommand('givecar', source, targetId, vehicle)
    xPlayer.showNotification('Vehicle spawned for ' .. xTarget.getName())
end, false)

RegisterCommand('givemoney', function(source, args, rawCommand)
    local xPlayer = ESX.GetPlayerFromId(source)
    if not xPlayer or xPlayer.getGroup() == 'user' then
        return
    end

    local targetId = tonumber(args[1])
    local amount = tonumber(args[2])
    local moneyType = args[3] or 'money'
    
    if not targetId or not amount then
        xPlayer.showNotification('Usage: /givemoney [id] [amount] [type]')
        return
    end

    local xTarget = ESX.GetPlayerFromId(targetId)
    if not xTarget then
        xPlayer.showNotification('Player not found')
        return
    end

    xTarget.addMoney(moneyType, amount)
    LogAdminCommand('givemoney', source, targetId, amount, moneyType)
    xPlayer.showNotification('Money given to ' .. xTarget.getName())
end, false)`;
    } else if (framework === 'qbcore') {
      return `
-- QB-Core Commands
QBCore.Commands.Add('givecar', 'Spawn a vehicle for a player', {
    {name = 'id', help = 'Player ID'},
    {name = 'vehicle', help = 'Vehicle model'}
}, true, function(source, args)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player.PlayerData.job.name == 'admin' then
        return
    end

    local targetId = tonumber(args[1])
    local vehicle = args[2]
    
    if not targetId or not vehicle then
        TriggerClientEvent('QBCore:Notify', source, 'Usage: /givecar [id] [vehicle]', 'error')
        return
    end

    local Target = QBCore.Functions.GetPlayer(targetId)
    if not Target then
        TriggerClientEvent('QBCore:Notify', source, 'Player not found', 'error')
        return
    end

    TriggerClientEvent('zavlogs:spawnVehicle', targetId, vehicle)
    LogAdminCommand('givecar', source, targetId, vehicle)
    TriggerClientEvent('QBCore:Notify', source, 'Vehicle spawned', 'success')
end, 'admin')`;
    } else {
      return `
-- Standalone Commands
RegisterCommand('givecar', function(source, args, rawCommand)
    if not IsPlayerAceAllowed(source, 'zavlogs.givecar') then
        return
    end

    local targetId = tonumber(args[1])
    local vehicle = args[2]
    
    if not targetId or not vehicle then
        TriggerClientEvent('chat:addMessage', source, {args = {'SYSTEM', 'Usage: /givecar [id] [vehicle]'}})
        return
    end

    TriggerClientEvent('zavlogs:spawnVehicle', targetId, vehicle)
    LogAdminCommand('givecar', source, targetId, vehicle)
    TriggerClientEvent('chat:addMessage', source, {args = {'SYSTEM', 'Vehicle spawned!'}})
end, false)`;
    }
  };

  const generateClientFile = (framework: string) => {
    return `-- Zav Logs Client Script

local isUIOpen = false

-- Vehicle spawning
RegisterNetEvent('zavlogs:spawnVehicle')
AddEventHandler('zavlogs:spawnVehicle', function(vehicle)
    local playerPed = PlayerPedId()
    local coords = GetEntityCoords(playerPed)
    local heading = GetEntityHeading(playerPed)
    
    RequestModel(vehicle)
    while not HasModelLoaded(vehicle) do
        Wait(1)
    end
    
    local spawnedVehicle = CreateVehicle(vehicle, coords.x + 2, coords.y, coords.z, heading, true, false)
    TaskWarpPedIntoVehicle(playerPed, spawnedVehicle, -1)
    
    SetModelAsNoLongerNeeded(vehicle)
end)

-- UI Functions
RegisterNetEvent('zavlogs:openUI')
AddEventHandler('zavlogs:openUI', function()
    if not isUIOpen then
        SetNuiFocus(true, true)
        SendNUIMessage({
            type = 'openUI'
        })
        isUIOpen = true
    end
end)

RegisterNUICallback('closeUI', function(data, cb)
    SetNuiFocus(false, false)
    isUIOpen = false
    cb('ok')
end)

RegisterNUICallback('executeCommand', function(data, cb)
    TriggerServerEvent('zavlogs:executeCommand', data.command, data.args)
    cb('ok')
end)

-- Keybind
if Config.UI.keybind then
    RegisterKeyMapping(Config.UI.command, 'Open Zav Logs UI', 'keyboard', Config.UI.keybind)
end

print("^2[Zav Logs] ^7Client script loaded")`;
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
    <div id="container" style="display: none;">
        <div class="header">
            <h1>Zav Logs</h1>
            <button id="closeBtn">×</button>
        </div>
        
        <div class="content">
            <div class="section">
                <h2>Quick Commands</h2>
                <div class="commands-grid">
                    <div class="command-card">
                        <h3>Give Car</h3>
                        <input type="number" id="givecar-id" placeholder="Player ID">
                        <input type="text" id="givecar-vehicle" placeholder="Vehicle Model">
                        <button onclick="executeCommand('givecar')">Execute</button>
                    </div>
                    
                    <div class="command-card">
                        <h3>Give Money</h3>
                        <input type="number" id="givemoney-id" placeholder="Player ID">
                        <input type="number" id="givemoney-amount" placeholder="Amount">
                        <select id="givemoney-type">
                            <option value="money">Cash</option>
                            <option value="bank">Bank</option>
                        </select>
                        <button onclick="executeCommand('givemoney')">Execute</button>
                    </div>
                    
                    <div class="command-card">
                        <h3>Set Job</h3>
                        <input type="number" id="setjob-id" placeholder="Player ID">
                        <input type="text" id="setjob-job" placeholder="Job Name">
                        <input type="number" id="setjob-grade" placeholder="Grade">
                        <button onclick="executeCommand('setjob')">Execute</button>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>Server Information</h2>
                <div class="info-grid">
                    <div class="info-card">
                        <h3>Players Online</h3>
                        <span id="playersOnline">Loading...</span>
                    </div>
                    <div class="info-card">
                        <h3>Server Uptime</h3>
                        <span id="serverUptime">Loading...</span>
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
    font-family: 'Arial', sans-serif;
    background: transparent;
    color: white;
}

#container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    height: 600px;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(168, 85, 247, 0.1));
    backdrop-filter: blur(10px);
    border: 1px solid rgba(34, 197, 94, 0.3);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.header {
    background: linear-gradient(135deg, #22c55e, #a855f7);
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header h1 {
    font-size: 24px;
    font-weight: bold;
}

#closeBtn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 24px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
}

#closeBtn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
}

.content {
    padding: 20px;
    height: calc(100% - 80px);
    overflow-y: auto;
}

.section {
    margin-bottom: 30px;
}

.section h2 {
    color: #22c55e;
    margin-bottom: 15px;
    font-size: 18px;
}

.commands-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.command-card {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.3);
    border-radius: 8px;
    padding: 20px;
    backdrop-filter: blur(5px);
}

.command-card h3 {
    color: #a855f7;
    margin-bottom: 15px;
    font-size: 16px;
}

.command-card input, .command-card select {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    color: white;
}

.command-card input::placeholder {
    color: rgba(255, 255, 255, 0.7);
}

.command-card button {
    width: 100%;
    padding: 10px;
    background: linear-gradient(135deg, #22c55e, #a855f7);
    border: none;
    border-radius: 4px;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.command-card button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(34, 197, 94, 0.3);
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.info-card {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(168, 85, 247, 0.3);
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    backdrop-filter: blur(5px);
}

.info-card h3 {
    color: #a855f7;
    margin-bottom: 10px;
    font-size: 14px;
}

.info-card span {
    font-size: 24px;
    font-weight: bold;
    color: #22c55e;
}

::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #22c55e, #a855f7);
    border-radius: 4px;
}`;
  };

  const generateUIJS = () => {
    return `window.addEventListener('message', function(event) {
    if (event.data.type === 'openUI') {
        document.getElementById('container').style.display = 'block';
    }
});

document.getElementById('closeBtn').addEventListener('click', function() {
    closeUI();
});

function closeUI() {
    document.getElementById('container').style.display = 'none';
    fetch(\`https://\${GetParentResourceName()}/closeUI\`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });
}

function executeCommand(command) {
    let args = [];
    
    switch(command) {
        case 'givecar':
            args = [
                document.getElementById('givecar-id').value,
                document.getElementById('givecar-vehicle').value
            ];
            break;
        case 'givemoney':
            args = [
                document.getElementById('givemoney-id').value,
                document.getElementById('givemoney-amount').value,
                document.getElementById('givemoney-type').value
            ];
            break;
        case 'setjob':
            args = [
                document.getElementById('setjob-id').value,
                document.getElementById('setjob-job').value,
                document.getElementById('setjob-grade').value
            ];
            break;
    }
    
    fetch(\`https://\${GetParentResourceName()}/executeCommand\`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            command: command,
            args: args
        })
    });
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeUI();
    }
});`;
  };

  const generateManifest = (framework: string) => {
    return `fx_version 'cerulean'
game 'gta5'

name 'Zav Logs'
author 'Zav Logs Generator'
description 'Advanced logging system for FiveM servers with Discord integration'
version '1.0.0'

server_scripts {
    'config.lua',
    'server.lua'
}

client_scripts {
    'config.lua',
    'client.lua'
}

ui_page 'ui/index.html'

files {
    'ui/index.html',
    'ui/style.css',
    'ui/script.js'
}

${framework === 'esx' ? 'dependencies {\n    \'es_extended\'\n}' : ''}
${framework === 'qbcore' ? 'dependencies {\n    \'qb-core\'\n}' : ''}

lua54 'yes'`;
  };

  const generateREADME = () => {
    return `# Zav Logs

Advanced logging system for FiveM servers with Discord webhook integration and admin UI.

## Features

- **Command Logging**: Automatically logs admin commands like givecar, givemoney, setjob, etc.
- **Event Logging**: Logs server events like player connections, disconnections, chat messages
- **Discord Integration**: Sends formatted logs to Discord channels via webhooks
- **Admin UI**: In-game UI for quick command execution (F9 or /zavlogs)
- **Framework Support**: Works with ESX, QB-Core, and Standalone

## Installation

1. Download and extract the resource to your FiveM server
2. Add \`ensure zav-logs\` to your server.cfg
3. Configure webhooks in \`config.lua\`
4. Restart your server

## Configuration

### Discord Webhooks

Edit \`config.lua\` and replace the webhook URLs:

\`\`\`lua
Config.Webhooks = {
    ['economy'] = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE',
    ['vehicles'] = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE',
    -- ... more categories
}
\`\`\`

### Commands

The system logs these commands by default:
- \`/givecar [id] [vehicle]\`
- \`/givemoney [id] [amount] [type]\`
- \`/setjob [id] [job] [grade]\`
- \`/kick [id] [reason]\`
- \`/ban [id] [duration] [reason]\`

### Events

The system logs these events by default:
- Player connections
- Player disconnections
- Chat messages (disabled by default)

## Usage

### Admin UI

- Press F9 or use \`/zavlogs\` to open the admin UI
- Quick access to common commands
- Real-time server information

### Permissions

**ESX**: Players with admin group can access the UI
**QB-Core**: Players with admin job can access the UI
**Standalone**: Players with \`zavlogs.access\` ace permission can access the UI

## API

### Server Events

\`\`\`lua
-- Log a custom command
exports['zav-logs']:LogAdminCommand('mycommand', adminId, targetId, arg1, arg2)

-- Log a custom event
exports['zav-logs']:LogEvent('myevent', arg1, arg2, arg3)
\`\`\`

## Support

For support and updates, visit our Discord server or GitHub repository.

## License

This resource is provided as-is. Feel free to modify and distribute.`;
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
      title: "Pobieranie zasobu",
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
      <Card className="bg-gradient-to-br from-fivem-primary/10 to-fivem-secondary/10 border-fivem-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-fivem-primary" />
            Generator Zasobu FiveM
          </CardTitle>
          <CardDescription>
            Wybierz framework i wygeneruj kompletny zasób Zav Logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={selectedFramework} onValueChange={setSelectedFramework}>
              <SelectTrigger className="w-[250px]">
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
            <Button onClick={generateScripts} className="bg-gradient-to-r from-fivem-primary to-fivem-secondary">
              <Code className="w-4 h-4 mr-2" />
              Regeneruj Zasób
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Scripts */}
      {generatedScripts.length > 0 && (
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-fivem-primary" />
                  Wygenerowany Zasób
                </CardTitle>
                <CardDescription>
                  {generatedScripts.length} plików gotowych do pobrania
                </CardDescription>
              </div>
              <Button onClick={downloadAllScripts} className="bg-gradient-to-r from-fivem-secondary to-fivem-accent">
                <Download className="w-4 h-4 mr-2" />
                Pobierz Cały Zasób
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedScript} onValueChange={setSelectedScript}>
              <TabsList className="grid w-full grid-cols-4 mb-4">
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
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={
                        script.type === 'server' ? 'border-fivem-primary/30 text-fivem-primary' :
                        script.type === 'client' ? 'border-fivem-secondary/30 text-fivem-secondary' :
                        script.type === 'ui' ? 'border-fivem-accent/30 text-fivem-accent' :
                        'border-primary/30 text-primary'
                      }>
                        {script.type === 'server' && '🖥️ Server'}
                        {script.type === 'client' && '💻 Client'}
                        {script.type === 'config' && '⚙️ Config'}
                        {script.type === 'manifest' && '📋 Manifest'}
                        {script.type === 'ui' && '🎨 UI'}
                      </Badge>
                      <span className="font-mono text-sm">{script.filename}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(script.content)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Kopiuj
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadScript(script)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Pobierz
                      </Button>
                    </div>
                  </div>
                  
                  <Textarea
                    value={script.content}
                    readOnly
                    className="font-mono text-xs min-h-[500px] bg-muted/50"
                  />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Installation Instructions */}
      <Card className="border-fivem-primary/30 bg-gradient-to-br from-fivem-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="text-fivem-primary">📋 Instrukcja Instalacji</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">1. Pobierz i rozpakuj</h4>
                <p className="text-sm text-muted-foreground">
                  Pobierz wszystkie pliki i umieść je w folderze <code className="bg-muted px-1 rounded">resources/zav-logs</code>
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">2. Skonfiguruj webhooks</h4>
                <p className="text-sm text-muted-foreground">
                  W pliku <code className="bg-muted px-1 rounded">config.lua</code> zamień "YOUR_WEBHOOK_HERE" na prawdziwe URL-e webhook-ów Discord
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">3. Dodaj do server.cfg</h4>
                <code className="block bg-muted p-2 rounded text-sm">
                  ensure zav-logs
                </code>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">4. Uprawnienia</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedFramework === 'esx' && 'Ustaw grupę admin w ESX'}
                  {selectedFramework === 'qbcore' && 'Skonfiguruj job "admin" w QB-Core'}
                  {selectedFramework === 'standalone' && 'Dodaj ACE permission "zavlogs.access"'}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">5. Użytkowanie</h4>
                <p className="text-sm text-muted-foreground">
                  Użyj <code className="bg-muted px-1 rounded">F9</code> lub <code className="bg-muted px-1 rounded">/zavlogs</code> aby otworzyć panel administracyjny
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">6. Testowanie</h4>
                <p className="text-sm text-muted-foreground">
                  Wykonaj kilka komend administracyjnych i sprawdź czy logi pojawiają się na Discord
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
