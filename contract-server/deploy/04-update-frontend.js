const frontEndAbiLocation = "../frontend-nextjs/constants/"
const frontEndContractsFile = "../frontend-nextjs/constants/networkMapping.json"
// const ethers = require("ethers")

require("dotenv").config()
const fs = require("fs")
const { network, ethers } = require("hardhat")

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    fs.writeFileSync(
        `${frontEndAbiLocation}NftMarketplace.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    )

    const nftToken = await ethers.getContract("NftToken")
    fs.writeFileSync(
        `${frontEndAbiLocation}NftToken.json`,
        nftToken.interface.format(ethers.utils.FormatTypes.json)
    )
}

async function updateContractAddresses() {
    const chainId = network.config.chainId.toString()

    const nftMarketplace = await ethers.getContract("NftMarketplace")

    const nftToken = await ethers.getContract("NftToken")

    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))

    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["NftMarketplace"].includes(nftMarketplace.address)) {
            contractAddresses[chainId]["NftMarketplace"].push(nftMarketplace.address)
        }

        if (!contractAddresses[chainId]["NftToken"].includes(nftToken.address)) {
            contractAddresses[chainId]["NftToken"].push(nftToken.address)
        }
    } else {
        contractAddresses[chainId] = {
            NftMarketplace: [nftMarketplace.address],
            NftToken: [nftToken.address],
        }
    }

    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]
