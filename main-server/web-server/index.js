const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const version = require('./version.js');
const axios = require('axios');
const util = require('util');

//middleware
app.use(cors());
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}));
app.use(express.static('../webapp/build'));

app.get(`/${version}/facts`, async (req, res) => {
    try {
        const allFacts = await pool.query("SELECT * FROM data");
        res.send(JSON.stringify(allFacts.rows));
    } catch (err) {
        console.log(err.message);
    }
});

app.get(`/${version}/devices`, async (req, res) => {
    try {
        const allFacts = await pool.query("SELECT * FROM raspberry NATURAL JOIN last_updated NATURAL JOIN d_date");
        res.send(JSON.stringify(allFacts.rows));
    } catch (err) {
        console.log(err.message);
    }
});

app.get(`/${version}/facts/:device_id`, async (req, res) => {
    try {
        const allFacts = await pool.query(`SELECT * FROM data WHERE id_pi = '${req.params.device_id}'`);
        res.send(JSON.stringify(allFacts.rows));
    } catch (err) {
        console.log(err.message);
    }
});

// =================================== MY CODE BELOW ================================================

const probes = require('./probes/router')
app.use('/api/probes', probes)

const backoffice = require('./backoffice/router')
app.use('/api', backoffice)

app.listen(8080, () => {
    console.log("Server started on port 8080");
});
  