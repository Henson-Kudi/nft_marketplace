require("dotenv").config()
const express = require("express")
const path = require("path")

const pool = require("./database")

const uploads = require("./controllers/file-uploads")

const collections = require("./controllers/collections")

const nfts = require("./controllers/nfts")

const listings = require("./controllers/listings")

const offers = require("./controllers/offers")

const app = express()

const PORT = process.env.PORT || 5000

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, auth-token, Authorization, Accept"
    )
    res.header("Access-Control-Allow-Credentials", true)
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")

    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
        return res.status(200).json({})
    }
    next()
})

app.use(express.urlencoded({ extended: true }))

app.use(express.static("public"))

app.use(express.json())

app.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, "public", "build/index.html"))
})

app.use("/api/uploads", uploads)

app.use("/api/collections", collections)

app.use("/api/nfts", nfts)

app.use("/api/listings", listings)

app.use("/api/offers", offers)

app.get("/api/categories", async (req, res) => {
    const qs = `SELECT * FROM collection_categories`

    try {
        const { rows: data } = await pool.query(qs)

        return res.status(200).json(data)
    } catch (err) {
        console.log(err)

        return res.status(500).json(err)
    }
})

app.get("/api/categories/:categoryId", async (req, res) => {
    const { categoryId } = req.params

    const qs = `SELECT * FROM collection_categories WHERE id = $1`

    try {
        const {
            rows: [data],
        } = await pool.query(qs, [categoryId])

        return res.status(200).json(data)
    } catch (err) {
        console.log(err)

        return res.status(500).json(err)
    }
})

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`)
})
