const path = require("path")
const expressFileUpload = require("express-fileupload")
const addNewCollection = require("./middlewares/addNewCollection")
const getCollectionDetails = require("./middlewares/getCollectionDetails")
const getCollections = require("./middlewares/getCollections")
const updateCollection = require("./middlewares/updateCollection")

const pool = require("../../database")

const Router = require("express").Router()

Router.route("/")
    .get(getCollections)
    .post(
        expressFileUpload({ createParentPath: true }),
        async (req, res, next) => {
            const logo = req.files.logo
            const featured = req.files.featured
            const banner = req.files.banner

            if (!logo) {
                throw { message: "Please submit a logo" }
            }
            const logoPath = path.join(process.cwd(), "images", logo.name)

            if (featured) {
                const featuredPath = path.join(process.cwd(), "images", featured.name)
                await featured.mv(featuredPath, (err) => {
                    if (err) {
                        throw "unexpected error occured"
                    }
                })
            }

            if (banner) {
                const bannerPath = path.join(process.cwd(), "images", banner.name)
                await banner.mv(bannerPath, (err) => {
                    if (err) {
                        throw "unexpected error occured"
                    }
                })
            }

            await logo.mv(logoPath, (err) => {
                if (!err) {
                    console.log("Files moved")
                    next()
                }
            })
        },
        addNewCollection
    )

Router.get("/top-collections", async (req, res) => {
    const qs = `
            SELECT
                collections.name,
                collections.id,
                collections.logo,
                MAX(nfts.price_decimal) AS max_price,
                MIN(nfts.price_decimal) AS min_price,
                AVG(nfts.price_decimal) AS average,
                nfts.price_decimal
            FROM collections
            JOIN nfts
                ON nfts.collection_id = collections.id
            GROUP BY
                collections.id,
                collections.name,
                nfts.price_decimal
            ORDER BY
                MAX(nfts.price);
        `

    try {
        const { rows: data } = await pool.query(qs)

        return res.status(200).json({ status: 200, data })
    } catch (err) {
        return res.status(500).json({ ...err, status: 500 })
    }
})

Router.route("/:collection_id").get(getCollectionDetails).put(updateCollection)

module.exports = Router
