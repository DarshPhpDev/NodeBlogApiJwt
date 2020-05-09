const mysql = require('mysql')
const dotenv = require('dotenv')
dotenv.config()
// create connection
const DB = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  charset: process.env.DB_CHARSET
})
DB.connect((err) => {
  if (err) throw err
  else console.log('Mysql Connected')
})

module.exports = DB
