const pool = require("../../../database")
module.exports = async (req, res) => {
    const data = req.body
    const { collection_id } = req.params

    const qs = `
        UPDATE
            collections
        SET
            name = $1,
            updated_at = CURRENT_DATE,
            description = $2,
            logo = $3,
            cover = $4,
            url_format = $5,
            creator = $6,
            owner = $7,
            website = $8,
            discord = $9,
            telegram = $10,
            instagram = $11,
            facebook = $12,
            youtube = $13,
            category_id = $14
        
        WHERE id = $15

        RETURNING *
    `
    try {
        const { rows } = await pool.query(qs, [
            data.name,
            data.description,
            data.logo,
            data.cover,
            data.url_format,
            data.creator,
            data.owner,
            data.website,
            data.discord,
            data.telegram,
            data.instagram,
            data.facebook,
            data.youtube,
            data.category_id,
            collection_id,
        ])

        return res.status(200).json(rows[0])
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}
