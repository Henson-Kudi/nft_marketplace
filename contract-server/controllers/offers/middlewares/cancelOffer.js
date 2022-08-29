const newHistory = require("../../../utils/newHistory")
const pool = require("../../../database")

module.exports = async (req, res) => {
    const data = req.body

    data.value = data.price_decimal

    const cancelQs = `DELETE FROM offers WHERE token_id = $1 AND nft_address = $2 AND offerer = $3`

    try {
        await pool.query(cancelQs, [data.token_id, data.nft_address, data.offerer])

        await newHistory(data)

        return res.status(200).json({ message: "Offer cancelled.", status: 200 })
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}
