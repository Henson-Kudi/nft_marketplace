const newHistory = require("../../../utils/newHistory")
const pool = require("../../../database")

module.exports = async (req, res) => {
    const data = req.body

    data.value = data.price_decimal

    const qs = `
        INSERT INTO nfts(
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
            creator,
            collection_id
        )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *
    `

    // block_hash
    // block_timestamp
    // transaction_hash
    // transaction_index
    // token_decimal
    // token_id
    // log_index
    // block_number
    // function_name
    // function_desc
    // marketplace_address
    // nft_address
    // price
    // price_decimal
    // measurement_unit
    // owner
    // creator
    // start_time
    // end_time
    // collection_id
    // from_address,
    // to_address,

    try {
        const { rows } = await pool.query(qs, [
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
            data.creator,
            data.collection_id,
        ])

        await newHistory(data).catch((err) => {
            console.log(err)
            throw err
        })

        return res.status(200).json({ status: 200, message: "Success", data: rows })
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}
