const pinataSDK = require("@pinata/sdk")
const fs = require("fs")
const path = require("path")

const pinataApiKey = process.env.PINATA_API_KEY || ""
const pinataApiSecret = process.env.PINATA_API_SECRET || ""
const pinata = pinataSDK(pinataApiKey, pinataApiSecret)

async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath)
    const files = fs.readdirSync(fullImagesPath)
    let responses = []
    for (fileIndex in files) {
        const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`)
        try {
            const response = await pinata.pinFromFS(readableStreamForFile)
            responses.push(response)
        } catch (error) {
            console.log(error)
        }
    }
    return { responses, files }
}

async function savetoFs(req, res, next) {
    const imageFile = req.files.image
    const audioFile = req.files.audio
    const videoFile = req.files.video

    try {
        if (!imageFile) {
            throw { message: "Please add an image" }
        }

        const imageFilePath = path.join(process.cwd(), "images", imageFile.name)

        if (audioFile) {
            const audioFilePath = path.join(process.cwd(), "audios", audioFile.name)

            await audioFile.mv(audioFilePath, async (err) => {
                if (!err) {
                    console.log("moved audio")
                } else {
                    console.log(err)
                    throw err
                }
            })
        }

        if (videoFile) {
            const videoFilePath = path.join(process.cwd(), "videos", videoFile.name)

            await videoFile.mv(videoFilePath, async (err) => {
                if (!err) {
                    console.log("moved video")
                } else {
                    console.log(err)
                    throw err
                }
            })
        }

        await imageFile.mv(imageFilePath, async (err) => {
            if (!err) {
                console.log("moved image")
                next()
            } else {
                console.log(err)
                throw err
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ err, status: 500 })
    }
}

async function storeFileFromFs(filePath) {
    try {
        const response = await pinata.pinFromFS(filePath)
        return response
    } catch (error) {
        console.log(error)
    }
}

async function saveJSONToIpfs(metadata) {
    try {
        const response = await pinata.pinJSONToIPFS(metadata)
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
    return null
}

module.exports = { storeImages, saveJSONToIpfs, storeFileFromFs, savetoFs }
