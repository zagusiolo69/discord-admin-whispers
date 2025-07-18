
-- Zav Logs Client Script
ESX = exports['es_extended']:getSharedObject()

local isUIOpen = false
local currentLogs = {}
local currentStats = {}

-- UI Functions
local function toggleUI()
    isUIOpen = not isUIOpen
    SetNuiFocus(isUIOpen, isUIOpen)
    SendNUIMessage({
        type = 'setVisible',
        visible = isUIOpen
    })
    
    if isUIOpen then
        -- Load initial data
        TriggerServerEvent('zavlogs:getLogs', 50, 0)
        TriggerServerEvent('zavlogs:getStats')
    end
end

-- Events
RegisterNetEvent('zavlogs:openUI')
AddEventHandler('zavlogs:openUI', function()
    toggleUI()
end)

RegisterNetEvent('zavlogs:receiveLogs')
AddEventHandler('zavlogs:receiveLogs', function(logs)
    currentLogs = logs
    if isUIOpen then
        SendNUIMessage({
            type = 'updateLogs',
            logs = logs
        })
    end
end)

RegisterNetEvent('zavlogs:receiveStats')
AddEventHandler('zavlogs:receiveStats', function(stats)
    currentStats = stats
    if isUIOpen then
        SendNUIMessage({
            type = 'updateStats',
            stats = stats
        })
    end
end)

-- NUI Callbacks
RegisterNUICallback('close', function(data, cb)
    toggleUI()
    cb('ok')
end)

RegisterNUICallback('refreshLogs', function(data, cb)
    TriggerServerEvent('zavlogs:getLogs', data.limit or 50, data.offset or 0)
    cb('ok')
end)

RegisterNUICallback('getLogsByCategory', function(data, cb)
    TriggerServerEvent('zavlogs:getLogsByCategory', data.category, data.limit or 50)
    cb('ok')
end)

RegisterNUICallback('getStats', function(data, cb)
    TriggerServerEvent('zavlogs:getStats')
    cb('ok')
end)

-- Auto refresh every 30 seconds when UI is open
CreateThread(function()
    while true do
        Wait(Config.UI.refreshInterval or 30000)
        if isUIOpen then
            TriggerServerEvent('zavlogs:getLogs', 50, 0)
            TriggerServerEvent('zavlogs:getStats')
        end
    end
end)

print('^2[Zav Logs] ^7Client script loaded successfully')
