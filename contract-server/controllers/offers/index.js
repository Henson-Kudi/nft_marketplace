const acceptOffer = require("./middlewares/acceptOffer")
const cancelOffer = require("./middlewares/cancelOffer")
const newOffer = require("./middlewares/newOffer")
const rejectOffer = require("./middlewares/rejectOffer")
const updateOffer = require("./middlewares/updateOffer")

const Router = require("express").Router()

Router.route("/").post(newOffer).put(updateOffer)

Router.post("/cancel-offer", cancelOffer)

Router.post("/accept-offer", acceptOffer)

Router.post("/reject-offer", rejectOffer)

module.exports = Router
