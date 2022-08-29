const { assert, expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip()
    : describe("Tests for nft marketplace", async () => {
          const TOKEN_URI =
              "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json"
          const LISTING_PRICE = ethers.utils.parseEther("1")
          const nullAddress = "0x0000000000000000000000000000000000000000"
          const lowPrice = ethers.utils.parseEther("0.5")

          let tokenId, deployer, nftToken, marketplaceContract, marketplaceContractBuyer, player

          beforeEach(async () => {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              player = accounts[1]

              await deployments.fixture(["main"])

              nftToken = await ethers.getContract("NftToken", deployer)

              marketplaceContract = await ethers.getContract("NftMarketplace", deployer)

              marketplaceContractBuyer = await ethers.getContract("NftMarketplace", player)

              //   mint nft and approve marketplace
              const mintNft = await nftToken.mintNft(TOKEN_URI)
              const txRcp = await mintNft.wait(1)

              tokenId = txRcp.events[0].args.tokenId.toString()

              await nftToken.approve(marketplaceContract.address, tokenId)
          })

          it("Successfully list nft to marketplace", async () => {
              const approveTx = await nftToken.approve(marketplaceContract.address, tokenId)

              await approveTx.wait()

              const tx = await marketplaceContract.listItem(
                  nftToken.address,
                  tokenId,
                  LISTING_PRICE
              )

              await tx.wait(1)
              //   get token listings
              const listing = await marketplaceContract.getListing(nftToken.address, tokenId)

              assert.equal(deployer.address, listing.seller)
          })

          //   it("Reverts if marketplace is not approved to list token", async () => {
          //       await expect(
          //           marketplaceContract.listItem(nftToken.address, tokenId, LISTING_PRICE)
          //       ).to.be.revertedWith("")
          //   })

          it("Reverts if token is already listed", async () => {
              //   await nftToken.approve(marketplaceContract.address, tokenId)

              const tx = await marketplaceContract.listItem(
                  nftToken.address,
                  tokenId,
                  LISTING_PRICE
              )

              await expect(
                  marketplaceContract.listItem(nftToken.address, tokenId, LISTING_PRICE)
              ).to.be.revertedWith(`AlreadyListed("${nftToken.address}, ${tokenId}")` || "")
          })

          it("Successfully cancels a listing", async () => {
              //   await nftToken.approve(marketplaceContract.address, tokenId)

              const tx = await marketplaceContract.listItem(
                  nftToken.address,
                  tokenId,
                  LISTING_PRICE
              )

              await tx.wait(1)

              const cancel = await marketplaceContract.cancelListing(nftToken.address, tokenId)

              await cancel.wait(1)

              const listing = await marketplaceContract.getListing(nftToken.address, tokenId)

              assert.equal(nullAddress, listing.seller)
          })

          it("Reverts when buy is called with a low price", async () => {
              await nftToken.approve(marketplaceContract.address, tokenId)

              const tx = await marketplaceContract.listItem(
                  nftToken.address,
                  tokenId,
                  LISTING_PRICE
              )

              await tx.wait(1)

              await expect(
                  marketplaceContractBuyer.buyItem(nftToken.address, tokenId, { value: lowPrice })
              ).to.be.revertedWith(`PriceNotMet"(${nftToken.address}, ${tokenId}, ${lowPrice})"`)
          })

          it("Successfully buys nft", async () => {
              const tx = await marketplaceContract.listItem(
                  nftToken.address,
                  tokenId,
                  LISTING_PRICE
              )

              await tx.wait(1)

              const buyTx = await marketplaceContractBuyer.buyItem(nftToken.address, tokenId, {
                  value: LISTING_PRICE,
              })

              await buyTx.wait(1)

              const newOwner = await nftToken.ownerOf(tokenId)

              assert.equal(player.address, newOwner)
          })

          it("Successfully updates an nft price", async () => {
              const tx = await marketplaceContract.listItem(
                  nftToken.address,
                  tokenId,
                  LISTING_PRICE
              )

              await tx.wait(1)

              const updateTx = await marketplaceContract.updateListing(
                  nftToken.address,
                  tokenId,
                  lowPrice
              )

              await updateTx.wait(1)

              const newPrice = await marketplaceContract.getListing(nftToken.address, tokenId)

              assert.equal(lowPrice.toString(), newPrice.price.toString())
          })

          it("Successfully makes offer for listed nft", async () => {
              const deadline = Math.floor(new Date().getTime() / 1000) + 86400
              const txRcp = await marketplaceContract.listItem(
                  nftToken.address,
                  tokenId,
                  LISTING_PRICE
              )

              await txRcp.wait(1)

              const offerTx = await marketplaceContractBuyer.makeOffer(
                  nftToken.address,
                  deadline,
                  tokenId,
                  { value: lowPrice }
              )

              await offerTx.wait(1)

              const offer = await marketplaceContract.getOffer(nftToken.address, tokenId)

              assert.equal(player.address, offer.offerer)
          })
          it("Successfully makes offer for unlisted nft", async () => {
              const deadline = Math.floor(new Date().getTime() / 1000) + 86400

              const offerTx = await marketplaceContractBuyer.makeOffer(
                  nftToken.address,
                  deadline,
                  tokenId,
                  { value: lowPrice }
              )

              await offerTx.wait(1)

              const offer = await marketplaceContract.getOffer(nftToken.address, tokenId)

              assert.equal(player.address, offer.offerer)
          })

          it("Cannot make offer twice except previous offer is expired", async () => {
              const deadline = Math.floor(new Date().getTime() / 1000) + 86400

              const offerTx = await marketplaceContractBuyer.makeOffer(
                  nftToken.address,
                  deadline,
                  tokenId,
                  { value: lowPrice }
              )

              await offerTx.wait(1)

              await expect(
                  marketplaceContractBuyer.makeOffer(nftToken.address, deadline, tokenId, {
                      value: lowPrice,
                  })
              ).to.be.revertedWith(`Marketplace__OfferExist()`)
          })

          it("Cannot make offer on nonexisting tokenid", async () => {
              const deadline = Math.floor(new Date().getTime() / 1000) + 86400

              await expect(
                  marketplaceContractBuyer.makeOffer(nftToken.address, deadline, 3, {
                      value: lowPrice,
                  })
              ).to.be.reverted
          })

          it("Cannot make offer with zero price", async () => {
              const deadline = Math.floor(new Date().getTime() / 1000) + 86400

              await expect(
                  marketplaceContractBuyer.makeOffer(nftToken.address, deadline, tokenId)
              ).to.be.revertedWith(`PriceMustBeAboveZero()`)
          })

          it("Successfully updates an offer", async () => {
              const deadline = Math.floor(new Date().getTime() / 1000) + 86400

              const offerTx = await marketplaceContractBuyer.makeOffer(
                  nftToken.address,
                  deadline,
                  tokenId,
                  { value: lowPrice }
              )

              await offerTx.wait(1)

              const updatetx = await marketplaceContractBuyer.updateOffer(
                  nftToken.address,
                  tokenId,
                  { value: LISTING_PRICE }
              )

              await updatetx.wait(1)

              const offer = await marketplaceContract.getOffer(nftToken.address, tokenId)

              assert.equal(LISTING_PRICE.toString(), offer.price.toString())
          })

          it("Cannot update nonexisting offer", async () => {
              const deadline = Math.floor(new Date().getTime() / 1000) + 86400

              await expect(
                  marketplaceContractBuyer.updateOffer(nftToken.address, tokenId, {
                      value: LISTING_PRICE,
                  })
              ).to.be.revertedWith("Marketplace__NoOffer()")
          })

          it("Successfully cancels an offer", async () => {
              const deadline = Math.floor(new Date().getTime() / 1000) + 86400

              const offerTx = await marketplaceContractBuyer.makeOffer(
                  nftToken.address,
                  deadline,
                  tokenId,
                  {
                      value: lowPrice,
                  }
              )

              await offerTx.wait(1)

              const canceltx = await marketplaceContractBuyer.cancelOffer(nftToken.address, tokenId)

              await canceltx.wait(1)

              const offer = await marketplaceContractBuyer.getOffer(nftToken.address, tokenId)

              assert.equal(nullAddress, offer.offerer.toString())
          })

          it("Cannot cancel nonexisting offer", async () => {
              const deadline = Math.floor(new Date().getTime() / 1000) + 86400

              const offerTx = await marketplaceContractBuyer.makeOffer(
                  nftToken.address,
                  deadline,
                  tokenId,
                  {
                      value: lowPrice,
                  }
              )

              await offerTx.wait(1)

              await expect(
                  marketplaceContractBuyer.cancelOffer(nftToken.address, 6)
              ).to.be.revertedWith("Marketplace__NoOffer()")
          })

          it("Cannot cancel offer you didn't make", async () => {
              const deadline = Math.floor(new Date().getTime() / 1000) + 86400

              const offerTx = await marketplaceContractBuyer.makeOffer(
                  nftToken.address,
                  deadline,
                  tokenId,
                  {
                      value: lowPrice,
                  }
              )

              await offerTx.wait(1)

              await expect(
                  marketplaceContract.cancelOffer(nftToken.address, tokenId)
              ).to.be.revertedWith("You didn't make this offer")
          })

          it("Successfully accepts an offer", async () => {
              const deadline = Math.floor(new Date().getTime() / 1000) + 86400

              const offerTx = await marketplaceContractBuyer.makeOffer(
                  nftToken.address,
                  deadline,
                  tokenId,
                  {
                      value: lowPrice,
                  }
              )

              await offerTx.wait(1)
              const acceptTx = await marketplaceContract.acceptOffer(nftToken.address, tokenId)
              await acceptTx.wait(1)

              const listing = await marketplaceContract.getListing(nftToken.address, tokenId)
              const offer = await marketplaceContract.getOffer(nftToken.address, tokenId)
              const proceeds = await marketplaceContract.getProceeds(listing.seller)

              assert.equal(nullAddress, listing.seller)
              assert.equal(nullAddress, offer.offerer)
              assert.equal(lowPrice.toString(), proceeds.toString())
          })

          it("Cannot accept offer for not owned tokenid", async () => {
              const deadline = Math.floor(new Date().getTime() / 1000) + 86400

              const offerTx = await marketplaceContractBuyer.makeOffer(
                  nftToken.address,
                  deadline,
                  tokenId,
                  {
                      value: lowPrice,
                  }
              )

              await offerTx.wait(1)
              await expect(
                  marketplaceContractBuyer.acceptOffer(nftToken.address, tokenId)
              ).to.be.revertedWith(`NotOwner()`)
          })

          it("Successfully rejects an offer", async () => {
              const deadline = Math.floor(new Date().getTime() / 1000) + 86400

              const offerTx = await marketplaceContractBuyer.makeOffer(
                  nftToken.address,
                  deadline,
                  tokenId,
                  {
                      value: lowPrice,
                  }
              )
              await offerTx.wait(1)

              const rejecttx = await marketplaceContract.rejectOffer(nftToken.address, tokenId)
              await rejecttx.wait(1)

              const offer = await marketplaceContract.getOffer(nftToken.address, tokenId)

              assert.equal(nullAddress, offer.offerer)
          })

          it("Cannot reject an offer that doesn't exist", async () => {
              await expect(
                  marketplaceContract.rejectOffer(nftToken.address, tokenId)
              ).to.be.revertedWith("Marketplace__NoOffer()")
          })

          it("Successfully withdraw proceeds", async () => {
              const deadline = Math.floor(new Date().getTime() / 1000) + 86400

              const offerTx = await marketplaceContractBuyer.makeOffer(
                  nftToken.address,
                  deadline,
                  tokenId,
                  {
                      value: lowPrice,
                  }
              )

              await offerTx.wait(1)
              const acceptTx = await marketplaceContract.acceptOffer(nftToken.address, tokenId)
              await acceptTx.wait(1)

              const proceedsbefore = await marketplaceContract.getProceeds(deployer.address)

              const withdrawTx = await marketplaceContract.withdrawProceeds()
              await withdrawTx.wait(1)

              const proceedsAfterWithdraw = await marketplaceContract.getProceeds(deployer.address)

              assert.equal(lowPrice.toString(), proceedsbefore.toString())

              assert.equal("0", proceedsAfterWithdraw.toString())
          })

          it("Increases proceeds after buyitem is called and accept offer is called on 2 nfts", async () => {
              const deadline = Math.floor(new Date().getTime() / 1000) + 86400

              let tokenId2

              const listtx = await marketplaceContract.listItem(
                  nftToken.address,
                  tokenId,
                  LISTING_PRICE
              )
              await listtx.wait(1)

              const mintTx = await nftToken.mintNft(TOKEN_URI)
              const minRcp = await mintTx.wait(1)

              tokenId2 = minRcp.events[0].args.tokenId.toString()

              await nftToken.approve(marketplaceContract.address, tokenId2)

              const buytx = await marketplaceContractBuyer.buyItem(nftToken.address, tokenId, {
                  value: LISTING_PRICE,
              })

              await buytx.wait(1)

              const offerTx = await marketplaceContractBuyer.makeOffer(
                  nftToken.address,
                  deadline,
                  tokenId2,
                  { value: lowPrice }
              )

              await offerTx.wait(1)

              const acceptTx = await marketplaceContract.acceptOffer(nftToken.address, tokenId2)
              await acceptTx.wait(1)

              const proceeds = await marketplaceContract.getProceeds(deployer.address)

              assert.equal(
                  Number(ethers.utils.formatEther(LISTING_PRICE.toString())) +
                      Number(ethers.utils.formatEther(lowPrice.toString())),
                  Number(ethers.utils.formatEther(proceeds.toString()))
              )
          })
      })
