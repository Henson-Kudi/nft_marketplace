const pool = require("../database")

module.exports = async (data = {}) => {
    const qs = `
        INSERT INTO
            nft_history(
                block_hash,
                block_timestamp,
                transaction_hash,
                transaction_index,
                block_number,
                token_decimal,
                token_id,
                log_index,
                function_name,
                function_desc,
                nft_address,
                marketplace_address,
                from_address,
                to_address,
                value,
                collection_id
            )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *
    `

    try {
        const { rows } = await pool.query(qs, [
            data.block_hash,
            data.block_timestamp,
            data.transaction_hash,
            data.transaction_index,
            data.block_number,
            data.token_decimal,
            data.token_id,
            data.log_index,
            data.function_name,
            data.function_desc,
            data.nft_address,
            data.marketplace_address,
            data.from_address,
            data.to_address,
            data.value,
            data.collection_id,
        ])
        return rows
    } catch (err) {
        console.log(err)
        return err
    }
}
