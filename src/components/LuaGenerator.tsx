import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Copy, Code, FileCode, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GeneratedScript {
  filename: string;
  content: string;
  type: 'client' | 'server' | 'config';
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
    const configContent = generateConfigFile(selectedFramework);
    scripts.push({
      filename: 'config.lua',
      content: configContent,
      type: 'config'
    });

    // Server file
    const serverContent = generateServerFile(selectedFramework);
    scripts.push({
      filename: 'server.lua',
      content: serverContent,
      type: 'server'
    });

    // Client file (if needed)
    if (selectedFramework !== 'standalone') {
      const clientContent = generateClientFile(selectedFramework);
      scripts.push({
        filename: 'client.lua',
        content: clientContent,
        type: 'client'
      });
    }

    // fxmanifest.lua
    const manifestContent = generateManifest(selectedFramework);
    scripts.push({
      filename: 'fxmanifest.lua',
      content: manifestContent,
      type: 'config'
    });

    setGeneratedScripts(scripts);
    setSelectedScript(scripts[0].filename);
    
    toast({
      title: "Skrypty wygenerowane!",
      description: `Wygenerowano ${scripts.length} plików dla ${frameworkOptions.find(f => f.value === selectedFramework)?.label}`
    });
  };

  const generateConfigFile = (framework: string) => {
    return `-- Admin Logger Configuration
Config = {}

-- Framework type
Config.Framework = "${framework}"

-- Discord Webhook URLs
Config.Webhooks = {
    ['economy'] = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE',
    ['vehicles'] = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE',
    ['items'] = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE',
    ['jobs'] = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE',
    ['moderation'] = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE',
    ['general'] = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE'
}

-- Commands to log
Config.Commands = {
    ['givecar'] = {
        enabled = true,
        category = 'vehicles',
        title = '🚗 Spawned Vehicle',
        color = 3447003, -- Blue
        format = function(admin, target, vehicle)
            return {
                {name = "Admin", value = admin, inline = true},
                {name = "Target Player", value = target, inline = true},
                {name = "Vehicle", value = vehicle, inline = true}
            }
        end
    },
    ['giveitem'] = {
        enabled = true,
        category = 'items',
        title = '📦 Given Item',
        color = 15844367, -- Gold
        format = function(admin, target, item, amount)
            return {
                {name = "Admin", value = admin, inline = true},
                {name = "Target Player", value = target, inline = true},
                {name = "Item", value = item, inline = true},
                {name = "Amount", value = tostring(amount), inline = true}
            }
        end
    },
    ['setjob'] = {
        enabled = true,
        category = 'jobs',
        title = '💼 Job Changed',
        color = 9442302, -- Purple
        format = function(admin, target, job, grade)
            return {
                {name = "Admin", value = admin, inline = true},
                {name = "Target Player", value = target, inline = true},
                {name = "Job", value = job, inline = true},
                {name = "Grade", value = tostring(grade), inline = true}
            }
        end
    },
    ['givemoney'] = {
        enabled = true,
        category = 'economy',
        title = '💰 Money Given',
        color = 5763719, -- Green
        format = function(admin, target, amount, moneyType)
            return {
                {name = "Admin", value = admin, inline = true},
                {name = "Target Player", value = target, inline = true},
                {name = "Amount", value = "$" .. tostring(amount), inline = true},
                {name = "Type", value = moneyType or "cash", inline = true}
            }
        end
    },
    ['kick'] = {
        enabled = true,
        category = 'moderation',
        title = '👢 Player Kicked',
        color = 15158332, -- Red
        format = function(admin, target, reason)
            return {
                {name = "Admin", value = admin, inline = true},
                {name = "Kicked Player", value = target, inline = true},
                {name = "Reason", value = reason or "No reason", inline = false}
            }
        end
    },
    ['ban'] = {
        enabled = true,
        category = 'moderation',
        title = '🔨 Player Banned',
        color = 10038562, -- Dark Red
        format = function(admin, target, duration, reason)
            return {
                {name = "Admin", value = admin, inline = true},
                {name = "Banned Player", value = target, inline = true},
                {name = "Duration", value = duration or "Permanent", inline = true},
                {name = "Reason", value = reason or "No reason", inline = false}
            }
        end
    }
}

-- Bot settings for each category
Config.BotSettings = {
    ['economy'] = {username = "FiveM Economy Logger", avatar_url = ""},
    ['vehicles'] = {username = "FiveM Vehicle Logger", avatar_url = ""},
    ['items'] = {username = "FiveM Items Logger", avatar_url = ""},
    ['jobs'] = {username = "FiveM Jobs Logger", avatar_url = ""},
    ['moderation'] = {username = "FiveM Moderation Logger", avatar_url = ""},
    ['general'] = {username = "FiveM Admin Logger", avatar_url = ""}
}`;
  };

  const generateServerFile = (framework: string) => {
    return `-- Admin Logger Server Script
${framework === 'esx' ? "ESX = exports['es_extended']:getSharedObject()" : ''}
${framework === 'qbcore' ? "local QBCore = exports['qb-core']:GetCoreObject()" : ''}

-- Function to send Discord webhook
function SendToDiscord(category, title, description, fields, color)
    local webhook = Config.Webhooks[category]
    if not webhook or webhook == 'https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE' then
        return
    end

    local botSettings = Config.BotSettings[category] or Config.BotSettings['general']
    
    local embed = {
        {
            title = title,
            description = description,
            color = color,
            fields = fields,
            footer = {
                text = "FiveM Admin Logger • " .. os.date("%Y-%m-%d %H:%M:%S")
            },
            timestamp = os.date("!%Y-%m-%dT%H:%M:%SZ")
        }
    }

    local payload = {
        username = botSettings.username,
        avatar_url = botSettings.avatar_url,
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

-- Export function for other scripts
exports('LogAdminCommand', LogAdminCommand)

-- Example command implementations
${framework === 'esx' ? generateESXCommands() : ''}
${framework === 'qbcore' ? generateQBCoreCommands() : ''}
${framework === 'standalone' ? generateStandaloneCommands() : ''}

print("^2[Admin Logger] ^7Loaded successfully for ^3" .. Config.Framework .. "^7 framework")`;
  };

  const generateESXCommands = () => {
    return `
-- ESX Commands
RegisterCommand('givecar', function(source, args, rawCommand)
    local xPlayer = ESX.GetPlayerFromId(source)
    if not xPlayer or not xPlayer.getGroup() or xPlayer.getGroup() == 'user' then
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

    -- Spawn vehicle logic here
    TriggerClientEvent('admin:spawnVehicle', targetId, vehicle)
    
    -- Log the command
    LogAdminCommand('givecar', source, targetId, vehicle)
    
    xPlayer.showNotification('Vehicle spawned for ' .. xTarget.getName())
end, true)

RegisterCommand('givemoney', function(source, args, rawCommand)
    local xPlayer = ESX.GetPlayerFromId(source)
    if not xPlayer or not xPlayer.getGroup() or xPlayer.getGroup() == 'user' then
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
    
    -- Log the command
    LogAdminCommand('givemoney', source, targetId, amount, moneyType)
    
    xPlayer.showNotification('Money given to ' .. xTarget.getName())
end, true)

RegisterCommand('setjob', function(source, args, rawCommand)
    local xPlayer = ESX.GetPlayerFromId(source)
    if not xPlayer or not xPlayer.getGroup() or xPlayer.getGroup() == 'user' then
        return
    end

    local targetId = tonumber(args[1])
    local job = args[2]
    local grade = tonumber(args[3]) or 0
    
    if not targetId or not job then
        xPlayer.showNotification('Usage: /setjob [id] [job] [grade]')
        return
    end

    local xTarget = ESX.GetPlayerFromId(targetId)
    if not xTarget then
        xPlayer.showNotification('Player not found')
        return
    end

    xTarget.setJob(job, grade)
    
    -- Log the command
    LogAdminCommand('setjob', source, targetId, job, grade)
    
    xPlayer.showNotification('Job set for ' .. xTarget.getName())
end, true)`;
  };

  const generateQBCoreCommands = () => {
    return `
-- QB-Core Commands
QBCore.Commands.Add('givecar', 'Spawn a vehicle for a player', {{name = 'id', help = 'Player ID'}, {name = 'vehicle', help = 'Vehicle model'}}, true, function(source, args)
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

    -- Spawn vehicle logic here
    TriggerClientEvent('admin:spawnVehicle', targetId, vehicle)
    
    -- Log the command
    LogAdminCommand('givecar', source, targetId, vehicle)
    
    TriggerClientEvent('QBCore:Notify', source, 'Vehicle spawned for ' .. Target.PlayerData.charinfo.firstname, 'success')
end, 'admin')

QBCore.Commands.Add('givemoney', 'Give money to a player', {{name = 'id', help = 'Player ID'}, {name = 'amount', help = 'Amount'}, {name = 'type', help = 'Money type'}}, true, function(source, args)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player.PlayerData.job.name == 'admin' then
        return
    end

    local targetId = tonumber(args[1])
    local amount = tonumber(args[2])
    local moneyType = args[3] or 'cash'
    
    if not targetId or not amount then
        TriggerClientEvent('QBCore:Notify', source, 'Usage: /givemoney [id] [amount] [type]', 'error')
        return
    end

    local Target = QBCore.Functions.GetPlayer(targetId)
    if not Target then
        TriggerClientEvent('QBCore:Notify', source, 'Player not found', 'error')
        return
    end

    Target.Functions.AddMoney(moneyType, amount)
    
    -- Log the command
    LogAdminCommand('givemoney', source, targetId, amount, moneyType)
    
    TriggerClientEvent('QBCore:Notify', source, 'Money given to ' .. Target.PlayerData.charinfo.firstname, 'success')
end, 'admin')

QBCore.Commands.Add('setjob', 'Set job for a player', {{name = 'id', help = 'Player ID'}, {name = 'job', help = 'Job name'}, {name = 'grade', help = 'Job grade'}}, true, function(source, args)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player.PlayerData.job.name == 'admin' then
        return
    end

    local targetId = tonumber(args[1])
    local job = args[2]
    local grade = tonumber(args[3]) or 0
    
    if not targetId or not job then
        TriggerClientEvent('QBCore:Notify', source, 'Usage: /setjob [id] [job] [grade]', 'error')
        return
    end

    local Target = QBCore.Functions.GetPlayer(targetId)
    if not Target then
        TriggerClientEvent('QBCore:Notify', source, 'Player not found', 'error')
        return
    end

    Target.Functions.SetJob(job, grade)
    
    -- Log the command
    LogAdminCommand('setjob', source, targetId, job, grade)
    
    TriggerClientEvent('QBCore:Notify', source, 'Job set for ' .. Target.PlayerData.charinfo.firstname, 'success')
end, 'admin')`;
  };

  const generateStandaloneCommands = () => {
    return `
-- Standalone Commands (basic examples)
RegisterCommand('givecar', function(source, args, rawCommand)
    -- Add your permission check here
    if not IsPlayerAceAllowed(source, 'admin.givecar') then
        return
    end

    local targetId = tonumber(args[1])
    local vehicle = args[2]
    
    if not targetId or not vehicle then
        TriggerClientEvent('chat:addMessage', source, {args = {'SYSTEM', 'Usage: /givecar [id] [vehicle]'}})
        return
    end

    -- Spawn vehicle logic here
    TriggerClientEvent('admin:spawnVehicle', targetId, vehicle)
    
    -- Log the command
    LogAdminCommand('givecar', source, targetId, vehicle)
    
    TriggerClientEvent('chat:addMessage', source, {args = {'SYSTEM', 'Vehicle spawned!'}})
end, true)

-- Add more commands as needed...`;
  };

  const generateClientFile = (framework: string) => {
    return `-- Admin Logger Client Script

-- Vehicle spawning
RegisterNetEvent('admin:spawnVehicle')
AddEventHandler('admin:spawnVehicle', function(vehicle)
    local playerPed = PlayerPedId()
    local coords = GetEntityCoords(playerPed)
    
    RequestModel(vehicle)
    while not HasModelLoaded(vehicle) do
        Wait(1)
    end
    
    local spawnedVehicle = CreateVehicle(vehicle, coords.x + 2, coords.y, coords.z, GetEntityHeading(playerPed), true, false)
    TaskWarpPedIntoVehicle(playerPed, spawnedVehicle, -1)
    
    SetModelAsNoLongerNeeded(vehicle)
end)

print("^2[Admin Logger] ^7Client script loaded")`;
  };

  const generateManifest = (framework: string) => {
    return `fx_version 'cerulean'
game 'gta5'

author 'Admin Logger Generator'
description 'Automated admin command logging for ${frameworkOptions.find(f => f.value === framework)?.label}'
version '1.0.0'

${framework !== 'standalone' ? 'client_script \'client.lua\'' : ''}
server_scripts {
    'config.lua',
    'server.lua'
}

${framework === 'esx' ? 'dependencies {\n    \'es_extended\'\n}' : ''}
${framework === 'qbcore' ? 'dependencies {\n    \'qb-core\'\n}' : ''}`;
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
    generatedScripts.forEach(script => {
      setTimeout(() => downloadScript(script), 100 * generatedScripts.indexOf(script));
    });
  };

  useEffect(() => {
    generateScripts();
  }, [selectedFramework]);

  const currentScript = generatedScripts.find(s => s.filename === selectedScript);

  return (
    <div className="space-y-6">
      {/* Framework Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-fivem-primary" />
            Wybierz Framework
          </CardTitle>
          <CardDescription>
            Wybierz framework który używasz na swoim serwerze
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={selectedFramework} onValueChange={setSelectedFramework}>
              <SelectTrigger className="w-[200px]">
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
            <Button onClick={generateScripts} className="bg-gradient-primary">
              <Code className="w-4 h-4 mr-2" />
              Regeneruj Skrypty
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Scripts */}
      {generatedScripts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Wygenerowane Skrypty</CardTitle>
                <CardDescription>
                  {generatedScripts.length} plików gotowych do pobrania
                </CardDescription>
              </div>
              <Button onClick={downloadAllScripts} className="bg-gradient-secondary">
                <Download className="w-4 h-4 mr-2" />
                Pobierz Wszystkie
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedScript} onValueChange={setSelectedScript}>
              <TabsList className="grid w-full grid-cols-4">
                {generatedScripts.map(script => (
                  <TabsTrigger key={script.filename} value={script.filename} className="flex items-center gap-2">
                    <FileCode className="w-4 h-4" />
                    {script.filename}
                  </TabsTrigger>
                ))}
              </TabsList>

              {generatedScripts.map(script => (
                <TabsContent key={script.filename} value={script.filename} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {script.type === 'server' && '🖥️ Server'}
                        {script.type === 'client' && '💻 Client'}
                        {script.type === 'config' && '⚙️ Config'}
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
                    className="font-mono text-xs min-h-[500px] bg-muted"
                  />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Installation Instructions */}
      <Card className="border-fivem-primary/20">
        <CardHeader>
          <CardTitle className="text-fivem-primary">📋 Instrukcja Instalacji</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">1. Pobierz pliki</h4>
            <p className="text-sm text-muted-foreground">
              Pobierz wszystkie wygenerowane pliki i umieść je w folderze swojego zasobu
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">2. Skonfiguruj webhooks</h4>
            <p className="text-sm text-muted-foreground">
              W pliku config.lua zamień "YOUR_WEBHOOK_HERE" na prawdziwe URL-e webhook-ów Discord
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">3. Dodaj do server.cfg</h4>
            <code className="block bg-muted p-2 rounded text-sm">
              ensure admin_logger
            </code>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">4. Nadaj uprawnienia</h4>
            <p className="text-sm text-muted-foreground">
              {selectedFramework === 'esx' && 'Ustaw grupę admin w ESX lub użyj ACE permissions'}
              {selectedFramework === 'qbcore' && 'Skonfiguruj job "admin" w QB-Core'}
              {selectedFramework === 'standalone' && 'Skonfiguruj ACE permissions dla komend'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}