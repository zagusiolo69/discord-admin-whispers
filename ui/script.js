
// Zav Logs UI Script
let isVisible = false;
let currentLogs = [];
let currentStats = {};

// Initialize UI
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeEventListeners();
    updateTime();
    setInterval(updateTime, 1000);
});

// Tab functionality
function initializeTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            // Update active tab button
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update active tab panel
            document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            
            // Load data for specific tabs
            if (tabId === 'logs') {
                refreshLogs();
            } else if (tabId === 'overview') {
                refreshStats();
            }
        });
    });
}

// Event listeners
function initializeEventListeners() {
    // Close button
    document.getElementById('close-btn').addEventListener('click', hideUI);
    
    // Category filter
    document.getElementById('category-filter').addEventListener('change', function() {
        const category = this.value;
        if (category) {
            fetchLogsByCategory(category);
        } else {
            refreshLogs();
        }
    });
    
    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            // Switch to logs tab and filter
            document.querySelector('[data-tab="logs"]').click();
            document.getElementById('category-filter').value = category;
            fetchLogsByCategory(category);
        });
    });
}

// Time update
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pl-PL');
    document.getElementById('server-time').textContent = timeString;
}

// NUI Message handler
window.addEventListener('message', (event) => {
    const data = event.data;
    
    switch(data.type) {
        case 'setVisible':
            if (data.visible) {
                showUI();
            } else {
                hideUI();
            }
            break;
        case 'updateLogs':
            updateLogsList(data.logs);
            break;
        case 'updateStats':
            updateStats(data.stats);
            break;
    }
});

// ESC key handler
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isVisible) {
        hideUI();
    }
});

// UI Control Functions
function showUI() {
    isVisible = true;
    document.getElementById('container').classList.remove('hidden');
    refreshData();
}

function hideUI() {
    isVisible = false;
    document.getElementById('container').classList.add('hidden');
    
    // Send close message to client
    fetch(\`https://\${GetParentResourceName()}/close\`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });
}

// Data Functions
function refreshData() {
    refreshStats();
    refreshLogs();
}

function refreshStats() {
    fetch(\`https://\${GetParentResourceName()}/getStats\`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });
}

function refreshLogs() {
    fetch(\`https://\${GetParentResourceName()}/refreshLogs\`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            limit: 50,
            offset: 0
        })
    });
}

function fetchLogsByCategory(category) {
    fetch(\`https://\${GetParentResourceName()}/getLogsByCategory\`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            category: category,
            limit: 50
        })
    });
}

// Update Functions
function updateStats(stats) {
    currentStats = stats;
    document.getElementById('total-logs').textContent = stats.totalLogs || 0;
    document.getElementById('today-logs').textContent = stats.todayLogs || 0;
    document.getElementById('active-webhooks').textContent = stats.activeWebhooks || 0;
}

function updateLogsList(logs) {
    currentLogs = logs;
    const logList = document.getElementById('log-list');
    
    if (!logs || logs.length === 0) {
        logList.innerHTML = '<div class="loading">Brak logów do wyświetlenia</div>';
        return;
    }
    
    const logsHTML = logs.map(log => {
        const date = new Date(log.created_at);
        const timeString = date.toLocaleTimeString('pl-PL', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        return \`
            <div class="log-item">
                <div class="log-time">\${timeString}</div>
                <div class="log-type \${log.category}">\${log.category}</div>
                <div class="log-message">
                    <strong>\${log.title}</strong><br>
                    <small>\${log.description}</small>
                </div>
                <div class="log-details">
                    \${log.admin_name ? \`Admin: \${log.admin_name}\` : ''}
                    \${log.target_name && log.target_name !== 'N/A' ? \`<br>Target: \${log.target_name}\` : ''}
                </div>
            </div>
        \`;
    }).join('');
    
    logList.innerHTML = logsHTML;
}

// Export function
function exportLogs() {
    if (currentLogs.length === 0) {
        alert('Brak logów do eksportu');
        return;
    }
    
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Czas,Kategoria,Tytuł,Opis,Admin,Target\\n"
        + currentLogs.map(log => 
            \`"\${log.created_at}","\${log.category}","\${log.title}","\${log.description}","\${log.admin_name || ''}","\${log.target_name || ''}"\`
        ).join("\\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", \`zav_logs_\${new Date().toISOString().split('T')[0]}.csv\`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// FiveM resource name function
function GetParentResourceName() {
    return 'zav-logs';
}
