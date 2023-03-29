require('dotenv').config();

const express = require('express');
const pool = require("../db");
const router = express.Router();
const util = require('util');

router.post(`/update/monitor`, async(req, res) => {
    console.log("Request body: " + util.inspect(req.body, false, null, true))

    await req.body.forEach(async log => {
        try {
            const result = await pool.query('INSERT into events \
            (id_pi, creation_date, destination_ping, max, min, avg, packets_sent, packets_received, \
                packet_loss, jitter, interface) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
                 [log.id_pi, 
                    log.creation_date, 
                    log.destination_ip, 
                    log.max, 
                    log.min,
                    log.avg,
                    log.packets_sent,
                    log.packets_received,
                    log.packet_loss,
                    log.jitter,
                    log.interface]
                )
            }
            catch (error) {
                console.log("Error on insertion: " + error.message)
            }
    })
    
    res.send("OK!")
})

router.post(`/update/performance/external`, async(req, res) => {
    console.log("Request body: " + util.inspect(req.body, false, null, true))
    await req.body.forEach(async log => {
        try {
            const result = await pool.query('INSERT into externalPerformance \
            (id_pi, creation_date, upload_speed, download_speed, latency, \
                bytes_sent, bytes_received, destination_host)\
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                 [log.id_pi, 
                    log.creation_date, 
                    log.upload_speed, 
                    log.download_speed, 
                    log.latency,
                    log.bytes_sent,
                    log.bytes_received,
                    log.destination_host
                ]
                )
            }
            catch (error) {
                console.log("Error on insertion: " + error.message)
            }
    })
    
    res.send("OK!")
})

router.post(`/update/performance/internal`, async(req, res) => {
    console.log("Request body: " + util.inspect(req.body, false, null, true))
    await req.body.forEach(async log => {
        try {
            const result = await pool.query('INSERT into internalPerformance \
            (id_pi, creation_date, protocol, bytes_sent, bytes_received, \
                jitter, packet_loss, sent_Mbps, received_Mbps, destination_host)\
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
                 [log.id_pi, 
                    log.creation_date, 
                    log.protocol, 
                    log.bytes_sent, 
                    log.bytes_received,
                    log.jitter,
                    log.packet_loss,
                    log.sent_Mbps,
                    log.received_Mbps,
                    log.destination_host
                ]
                )
            }
            catch (error) {
                console.log("Error on insertion: " + error.message)
            }
    })
    
    res.send("OK!")
})

router.post(`/registration`, async (req, res) => {
    console.log("Request body: " + util.inspect(req.body, false, null, true))

    try {
        const result = await pool.query('INSERT into raspberry (id_pi, model, location, ip, interface, destination_ping) \
        VALUES ($1, $2, $3, $4, $5, $6)', [req.body.id, 
            req.body.model, 
            req.body.location, 
            req.body.ip, 
            req.body.interface,
            req.body.gateway]
        )
    }
    catch (error) {
        console.log("Error on insertion: " + error.message)
    }

    res.send("Request received and ok!")
});

module.exports = router