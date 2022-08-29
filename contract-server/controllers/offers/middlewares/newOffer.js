const newHistory = require("../../../utils/newHistory")
const pool = require("../../../database")

module.exports = async (req, res) => {
    const data = req.body

    data.value = data.price_decimal

    const offerQs = `
        INSERT INTO offers(
            block_hash,
            block_timestamp,
            transaction_hash,
            transaction_index,
            token_decimal,
            token_id,
            log_index,
            block_number,
            function_name,
            function_desc,
            marketplace_address,
            nft_address,
            price,
            price_decimal,
            measurement_unit,
            owner,
            offerer,
            deadline,
            collection_id
        )
        VALUES(
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
        )
        RETURNING *
    `

    try {
        const { rows: result } = await pool.query(offerQs, [
            data.block_hash,
            data.block_timestamp,
            data.transaction_hash,
            data.transaction_index,
            data.token_decimal,
            data.token_id,
            data.log_index,
            data.block_number,
            data.function_name,
            data.function_desc,
            data.marketplace_address,
            data.nft_address,
            data.price,
            data.price_decimal,
            data.measurement_unit,
            data.owner,
            data.offerer,
            data.deadline,
            data.collection_id,
        ])

        await newHistory(data)

        return res.status(200).json({ message: "offer made successfully", status: 200, result })
    } catch (err) {
        console.log(err)

        return res.status(500).json(err)
    }
}


