const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});
pool.on('connection', function (connection) {
    console.log('New connection made with ID:', connection.threadId);
});
// Uncomment the following lines to debug connection issues - following commands can be run in MySQL CLI
// used to check status of connections like how many connections are open, etc.
//SHOW STATUS LIKE 'Threads_connected';
// SHOW PROCESSLIST;
module.exports = pool.promise();
