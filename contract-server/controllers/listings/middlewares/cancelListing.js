const pool = require("../../../database")
const newHistory = require("../../../utils/newHistory")

module.exports = async (req, res) => {
    const data = req.body

    data.value = data.price_decimal

    const updateQs = `
        UPDATE nfts SET
            status = 'unlisted',
            updated_at = CURRENT_DATE
        WHERE
            token_id = $1 AND
            nft_address = $2
    `

    const deleteQs = `
        DELETE FROM listings WHERE nft_address = $1 AND token_id = $2
    `

    const deleteAuctionQs = `
        DELETE FROM auctions WHERE nft_address = $1 AND token_id = $2
    `

    try {
        await pool.query(updateQs, [data.token_id, data.nft_address])

        await newHistory(data)

        if (data.status === "listed") {
            await pool.query(deleteQs, [data.nft_address, data.token_id])
        }

        if (data.status === "auctioned") {
            await pool.query(deleteAuctionQs, [data.nft_address, data.token_id])
        }

        return res.status(200).json({ message: "Listing cancelled", status: 200 })
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}
