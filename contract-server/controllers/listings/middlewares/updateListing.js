const pool = require("../../../database")
const newHistory = require("../../../utils/newHistory")

module.exports = async (req, res) => {
    const data = req.body

    data.value = data.price_decimal

    const updateQs = `
        UPDATE nfts SET
            price = $1,
            price_decimal = $2
        WHERE
            token_id = $3 AND
            nft_address = $4
    `

    const updateListingQs = `
        UPDATE listings SET
            price = $1,
            price_decimal = $2
        WHERE
            token_id = $3 AND
            nft_address = $4
    `
    const updateAuctionQs = `
        UPDATE auctions SET
            price = $1,
            price_decimal = $2
        WHERE
            token_id = $5 AND
            nft_address = $6
    `

    try {
        await pool.query(updateQs, [
            data.price,
            data.price_decimal,
            data.token_id,
            data.nft_address,
        ])

        await newHistory(data)

        if (data.status === "listed") {
            await pool.query(updateListingQs, [
                data.price,
                data.price_decimal,
                data.token_id,
                data.nft_address,
            ])
        }

        if (data.status === "auctioned") {
            await pool.query(updateAuctionQs, [
                data.price,
                data.price_decimal,
                data.token_id,
                data.nft_address,
            ])
        }

        return res.status(200).json({ message: "Listing updated", status: 200 })
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}
