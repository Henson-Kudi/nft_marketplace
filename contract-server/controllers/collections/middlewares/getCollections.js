const pool = require("../../../database")

module.exports = async (req, res) => {
    const qs = `
        SELECT 
            collections.id,
            collections.name,
            collections.description,
            logo,
            featured_image,
            banner,
            url_format,
            creator,
            owner,
            website,
            discord,
            telegram,
            instagram,
            facebook,
            youtube,
            category_id,
            collection_categories.name AS category_name
        FROM
            collections
        LEFT JOIN
            collection_categories
            ON
                collection_categories.id = collections.category_id;
    `

    try {
        const { rows: collections } = await pool.query(qs)

        return res.status(200).json(collections)
    } catch (err) {
        console.log(err)

        return res.status(500).json(err)
    }
}
