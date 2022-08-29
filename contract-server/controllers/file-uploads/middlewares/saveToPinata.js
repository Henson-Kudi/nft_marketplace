const { storeFileFromFs, saveJSONToIpfs } = require("../../../scripts/upload-to-pinata")
const path = require("path")
const fs = require("fs")

const unlinkFile = async (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log(err)
            return
        }

        console.log("removed file")
    })
}

const saveToPinata = async (req, res) => {
    const body = req.body.data
    const data = JSON.parse(body)

    const imageFile = req.files.image
    const audioFile = req.files.audio
    const videoFile = req.files.video

    console.log(data.name)

    try {
        if (!imageFile) {
            throw { message: "Please add an image" }
        }

        const imageFilePath = path.join(process.cwd(), "images", imageFile.name)

        let responses = { image: null, audio: null, video: null }

        const response = await storeFileFromFs(imageFilePath)

        data.image = `ipfs://${response.IpfsHash}`

        await unlinkFile(imageFilePath)

        if (audioFile) {
            const audioFilePath = path.join(process.cwd(), "audios", audioFile.name)

            const response = await storeFileFromFs(audioFilePath)

            data.audio = `ipfs://${response.IpfsHash}`

            await unlinkFile(audioFilePath)
        }

        if (videoFile) {
            const videoFilePath = path.join(process.cwd(), "videos", videoFile.name)

            const response = await storeFileFromFs(videoFilePath)

            data.video = `ipfs://${response.IpfsHash}`

            await unlinkFile(videoFilePath)
        }

        const nftjson = await saveJSONToIpfs({ ...data })

        console.log("saved")

        res.status(200).json({ status: 200, message: "Uploaded data successfully", data: nftjson })
    } catch (err) {
        console.log(err)
        res.status(500).json({ err })
    }
}

module.exports = { unlinkFile, saveToPinata }
