const path = require("path")
const pool = require("../../../database")
const { storeFileFromFs } = require("../../../scripts/upload-to-pinata")
const { unlinkFile } = require("../../file-uploads/middlewares/saveToPinata")

module.exports = async (req, res) => {
    const body = req.body.data
    const data = JSON.parse(body)
    const logo = req.files.logo
    const featured = req.files.featured
    const banner = req.files.banner

    const qs = `
        INSERT INTO
            collections(
                name,
                description,
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
                category_id
            )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
    `

    try {
        if (!logo) {
            throw "please add an image"
        }
        const logoPath = path.join(process.cwd(), "images", logo.name)

        const logoRes = await storeFileFromFs(logoPath)

        data.logo = `ipfs://${logoRes.IpfsHash}`

        await unlinkFile(logoPath)

        if (banner) {
            const bannerPath = path.join(process.cwd(), "images", banner.name)
            const bannerRes = await storeFileFromFs(bannerPath)

            data.banner = `ipfs://${bannerRes.IpfsHash}`

            await unlinkFile(bannerPath)
        }

        if (featured) {
            const featuredPath = path.join(process.cwd(), "images", featured.name)
            const featuredRes = await storeFileFromFs(featuredPath)

            data.featured_image = `ipfs://${featuredRes.IpfsHash}`

            await unlinkFile(featuredPath)
        }

        const { rows } = await pool.query(qs, [
            data.name,
            data.description,
            data.logo,
            data.featured_image,
            data.banner,
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
        ])
        console.log("success")
        res.status(200).json({ message: "Success", code: 200, data: rows[0] })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
