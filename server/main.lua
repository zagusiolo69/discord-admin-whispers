
-- Zav Logs Server Script
ESX = exports['es_extended']:getSharedObject()

-- Initialize database when resource starts
CreateThread(function()
    Wait(2000) -- Wait for mysql-async to load
    Database.Init()
end)

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

local function IsPlayerBest(playerId)
    local xPlayer = ESX.GetPlayerFromId(playerId)
    if not xPlayer then return false end
    
    return xPlayer.getGroup() == Config.Permission.group
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
                icon_url = 'https://i.imgur.com/zav-icon.png'
            },
            timestamp = os.date('!%Y-%m-%dT%H:%M:%SZ')
        }
    }

    local payload = {
        username = Config.BotName,
        avatar_url = 'https://i.imgur.com/zav-avatar.png',
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
    local adminIdentifiers = GetPlayerIdentifiers(adminId)
    local targetName = targetId and GetPlayerName(targetId) or 'N/A'
    local targetIdentifiers = targetId and GetPlayerIdentifiers(targetId) or {}
    local args = {...}

    local fields = {
        {name = 'Admin', value = adminName .. ' (' .. adminId .. ')', inline = true},
        {name = 'Target', value = targetName, inline = true},
        {name = 'Command', value = '/' .. command, inline = true}
    }

    -- Add command-specific fields
    if command == 'givecar' or command == 'car' then
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
    elseif command == 'goto' or command == 'bring' then
        fields[#fields + 1] = {name = 'Target ID', value = tostring(targetId or 'Unknown'), inline = true}
    end

    -- Save to database
    local logData = {
        type = 'command',
        category = cmdConfig.category,
        title = cmdConfig.title,
        description = cmdConfig.description,
        adminIdentifier = adminIdentifiers.license or adminIdentifiers.steam,
        adminName = adminName,
        targetIdentifier = targetIdentifiers.license or targetIdentifiers.steam,
        targetName = targetName,
        command = command,
        arguments = args
    }
    
    Database.SaveLog(logData)
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

    -- Save to database
    local logData = {
        type = 'event',
        category = eventConfig.category,
        title = eventConfig.title,
        description = eventConfig.description,
        arguments = args
    }
    
    Database.SaveLog(logData)
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

-- Main command - only for "best" group
RegisterCommand(Config.Permission.command, function(source, args)
    if not IsPlayerBest(source) then
        TriggerClientEvent('esx:showNotification', source, '~r~Nie masz uprawnień do tej komendy!')
        return
    end
    
    TriggerClientEvent('zavlogs:openUI', source)
end, false)

-- Server events for UI
RegisterNetEvent('zavlogs:getLogs')
AddEventHandler('zavlogs:getLogs', function(limit, offset)
    local source = source
    
    if not IsPlayerBest(source) then
        return
    end
    
    Database.GetLogs(limit or 50, offset or 0, function(logs)
        TriggerClientEvent('zavlogs:receiveLogs', source, logs)
    end)
end)

RegisterNetEvent('zavlogs:getLogsByCategory')
AddEventHandler('zavlogs:getLogsByCategory', function(category, limit)
    local source = source
    
    if not IsPlayerBest(source) then
        return
    end
    
    Database.GetLogsByCategory(category, limit or 50, function(logs)
        TriggerClientEvent('zavlogs:receiveLogs', source, logs)
    end)
end)

RegisterNetEvent('zavlogs:getStats')
AddEventHandler('zavlogs:getStats', function()
    local source = source
    
    if not IsPlayerBest(source) then
        return
    end
    
    Database.GetLogsCount(function(totalLogs)
        local stats = {
            totalLogs = totalLogs,
            todayLogs = 0, -- Można rozszerzyć
            activeWebhooks = 0
        }
        
        -- Count active webhooks
        for name, url in pairs(Config.Webhooks) do
            if url and url ~= '' then
                stats.activeWebhooks = stats.activeWebhooks + 1
            end
        end
        
        TriggerClientEvent('zavlogs:receiveStats', source, stats)
    end)
end)

-- Hook into existing commands
AddEventHandler('esx:onPlayerSpawn', function(playerId)
    -- Auto-hook commands when player spawns
    local commands = {'givecar', 'car', 'giveitem', 'givemoney', 'setjob', 'kick', 'ban', 'goto', 'bring', 'tp'}
    
    for _, cmd in pairs(commands) do
        if Config.Commands[cmd] and Config.Commands[cmd].enabled then
            -- This would need to be implemented per each admin script
            -- For now, it's just a placeholder for manual integration
        end
    end
end)

-- Exports
exports('LogCommand', LogCommand)
exports('LogEvent', LogEvent)
exports('SendDiscordLog', SendDiscordLog)
exports('GetPlayerLogs', function(callback, limit, offset)
    Database.GetLogs(limit, offset, callback)
end)

print('^2[Zav Logs] ^7Server script loaded successfully')
print('^2[Zav Logs] ^7Command: ^3/' .. Config.Permission.command .. '^7 (Group: ^3' .. Config.Permission.group .. '^7)')
