import { useNotification } from "@web3uikit/core"
import Axios from "axios"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useRef, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import nftMarketplace from "../constants/NftMarketplace.json"
import nftToken from "../constants/NftToken.json"
import { DarkModeContext } from "../contexts/darkModeprovider"
import { handlePostRequest } from "../utils/requests"

export default function NftBox({
    price,
    nftAddress,
    tokenId,
    startTime,
    endTime,
    status,
    owner,
    collectionId,
    marketplaceAddress,
    measurementUnit,
    getTokenData,
}) {
    const makeOfferRef = useRef(null)
    const { runContractFunction } = useWeb3Contract()
    const { account, chainId, isWeb3Enabled } = useMoralis()

    const router = useRouter()

    const { darkMode } = useContext(DarkModeContext)

    const dispatchNotification = useNotification()

    const dispatchError = (err) => {
        makeOfferRef.current.classList.remove("show-modal")
        dispatchNotification({
            position: "topR",
            type: "error",
            title: "error",
            message: err.message,
        })
    }

    const dispatchSuccess = (message) => {
        makeOfferRef.current.classList.remove("show-modal")
        dispatchNotification({
            position: "topR",
            type: "success",
            title: "Success",
            message: message,
        })
    }

    const [tokenSymbol, setTokenSymbol] = useState("")
    const [tokenData, setTokenData] = useState({})
    const [loadingVisible, setLoadingVisible] = useState("invisible")

    const getTokenUri = async () => {
        const params = {
            abi: nftToken,
            contractAddress: nftAddress,
            functionName: "getokenURI",
            params: {
                tokenId: tokenId,
            },
        }
        const symbolParams = {
            abi: nftToken,
            contractAddress: nftAddress,
            functionName: "symbol",
        }

        const tokenUri = await runContractFunction({
            params: params,
        })

        const tokenSymbol = await runContractFunction({
            params: symbolParams,
        })

        const formattedurl = tokenUri?.replace("ipfs://", "https://ipfs.io/ipfs/")

        const { data } = await Axios.get(formattedurl)

        setTokenData(data)

        setTokenSymbol(tokenSymbol)
    }

    useEffect(() => {
        isWeb3Enabled && getTokenUri()

        return () => {}
    }, [isWeb3Enabled])

    const convertTime = (startTime, endTime) => {
        const difference = endTime - startTime

        const days = Math.floor(difference / (60 * 60 * 24))

        const hours = Math.floor((difference % (60 * 60 * 24)) / (60 * 60))

        const minutes = Math.floor((difference % (60 * 60)) / 60)

        return `${days <= 0 ? "" : days < 10 ? "0" + days + " days" : days + " days"} ${
            hours <= 0 ? "" : hours < 10 ? "0" + hours + " hours" : hours + " hours"
        } ${minutes <= 0 ? "" : minutes < 10 ? "0" + minutes + " minutes" : minutes + " minutes"}`
    }

    const handleBuyNft = async (e) => {
        e.stopPropagation()

        if (status === "auctioned") {
            // makeOfferRef.current.classList.add("show-modal")
            router.push(`/nfts/${nftAddress}/${collectionId}/${tokenId}`)
            return
        }

        setLoadingVisible("visible")

        const buyParams = {
            abi: nftMarketplace,
            contractAddress: marketplaceAddress,
            functionName: "buyItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
            },
            msgValue: price,
        }

        await runContractFunction({
            params: buyParams,
            onSuccess: async (tx) => {
                const today = new Date()

                const timeStamp = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
                const txRcp = await tx.wait(1)

                const reqParams = {
                    block_hash: txRcp.blockHash,
                    block_timestamp: timeStamp,
                    transaction_hash: txRcp.transactionHash,
                    transaction_index: txRcp.transactionIndex,
                    block_number: txRcp.blockNumber,
                    token_decimal: tokenId,
                    token_id: tokenId,
                    log_index: txRcp.logs[0].logIndex ? txRcp.logs[0].logIndex : 0,
                    function_name: "buy",
                    function_desc: "token transfered",
                    nft_address: nftAddress,
                    marketplace_address: marketplaceAddress,
                    from_address: txRcp.from,
                    to_address: txRcp.to,
                    collection_id: collectionId,
                    owner: account,
                    status: status,
                }

                const res = await handlePostRequest("/listings/buy-item", reqParams, {})

                if (res.status === 200) {
                    await getTokenData()
                    setLoadingVisible("invisible")
                    return dispatchSuccess("Item bought.")
                }

                dispatchError({ message: "Unexpected server error" })
                setLoadingVisible("invisible")
            },
            onError: (err) => {
                dispatchError(err)
                setLoadingVisible("invisible")
            },
        })
    }

    return (
        <div
            className="relative w-64 rounded-lg border overflow-hidden group"
            onClick={() => router.push(`/nfts/${nftAddress}/${collectionId}/${tokenId}`)}
        >
            <div className="h-64">
                {tokenData?.image ? (
                    <img
                        src={tokenData?.image?.replace("ipfs://", "https://ipfs.io/ipfs/")}
                        className="w-full h-full hover:scale-110 duration-200 transition-all"
                    />
                ) : (
                    <div>loading</div>
                )}
            </div>
            <div className="p-2">
                <p className="pt-2">{tokenData?.name}</p>

                <p className="pt-3 font-bold">Price</p>
                <p>
                    <span>{price}</span> <span className="font-bold">{tokenSymbol}</span>
                </p>

                {endTime > startTime && (
                    <p className="text-sm">
                        <span>Ends in:</span> <span>{convertTime(startTime, endTime)}</span>
                    </p>
                )}
            </div>
            {owner === account ? (
                <div className="p-2 bg-blue md:absolute md:-bottom-10 md:group-hover:bottom-0 transition-all duration-300 left-0 w-full text-center font-bold cursor-pointer">
                    <p>You own this item</p>
                </div>
            ) : (
                <div>
                    {status !== "unlisted" && (
                        <div
                            className="p-2 bg-blue md:absolute md:-bottom-10 md:group-hover:bottom-0 transition-all duration-300 left-0 w-full text-center font-bold cursor-pointer"
                            onClick={handleBuyNft}
                        >
                            <p>{status === "auctioned" ? "Place Bid" : "Buy Now"}</p>
                        </div>
                    )}
                </div>
            )}

            {/* <MakeOffer
                ref={makeOfferRef}
                text="Place Bid"
                tokenAddress={nftAddress}
                tokenId={tokenId}
                marketplaceAddress={marketplaceAddress}
                tokenSymbol={measurementUnit}
                owner={owner}
                collectionId={collectionId}
                value={price}
                getTokenData={getTokenData}
                setLoadingVisible={setLoadingVisible}
                className="z-50"
            />

             */}
        </div>
    )
}
