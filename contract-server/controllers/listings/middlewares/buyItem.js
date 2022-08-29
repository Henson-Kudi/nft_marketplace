const pool = require("../../../database")
const newHistory = require("../../../utils/newHistory")

module.exports = async (req, res) => {
    const data = req.body

    data.value = data.price_decimal

    const updateQs = `
        UPDATE nfts SET
            status = 'unlisted',
            updated_at = CURRENT_DATE,
            approved = false,
            start_time = null,
            end_time = null,
            owner = $1
        WHERE
            token_id = $2 AND
            nft_address = $3
    `

    const deleteQs = `
        DELETE FROM listings WHERE nft_address = $1 AND token_id = $2
    `

    const deleteAuctionQs = `
        DELETE FROM auctions WHERE nft_address = $1 AND token_id = $2
    `

    const updateOffersQs = `
        UPDATE offers
        SET owner = $1
        WHERE
            token_id = $2 AND
            nft_address = $3
    `

    try {
        await pool.query(updateQs, [data.owner, data.token_id, data.nft_address])

        await pool.query(updateOffersQs, [data.owner, data.token_id, data.nft_address])

        await newHistory(data)

        if (data.status === "listed") {
            await pool.query(deleteQs, [data.nft_address, data.token_id])
        }

        if (data.status === "auctioned") {
            await pool.query(deleteAuctionQs, [data.nft_address, data.token_id])
        }

        return res.status(200).json({ message: "NFT bought. Check your items.", status: 200 })
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}
