const pool = require("../../../database")
const newHistory = require("../../../utils/newHistory")
module.exports = async (req, res) => {
    const data = req.body

    data.value = data.price_decimal

    const qs = `UPDATE nfts SET approved = true WHERE nft_address = $1 AND token_id = $2 RETURNING *`

    try {
        const { rows } = await pool.query(qs, [data.nft_address, data.token_id])

        await newHistory(data)
        return res.status(200).json({ message: "Success", status: 200, rows })
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}
