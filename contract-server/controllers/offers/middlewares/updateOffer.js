const newHistory = require("../../../utils/newHistory")
const pool = require("../../../database")

module.exports = async (req, res) => {
    const data = req.body

    data.value = data.price_decimal

    const updateQs = `
        UPDATE offers SET
            price = $1,
            price_decimal = $2,
            measurement_unit = $3,
            deadline = $4
        WHERE
            token_id = $5 AND nft_address = $6 AND offerer = $7
        RETURNING *
    `

    try {
        const { rows: result } = await pool.query(updateQs, [
            data.price,
            data.price_decimal,
            data.measurement_unit,
            data.deadline,
            data.token_id,
            data.nft_address,
            data.offerer
        ])

        await newHistory(data)

        return res.status(200).json({ message: "Offer updated successfully", status: 200, result })
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}
