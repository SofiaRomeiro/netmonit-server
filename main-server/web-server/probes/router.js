require('dotenv').config();

const express = require('express');
const pool = require("../db");
const router = express.Router();
const util = require('util');

function insertion_error(type, err, res) {
    console.log("Error on insertion: " + err.message);
    return res.status(500).send('Error on inserting ' + type +': ' + err.message);
}

function insertion_success(res) {    
    console.log("[LOG Register] Message Sent!");
    return res.send('Success on Insertion');
}

router.post(`/update/monitor`, async(req, res) => {
    console.log("[/update/monitor]Request body: " + util.inspect(req.body, false, null, true))
    for (i=0; i < req.body.length; i++) {
        log = req.body[i]
        console.log("[/update/monitor] Jitter: " + log.jitter)
        try {
            if (log.jitter == "None") {                   
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
            else {
                const result = await pool.query('INSERT into events \
                (id_pi, creation_date, destination_ping, max, min, avg, packets_sent, packets_received, \
                    packet_loss, interface) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
                    [log.id_pi, 
                        log.creation_date, 
                        log.destination_ip, 
                        log.max, 
                        log.min,
                        log.avg,
                        log.packets_sent,
                        log.packets_received,
                        log.packet_loss,
                        log.interface]
                    )
            }
        }
        catch (error) {
            console.log("Error on insertion: " + error.message)
        }
    }    
    res.send("OK!")
})

router.post(`/update/performance/external`, async(req, res) => {
    console.log("[/update/performance/external] Request body: " + util.inspect(req.body, false, null, true))
    for (i=0; i < req.body.length; i++) {
        log = req.body[i]
        try {
            await pool.query('INSERT into externalPerformance \
            (id_pi, creation_date, upload_speed, download_speed, latency, \
                bytes_sent, bytes_received, destination_host)\
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                [
                    log.id_pi, 
                    log.creation_date, 
                    log.upload_speed, 
                    log.download_speed, 
                    log.latency,
                    log.bytes_sent,
                    log.bytes_received,
                    log.destination_host
                ]
            )
            return insertion_success(res)
        }
        catch (err) {
            return insertion_error("external performance", err, res)
        }
    }
})

router.post(`/update/performance/internal`, async(req, res) => {
    console.log("[/update/performance/internal] Request body: " + util.inspect(req.body, false, null, true))

    for (i=0; i < req.body.length; i++) {
        log = req.body[i]
        console.log(log.protocol)
        console.log(log.protocol == "UDP")
        try {
            if (log.protocol == "UDP") {
                await pool.query('INSERT into internalPerformance \
                    (id_pi, creation_date, protocol, bytes_sent, \
                    jitter, packet_loss, sent_Mbps, destination_host)\
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                    [
                        log.id_pi, 
                        log.creation_date, 
                        log.protocol, 
                        log.bytes_sent, 
                        log.jitter,
                        log.packet_loss,
                        log.sent_Mbps,
                        log.destination_host
                    ]
                )
            } 
            else {
                await pool.query('INSERT into internalPerformance \
                    (id_pi, creation_date, protocol, bytes_sent, bytes_received, \
                    sent_Mbps, received_Mbps, destination_host)\
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                    [
                        log.id_pi, 
                        log.creation_date, 
                        log.protocol, 
                        log.bytes_sent, 
                        log.bytes_received,
                        log.sent_Mbps,
                        log.received_Mbps,
                        log.destination_host
                    ]
                )
            }   
            return insertion_success(res) 
        } 
        catch (err) {
            return insertion_error("internal performance", err, res)
        }
    }
})

router.post(`/registration`, async (req, res) => {
    console.log("[/registration] Request body: " + util.inspect(req.body, false, null, true))

    try {
        await pool.query('INSERT into raspberry (id_pi, pi_name, model, pi_location, ip, interface, destination_ping) \
        VALUES ($1, $2, $3, $4, $5, $6, $7)', 
            [req.body.id, 
            req.body.name,
            req.body.model, 
            req.body.location, 
            req.body.ip, 
            req.body.interface,
            req.body.gateway
            ]
        )  
        return insertion_success(res)
    }
    catch (err) {
        return insertion_error("registration", err, res)
    }
});

module.exports = router