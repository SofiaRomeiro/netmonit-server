const Pool = require("pg").Pool;

const pool = new Pool({
    user: DBUSER,
    password: DBPASSWORD,
    host: DOCKER_IP, // docker container IP address
    port: DBPORT,
    database: DBNAME
});

module.exports = pool;