require('dotenv').config();

const express = require('express');
const axios = require('axios');
const pool = require("../db");
const router = express.Router();
const util = require('util');

router.get(`/raspberries`, async(req, res) => {
    try {
        const allPies = await pool.query("SELECT * FROM raspberry");
        res.send(JSON.stringify(allPies.rows));
    }
    catch (err) {
        console.log(err.message);
    }    
})

router.get(`/raspberries/:pi_id`, async(req, res) => {
    try {
        const id = req.params.pi_id;
        const piEvents = await pool.query(("SELECT * FROM events JOIN raspberry \
                                            ON events.id_pi = raspberry.id_pi \
                                            WHERE events.id_pi=$1"), [id]);
        console.log(piEvents);
        res.send(JSON.stringify(piEvents.rows));
    }
    catch (err) {
        console.log(err.message);
    }    
})

router.get(`/events`, async(req, res) => {
    try {
        const allEvents = await pool.query("SELECT * FROM events JOIN raspberry ON events.id_pi = raspberry.id_pi");
        allEvents.rows.forEach(row => {
            row.connected = (row.packet_loss != 100)
        })
        res.send(JSON.stringify(allEvents.rows));
    }
    catch (err) {
        console.log(err.message);
    }    
})

router.get(`/performance`, async(req, res) => {
    console.log("Getting performance on API");
    try {
        const allEvents = await pool.query("SELECT * FROM performance");
        res.send(JSON.stringify(allEvents.rows));
    }
    catch (err) {
        console.log(err.message);
    }    
})


router.get(`/performance/:id_pi`, async(req, res) => {
    try {
        const id_pi = req.params.new_dest_ping
        const allEvents = await pool.query("SELECT * FROM performance \
        JOIN raspberry ON performance.id_pi = raspberry.id_pi \
        WHERE id_pi=(%s)", [id_pi]);
        res.send(JSON.stringify(allEvents.rows));
    }
    catch (err) {
        console.log(err.message);
    }    
})

router.get(`/delete-raspberries`, async(req, res) => {
    try {
        const allPies = await pool.query("DELETE FROM raspberry");
        res.send(JSON.stringify(allPies.rows));
    }
    catch (err) {
        console.log(err.message);
    }    
})

router.get(`/update-dest-ping/:new_dest_ping`, async(req, res) => {
    //const new_dest_ping = "10.0.2.15"
    const new_dest_ping = req.params.new_dest_ping
    const url = `http://${process.env.PROBE_IP}:${process.env.PROBE_PORT}/monitor/change-dest-ip/${new_dest_ping}`
    var pi_res
    try {
        pi_res = await axios.put(url)
    }
    catch (err) {
        console.log(err.response.status)
    }    
    res.sendStatus(pi_res.status)
})

router.get(`/events/update/:id`, async(req, res) => {
    const id_pi = req.params.id
    const ip = await pool.query("SELECT ip FROM raspberry \
        WHERE id_pi=(%s)", [id_pi]);
    const url = `http://${ip}:${process.env.PROBE_PORT}/monitor/ping/`
    var pi_res
    try {
        pi_res = await axios.get(url)
    }
    catch (err) {
        console.log(err.response.status)
    }    
    res.sendStatus(pi_res.status)
})

module.exports = router