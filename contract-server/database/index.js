require("dotenv").config()
const pg = require("pg")

const { DATABASE_NAME, DATABASE_HOST, POSTGRES_USER, POSTGRES_PASSWORD, NODE_ENV } = process.env

// const connectionString = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DATABASE_HOST}:5432/nft_marketplace`

module.exports = new pg.Pool({
    database: DATABASE_NAME,
    host: DATABASE_HOST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    port: 5432,
})
