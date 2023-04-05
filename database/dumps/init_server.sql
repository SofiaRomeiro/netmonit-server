DROP TABLE IF EXISTS raspberry CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS externalPerformance CASCADE;
DROP TABLE IF EXISTS internalPerformance CASCADE;

CREATE USER grafana WITH PASSWORD 'grafanareader';

SET TIME ZONE '+0:00';

CREATE TABLE raspberry(
    id_pi VARCHAR(100),
    model VARCHAR(100),
    location VARCHAR(100),
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
    max NUMERIC,
    min NUMERIC,
    avg NUMERIC,
    packets_sent INTEGER,
    packets_received INTEGER,
    packet_loss DECIMAL(4,1),
    jitter DECIMAL(4,1),
    interface VARCHAR(20),
    PRIMARY KEY (id_pi, creation_date),
    FOREIGN KEY (id_pi) REFERENCES raspberry(id_pi)
);

CREATE TABLE externalPerformance (
    id_pi VARCHAR(100),
    creation_date TIMESTAMP,
    upload_speed NUMERIC,
    download_speed NUMERIC,
    latency NUMERIC,
    bytes_sent BIGINT,
    bytes_received BIGINT,
    destination_host VARCHAR(200), 
    PRIMARY KEY (creation_date)
);

CREATE TABLE internalPerformance (
    id_pi VARCHAR(100),
    creation_date TIMESTAMP WITHOUT TIME ZONE,
    protocol VARCHAR(10),
    bytes_sent BIGINT,
    bytes_received BIGINT,
    jitter NUMERIC,
    packet_loss NUMERIC,    
    sent_Mbps NUMERIC,
    received_Mbps NUMERIC,
    destination_host VARCHAR(200),
    PRIMARY KEY (creation_date)
);

-- GRAFANA PERMISSIONS

GRANT SELECT ON raspberry TO grafana;
GRANT SELECT ON events TO grafana;
GRANT SELECT ON internalPerformance TO grafana;
GRANT SELECT ON externalPerformance TO grafana;