const Router = require("express").Router()
const path = require("path")
const expressFileUpload = require("express-fileupload")
const { savetoFs, saveJSONToIpfs } = require("../../scripts/upload-to-pinata")
const { saveToPinata } = require("./middlewares/saveToPinata")

Router.post("/nft-data", expressFileUpload({ createParentPath: true }), savetoFs, saveToPinata)
Router.post("/json", async (req, res) => {
    const data = req.body

    try {
        const response = await saveJSONToIpfs(data)

        console.log("success")

        res.status(200).json({ status: 200, message: "uploaded data successfully", data: response })
    } catch (err) {
        console.log(err)

        err.message = "Server  error"

        res.status(500).json(err)
    }
})

module.exports = Router
