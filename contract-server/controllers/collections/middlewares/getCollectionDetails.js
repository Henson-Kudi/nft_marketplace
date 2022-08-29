const pool = require("../../../database")

module.exports = async (req, res) => {
    const { collection_id } = req.params

    const collectionQs = `
        SELECT
            collections.id,
            collections.name,
            collections.description,
            collections.logo,
            collections.featured_image,
            collections.banner,
            collections.url_format,
            collections.creator,
            collections.owner,
            collections.website,
            collections.discord,
            collections.telegram,
            collections.instagram,
            collections.facebook,
            collections.youtube,
            collections.category_id,
            MAX(nfts.price_decimal) AS highest_price,
            MIN(nfts.price_decimal) AS lowest_price,
            count(*) AS total_items,
            AVG(nfts.price_decimal) As average_price,
            COUNT(DISTINCT nfts.owner) AS total_owners
        FROM
            collections
        JOIN
            nfts
        ON
            nfts.collection_id = collections.id
        WHERE collections.id = $1
        GROUP BY collections.id
    `
    const nftsQs = `
        SELECT
            id,
            token_id,
            marketplace_address,
            nft_address,
            price,
            price_decimal,
            measurement_unit,
            owner,
            creator,
            approved,
            start_time,
            end_time,
            status,
            collection_id
            

        FROM
            nfts 
        WHERE
            collection_id = $1
        GROUP BY id
    `

    try {
        const {
            rows: [collection],
        } = await pool.query(collectionQs, [collection_id])

        const { rows: nfts } = await pool.query(nftsQs, [collection_id])

        return res.status(200).json({ collection, nfts })
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}
