
-- Zav Logs Database Functions

Database = {}

-- Initialize database
function Database.Init()
    if Config.Debug then
        print('[Zav Logs] Initializing database...')
    end
    
    -- Load webhooks from database
    Database.LoadWebhooks()
end

-- Load webhooks from database
function Database.LoadWebhooks()
    MySQL.Async.fetchAll('SELECT name, url FROM zav_webhooks WHERE enabled = 1', {}, function(result)
        if result then
            for i = 1, #result do
                local webhook = result[i]
                if webhook.url and webhook.url ~= '' then
                    Config.Webhooks[webhook.name] = webhook.url
                end
            end
            if Config.Debug then
                print('[Zav Logs] Loaded ' .. #result .. ' webhooks from database')
            end
        end
    end)
end

-- Save log to database
function Database.SaveLog(logData)
    if not Config.Database.enabled then
        return
    end
    
    local query = [[
        INSERT INTO zav_logs 
        (log_type, category, title, description, admin_identifier, admin_name, target_identifier, target_name, command, arguments, server_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ]]
    
    local params = {
        logData.type or 'unknown',
        logData.category or 'general',
        logData.title or 'Unknown Log',
        logData.description or 'No description',
        logData.adminIdentifier,
        logData.adminName,
        logData.targetIdentifier,
        logData.targetName,
        logData.command,
        json.encode(logData.arguments or {}),
        GetConvar('sv_serverId', '0')
    }
    
    MySQL.Async.execute(query, params, function(rowsChanged)
        if Config.Debug then
            print('[Zav Logs] Log saved to database (ID: ' .. tostring(rowsChanged) .. ')')
        end
    end)
end

-- Get logs from database
function Database.GetLogs(limit, offset, callback)
    local query = [[
        SELECT * FROM zav_logs 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
    ]]
    
    MySQL.Async.fetchAll(query, {limit or 50, offset or 0}, function(result)
        callback(result or {})
    end)
end

-- Get logs by category
function Database.GetLogsByCategory(category, limit, callback)
    local query = [[
        SELECT * FROM zav_logs 
        WHERE category = ? 
        ORDER BY created_at DESC 
        LIMIT ?
    ]]
    
    MySQL.Async.fetchAll(query, {category, limit or 50}, function(result)
        callback(result or {})
    end)
end

-- Get logs count
function Database.GetLogsCount(callback)
    MySQL.Async.fetchScalar('SELECT COUNT(*) FROM zav_logs', {}, function(count)
        callback(count or 0)
    end)
end

-- Update webhook URL
function Database.UpdateWebhook(name, url)
    local query = 'UPDATE zav_webhooks SET url = ? WHERE name = ?'
    
    MySQL.Async.execute(query, {url, name}, function(rowsChanged)
        if rowsChanged > 0 then
            Config.Webhooks[name] = url
            if Config.Debug then
                print('[Zav Logs] Updated webhook: ' .. name)
            end
        end
    end)
end

-- Clean old logs (optional maintenance function)
function Database.CleanOldLogs(days)
    local query = 'DELETE FROM zav_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)'
    
    MySQL.Async.execute(query, {days or 30}, function(rowsChanged)
        if Config.Debug then
            print('[Zav Logs] Cleaned ' .. tostring(rowsChanged) .. ' old logs')
        end
    end)
end
