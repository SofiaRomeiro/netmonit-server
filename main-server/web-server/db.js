const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "postgres",
    host: "172.10.0.10", // docker container IP address
    port: 5432,
    database: "main_db"
});

module.exports = pool;