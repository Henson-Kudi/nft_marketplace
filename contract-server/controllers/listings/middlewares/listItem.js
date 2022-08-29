const pool = require("../../../database")
const newHistory = require("../../../utils/newHistory")

module.exports = async (req, res) => {
    const data = req.body

    data.value = data.price_decimal

    const listQs = `
        INSERT INTO listings(
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
            start_time,
            end_time,
            collection_id
        )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
    `
    const auctionQs = `
        INSERT INTO listings(
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
            start_time,
            end_time,
            collection_id
        )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
    `

    const updateQs = `
        UPDATE nfts SET
            status = $1,
            updated_at = CURRENT_DATE,
            approved = true,
            price = $2,
            price_decimal = $3,
            measurement_unit = $4,
            start_time = $5,
            end_time = $6
        WHERE
            token_id = $7 AND
            nft_address = $8
    `

    try {
        await pool.query(updateQs, [
            data.status,
            data.price,
            data.price_decimal,
            data.measurement_unit,
            data.start_time,
            data.end_time,
            data.token_id,
            data.nft_address,
        ])

        await newHistory(data)

        if (data.status === "listed") {
            await pool.query(listQs, [
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
                data.start_time,
                data.end_time,
                data.collection_id,
            ])
        }

        if (data.status === "auctioned") {
            await pool.query(auctionQs, [
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
                data.start_time,
                data.end_time,
                data.collection_id,
            ])
        }

        return res.status(200).json({
            message: `NFT Listed for ${data.status === "listed" ? "sale" : "auction"}`,
            status: 200,
        })
    } catch (err) {
        console.log(err)

        return res.status(500).json({ ...err, status: 500, message: "Server error" })
    }
}
