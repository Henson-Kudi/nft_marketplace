require("dotenv").config()
const pg = require("pg")

const { DATABASE_NAME, DATABASE_HOST, POSTGRES_USER, POSTGRES_PASSWORD } = process.env

module.exports = new pg.Pool({
    database: DATABASE_NAME,
    host: DATABASE_HOST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    port: 5432,
})
