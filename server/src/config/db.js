const mysql = require('mysql2/promise')
module.exports = mysql.createPool( {
    host: process.env.DB_HOST || 'db', port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER || 'root', password: process.env.DB_PASS || 'root', database: process.env.DB_NAME || 'shopdb', waitForConnections: true, connectionLimit: 10, charset: 'utf8mb4'
})
