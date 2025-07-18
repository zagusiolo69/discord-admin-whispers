
-- Zav Logs Database Schema
-- Uruchom ten skrypt w swojej bazie danych MySQL

CREATE TABLE IF NOT EXISTS `zav_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `log_type` varchar(50) NOT NULL,
  `category` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `admin_identifier` varchar(100) DEFAULT NULL,
  `admin_name` varchar(100) DEFAULT NULL,
  `target_identifier` varchar(100) DEFAULT NULL,
  `target_name` varchar(100) DEFAULT NULL,
  `command` varchar(100) DEFAULT NULL,
  `arguments` text DEFAULT NULL,
  `server_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `log_type` (`log_type`),
  KEY `category` (`category`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `zav_webhooks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `url` text NOT NULL,
  `enabled` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Wstaw domyślne webhooks (puste URL - należy je skonfigurować)
INSERT INTO `zav_webhooks` (`name`, `url`, `enabled`) VALUES
('admin', '', 1),
('economy', '', 1),
('vehicles', '', 1),
('items', '', 1),
('jobs', '', 1),
('moderation', '', 1),
('events', '', 1),
('general', '', 1);
