
# Zav Logs System - Kompletny Zasób FiveM

Zaawansowany system logowania dla serwerów FiveM z integracją Discord webhooks, bazą danych MySQL i panelem administracyjnym.

## 🎯 Funkcje

- 📊 **Baza danych** - Przechowywanie wszystkich logów w MySQL
- 🔗 **Discord Webhooks** - Automatyczne wysyłanie logów na Discord
- 👮 **Panel Admin** - Interfejs do przeglądania logów (tylko grupa "best")
- ⚡ **Real-time** - Automatyczne odświeżanie danych
- 🎮 **Komenda /logi** - Łatwy dostęp do panelu
- 🔒 **Bezpieczeństwo** - Tylko uprawnienia dla grupy "best"

## 📋 Wymagania

- **ESX Framework**
- **mysql-async** lub **oxmysql**
- **Serwer MySQL/MariaDB**

## 🚀 Instalacja

### 1. Baza Danych
1. Otwórz plik `database.sql`
2. Uruchom skrypt w swojej bazie danych MySQL
3. Tabele `zav_logs` i `zav_webhooks` zostaną utworzone

### 2. Zasób FiveM
1. Skopiuj folder `zav-logs` do `resources/`
2. Dodaj do `server.cfg`:
   ```
   ensure zav-logs
   ```

### 3. Konfiguracja
1. Edytuj `config.lua`:
   - Ustaw webhooks Discord w bazie danych lub pliku config
   - Sprawdź ustawienia uprawnień (domyślnie grupa "best")

### 4. Webhook Discord (opcjonalne)
1. Utwórz webhooks na swoim serwerze Discord
2. Dodaj URL-e do bazy danych w tabeli `zav_webhooks`
3. Lub ustaw je bezpośrednio w `config.lua`

## 📖 Użytkowanie

### Komendy
- `/logi` - Otwiera panel administracyjny (tylko grupa "best")

### Panel Administratora
- **Przegląd** - Statystyki systemu
- **Logi** - Przeglądanie wszystkich logów z filtrowaniem
- **Kategorie** - Podział logów według kategorii

### Automatyczne Logowanie
System automatycznie loguje:
- Komendy administracyjne (givecar, givemoney, setjob, kick, ban, itp.)
- Wydarzenia serwera (połączenia, rozłączenia graczy)
- Akcje moderacyjne

## 🛠️ Konfiguracja

### Webhooks Discord
Edytuj tabele `zav_webhooks` w bazie danych:
```sql
UPDATE zav_webhooks SET url = 'TWÓJ_WEBHOOK_URL' WHERE name = 'admin';
```

### Dodanie Nowych Komend
W pliku `config.lua` dodaj nowe komendy do sekcji `Config.Commands`:
```lua
['twojakomenda'] = {
    enabled = true,
    category = 'admin',
    webhook = 'admin',
    title = '🔧 Twoja Komenda',
    color = 3447003,
    description = 'Opis komendy'
}
```

### Integracja z Istniejącymi Skryptami
Dodaj do swoich skryptów administracyjnych:
```lua
-- Na początku komendy
exports['zav-logs']:LogCommand('nazwaKomendy', adminId, targetId, arg1, arg2, ...)
```

## 🔧 API/Eksporty

### Logowanie Komend
```lua
exports['zav-logs']:LogCommand(command, adminId, targetId, ...)
```

### Logowanie Eventów
```lua
exports['zav-logs']:LogEvent(eventName, ...)
```

### Wysyłanie na Discord
```lua
exports['zav-logs']:SendDiscordLog(webhook, title, description, fields, color)
```

### Pobieranie Logów
```lua
exports['zav-logs']:GetPlayerLogs(callback, limit, offset)
```

## 🗂️ Struktura Plików

```
zav-logs/
├── fxmanifest.lua          # Manifest zasobu
├── config.lua              # Konfiguracja główna
├── database.sql            # Skrypt bazy danych
├── server/
│   ├── main.lua           # Główny skrypt serwera
│   └── database.lua       # Funkcje bazodanowe
├── client/
│   └── main.lua           # Skrypt klienta
├── ui/
│   ├── index.html         # Interfejs HTML
│   ├── style.css          # Style CSS
│   └── script.js          # JavaScript UI
└── README.md              # Dokumentacja
```

## 🐛 Rozwiązywanie Problemów

### Brak dostępu do komendy /logi
- Sprawdź czy jesteś w grupie "best": `/setgroup [id] best`
- Sprawdź konfigurację w `config.lua`

### Logi nie zapisują się
- Sprawdź połączenie z bazą danych
- Sprawdź logi konsoli serwera
- Włącz Debug w `config.lua`

### Webhooks nie działają
- Sprawdź URL webhooks w bazie danych
- Sprawdź uprawnienia webhook na Discord
- Sprawdź logi serwera

## 📞 Support

Dla wsparcia technicznego:
- Sprawdź logi konsoli FiveM
- Włącz `Config.Debug = true`
- Sprawdź połączenie z bazą danych

---

**Wersja:** 3.0.0  
**Framework:** ESX  
**Komenda:** /logi  
**Uprawnienia:** Grupa "best"
