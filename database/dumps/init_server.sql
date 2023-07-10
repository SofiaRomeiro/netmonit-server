DROP TABLE IF EXISTS raspberry CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS externalPerformance CASCADE;
DROP TABLE IF EXISTS internalPerformance CASCADE;

CREATE USER grafana WITH PASSWORD 'grafanareader';

SET TIME ZONE '+0:00';

CREATE TABLE raspberry(
    id_pi VARCHAR(100),
    pi_name VARCHAR(100),
    model VARCHAR(100),
    pi_location VARCHAR(100),
    ip VARCHAR(15),
    interface VARCHAR(20),
    destination_ping VARCHAR(100) NOT NULL,
    PRIMARY KEY (id_pi),
    CONSTRAINT valid_ip_check CHECK (LENGTH(ip) < 16),
    CONSTRAINT valid_dest_ip_check CHECK (LENGTH(destination_ping) < 16)
    -- can add more fields if useful
);

CREATE TABLE events (
    id_pi VARCHAR(100),
    creation_date TIMESTAMP, 
    destination_ping VARCHAR(100) NOT NULL,
    max BIGINT,
    min BIGINT,
    avg BIGINT,
    packets_sent INTEGER,
    packets_received INTEGER,
    packet_loss DECIMAL(8,3),
    jitter DECIMAL(8,3),
    interface VARCHAR(20),
    PRIMARY KEY (id_pi, creation_date),
    FOREIGN KEY (id_pi) REFERENCES raspberry(id_pi)
);

CREATE TABLE externalPerformance (
    id_pi VARCHAR(100),
    creation_date TIMESTAMP,
    upload_speed BIGINT,
    download_speed BIGINT,
    latency BIGINT,
    bytes_sent BIGINT,
    bytes_received BIGINT,
    destination_host VARCHAR(200), 
    PRIMARY KEY (creation_date)
);

CREATE TABLE internalPerformance (
    id_pi VARCHAR(100),
    creation_date TIMESTAMP,
    protocol VARCHAR(10),
    bytes_sent BIGINT,
    bytes_received BIGINT,
    jitter BIGINT,
    packet_loss BIGINT,    
    sent_Mbps BIGINT,
    received_Mbps BIGINT,
    destination_host VARCHAR(200),
    PRIMARY KEY (creation_date)
);

CREATE TABLE wifiTest (
    id_pi VARCHAR(100),
    creation_date TIMESTAMP,
    ap VARCHAR(100) NOT NULL,
    channel BIGINT,
    frequency BIGINT,
    quality VARCHAR(20),
    signal_level VARCHAR(20),
    encryption_mode VARCHAR(20),
    essid VARCHAR(100),
    PRIMARY KEY (creation_date, ap)
);

-- GRAFANA PERMISSIONS

GRANT SELECT ON raspberry TO grafana;
GRANT SELECT ON events TO grafana;
GRANT SELECT ON internalPerformance TO grafana;
GRANT SELECT ON externalPerformance TO grafana;
GRANT SELECT ON wifiTest TO grafana;