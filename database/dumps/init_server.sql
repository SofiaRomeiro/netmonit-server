DROP TABLE IF EXISTS raspberry CASCADE;
DROP TABLE IF EXISTS events CASCADE;

CREATE TABLE raspberry(
    id_pi VARCHAR(100),
    model VARCHAR(100),
    location VARCHAR(100),
    ip VARCHAR(15),
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

CREATE TABLE performance (
    id_pi VARCHAR(100),
    creation_date TIMESTAMP,
    upload_speed INTEGER,
    download_speed INTEGER,
    latency INTEGER,
    bytes_sent INTEGER,
    bytes_received INTEGER,
    destination_host VARCHAR(200),
    PRIMARY KEY (id_pi, creation_date),
    FOREIGN KEY (id_pi) REFERENCES raspberry(id_pi)
);

CREATE OR REPLACE VIEW data AS
    SELECT * FROM events
    JOIN raspberry
    ON raspberry.id_pi = events.id_pi
    JOIN performance
    ON performance.id_pi = events.id_pi
    ORDER BY creation_date DESC;