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
    console.log(`[POOL] New connection: ID = ${connection.threadId}`);
});

const db = pool.promise();

// 🔧 Logging Wrapper
const queryWithLog = async (sql, params = []) => {
    const start = Date.now();
    try {
        const [rows] = await db.query(sql, params);
        const duration = Date.now() - start;

        console.log(`[SQL] ${sql}`);
        console.log(`[PARAMS] ${JSON.stringify(params)}`);
        console.log(`[TIME] ${duration} ms\n`);

        return rows;
    } catch (err) {
        console.error(`[ERROR] ${err.message}`);
        throw err;
    }
};

module.exports = queryWithLog;
