
fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'zav-logs'
author 'Zav Development'
description 'Advanced logging system for FiveM with Discord webhooks, database storage and admin UI'
version '3.0.0'

-- Server scripts
server_scripts {
    '@mysql-async/lib/MySQL.lua',
    'config.lua',
    'server/database.lua',
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
dependency 'es_extended'
dependency 'mysql-async'

-- Exports
exports {
    'LogCommand',
    'LogEvent',
    'SendDiscordLog',
    'GetPlayerLogs'
}
