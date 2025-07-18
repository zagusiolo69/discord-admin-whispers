
Config = {}
Config.Debug = false

-- Framework Configuration
Config.Framework = 'esx'

-- Database Configuration
Config.Database = {
    enabled = true,
    resource = 'mysql-async' -- lub 'oxmysql'
}

-- Bot Name (DO NOT CHANGE)
Config.BotName = 'zav-logs'

-- Permission Configuration
Config.Permission = {
    group = 'best', -- Tylko ta grupa może używać /logi
    command = 'logi' -- Komenda do otwierania UI
}

-- Discord Webhook Configuration (będą ładowane z bazy danych)
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
    maxLogs = 100, -- Maksymalna liczba logów do wyświetlenia
    refreshInterval = 30000 -- Odświeżanie co 30 sekund
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
    ['car'] = {
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
    },
    ['goto'] = {
        enabled = true,
        category = 'admin',
        webhook = 'admin',
        title = '🎯 Admin Teleport',
        color = 3066993,
        description = 'Admin teleported to player'
    },
    ['bring'] = {
        enabled = true,
        category = 'admin',
        webhook = 'admin',
        title = '🔄 Player Brought',
        color = 3066993,
        description = 'Admin brought player to them'
    },
    ['tp'] = {
        enabled = true,
        category = 'admin',
        webhook = 'admin',
        title = '📍 Admin Teleport',
        color = 3066993,
        description = 'Admin teleported'
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
