const { assert } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NFT Token Unit Tests", function () {
          const TOKEN_URI =
              "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json"

          let tokenId, nftToken, deployer

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["nftToken"])
              nftToken = await ethers.getContract("NftToken")
          })

          it("Allows users to mint an NFT", async function () {
              const txResponse = await nftToken.mintNft(TOKEN_URI)

              const txRcp = await txResponse.wait(1)

              tokenId = txRcp.events[0].args.tokenId.toString()

              const tokenURI = await nftToken.tokenURI(tokenId)

              const tokenCounter = await nftToken.getTokenCounter()

              assert.equal(tokenCounter.toString(), tokenId)
              assert.equal(tokenURI, await nftToken.getokenURI(tokenId))
          })
      })
