const { network, ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let tokenId

    const TOKEN_URI =
        "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json"

    // Basic NFT
    const nftToken = await ethers.getContract("NftToken", deployer)

    const nftTokenMintTx = await nftToken.mintNft(TOKEN_URI)

    const txRcp = await nftTokenMintTx.wait(1)

    tokenId = txRcp.events[0].args.tokenId.toString()

    console.log(`NFT Token index ${tokenId} tokenURI: ${await nftToken.tokenURI(1)}`)

    // approve marketplace
}
module.exports.tags = ["all", "mint"]
