require('dotenv').config();
const Pool = require("pg").Pool;

const pool = new Pool({
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.DOCKER_IP, // docker container IP address
    port: process.env.DBPORT,
    database: process.env.DBNAME
});

module.exports = pool;