const buyItem = require("./middlewares/buyItem")
const cancelListing = require("./middlewares/cancelListing")
const listItem = require("./middlewares/listItem")
const updateListing = require("./middlewares/updateListing")

const Router = require("express").Router()

Router.route("/list-item").post(listItem).put(updateListing)

Router.post("/buy-item", buyItem)

Router.post("/cancel-listing", cancelListing)

module.exports = Router
