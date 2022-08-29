const Router = require("express").Router()
const pool = require("../../database")
const approveNft = require("./middlewares/approveNft")
const mintNft = require("./middlewares/mintNft")

Router.route("/").get(async (req, res) => {
    const qs = `SELECT * FROM nfts`

    try {
        const { rows: nfts } = await pool.query(qs)
        return res.status(200).json(nfts)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})

Router.get("/:nftAddress/:collectionId/:tokenId", async (req, res) => {
    const { nftAddress, collectionId, tokenId } = req.params
    const qs = `
        SELECT * FROM nfts WHERE token_id = $1 AND nft_address = $2 AND collection_id = $3
    `

    const offersQs = `
        SELECT * FROM offers WHERE token_id = $1 AND nft_address = $2
    `

    const historyQs = `
        SELECT * FROM nft_history WHERE token_id = $1 AND nft_address = $2
    `

    try {
        const {
            rows: [nft],
        } = await pool.query(qs, [Number(tokenId), nftAddress, collectionId])

        const { rows: offers } = await pool.query(offersQs, [Number(tokenId), nftAddress])

        const { rows: activities } = await pool.query(historyQs, [Number(tokenId), nftAddress])

        return res.status(200).json({ nft, offers, activities })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Error", err })
    }
})

Router.post("/mint-nft", mintNft)

Router.post("/approve-nft", approveNft)

module.exports = Router
