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

print('^2[Zav Logs] ^7Server script loaded successfully for ^3' .. Config.Framework .. '^7 framework');
