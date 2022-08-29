import {
    faBarsStaggered,
    faBolt,
    faEllipsisVertical,
    faGlobe,
    faHeart,
    faMagnet,
    faShareNodes,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNotification } from "@web3uikit/core"
import Axios from "axios"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useRef, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import CustomLoader from "../../../../components/CustomLoader"
import MakeOffer from "../../../../components/MakeOffer"
import NftBox from "../../../../components/NftBox"
import SellItem from "../../../../components/SellItem"
import UpdateOffer from "../../../../components/UpdateOffer"
import UpdatePrice from "../../../../components/UpdatePrice"
import networkMappaing from "../../../../constants/networkMapping.json"
import nftMarketplace from "../../../../constants/NftMarketplace.json"
import nftToken from "../../../../constants/NftToken.json"
import { DarkModeContext } from "../../../../contexts/darkModeprovider"
import { baseUrl as axios } from "../../../../utils/axios"
import { handleGetRequest, handlePostRequest } from "../../../../utils/requests"

export default function TokenId({ params }) {
    const reportRef = useRef(null)
    const shareOptionsRef = useRef(null)
    const sellContRef = useRef(null)
    const offerRef = useRef(null)
    const updateOfferRef = useRef(null)
    const updatePriceRef = useRef(null)
    const router = useRouter()
    const { runContractFunction } = useWeb3Contract()
    const { account, chainId, isWeb3Enabled } = useMoralis()
    const dispatchNotification = useNotification()
    const { darkMode } = useContext(DarkModeContext)

    const { tokenId, tokenAddress, collectionId } = params

    const [collection, setCollection] = useState({})
    const [listedNfts, setListedNfts] = useState([])
    const [otherNfts, setOthernfts] = useState([])
    const [tokenSymbol, setTokenSymbol] = useState("")
    const [offerText, setOfferText] = useState("Make Offer")
    const [updateOfferText, setUpdateOfferText] = useState("Update Offer")
    const [approveStatus, setApproveStatus] = useState("")
    const [offerToUpdate, setOfferToUpdate] = useState({})
    const [loadingVisible, setLoadingVisible] = useState("invisible")
    const [loadingVisible2, setLoadingVisible2] = useState("invisible")

    const [tokenData, setTokenData] = useState({})

    const [token, setToken] = useState({})

    const endDate = new Date(token?.nft?.end_time)

    const chainString = parseInt(chainId).toString()

    const chainName = networkMappaing[chainString]?.name

    const marketplaceAddress = networkMappaing[chainString]?.NftMarketplace[0]

    const dispatchError = (err) =>
        dispatchNotification({
            position: "topR",
            type: "error",
            message: err.message,
            title: "Error",
        })

    const dispatchSuccess = (message) =>
        dispatchNotification({
            position: "topR",
            type: "success",
            message: message,
            title: "Success",
            onClick: () => router.push(`/nfts/${tokenAddress}/${collectionId}/${tokenId}`),
        })

    const getTokenData = async () => {
        const params = {
            abi: nftToken,
            contractAddress: tokenAddress,
            functionName: "getokenURI",
            params: {
                tokenId: tokenId,
            },
        }

        const symbolParams = {
            abi: nftToken,
            contractAddress: tokenAddress,
            functionName: "symbol",
        }

        const tokenUri = await runContractFunction({
            params: params,
        })

        const formattedurl = tokenUri?.replace("ipfs://", "https://ipfs.io/ipfs/")

        const { data } = await Axios.get(formattedurl)

        const token = await handleGetRequest(`/nfts/${tokenAddress}/${collectionId}/${tokenId}`)

        const collection = await handleGetRequest(`/collections/${collectionId}`)

        setCollection(collection)

        setOthernfts(
            collection?.nfts?.filter(
                (nft) => nft?.nft_address !== tokenAddress && nft?.token_id !== tokenId
            )
        )

        setListedNfts(collection?.nfts?.filter((nft) => nft?.status !== "unlisted"))

        setToken(token)

        setTokenData(data)

        const tokenSymbol = await runContractFunction({
            params: symbolParams,
        })

        setTokenSymbol(tokenSymbol)
    }

    useEffect(() => {
        isWeb3Enabled && getTokenData()
    }, [isWeb3Enabled])

    useEffect(() => {
        document.addEventListener("mousedown", clickOutsideShare)
        document.addEventListener("mousedown", clickOutsideReport)

        return () => {
            document.removeEventListener("mousedown", clickOutsideShare)
            document.removeEventListener("mousedown", clickOutsideReport)
        }
    }, [])

    const clickOutsideShare = (e) => {
        const { current } = shareOptionsRef
        if (current && !current.contains(e.target)) {
            current.classList.remove("share-cont")
        }
    }

    const clickOutsideReport = (e) => {
        const { current } = reportRef
        if (current && !current.contains(e.target)) {
            current.classList.remove("report-cont")
        }
    }

    const openUrl = (url) => window.open(url, "_blank")

    const showReportOptions = (e) => {
        reportRef.current.classList.add("report-cont")
    }

    const showShareOptions = (e) => {
        shareOptionsRef.current.classList.add("share-cont")
    }

    const handleBuyitem = async () => {
        if (token?.nft?.status === "auctioned") {
            setOfferText("Place Bid")
            return offerRef.current.classList.add("show-modal")
        }

        setLoadingVisible("visible")

        const buyParams = {
            abi: nftMarketplace,
            contractAddress: marketplaceAddress,
            functionName: "buyItem",
            params: {
                nftAddress: tokenAddress,
                tokenId: tokenId,
            },
            msgValue: token?.nft?.price_decimal,
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
                    log_index: txRcp.logs[0].logIndex,
                    function_name: "buy",
                    function_desc: "token transfered",
                    nft_address: tokenAddress,
                    marketplace_address: marketplaceAddress,
                    from_address: txRcp.from,
                    to_address: txRcp.to,
                    collection_id: collectionId,
                    owner: account,
                    status: token.nft.status,
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

    const handleUpdatePrice = async () => {
        updatePriceRef.current.classList.add("show-modal")
    }

    const handleListOnSale = async (e) => {
        e.stopPropagation()
        setApproveStatus(token?.nft?.approved)
        sellContRef.current.classList.add("sell-modal")
    }

    const handleMakeOffer = async () => {
        setOfferText("Make Offer")

        return offerRef.current.classList.add("show-modal")
    }

    const handleBuyNft = async (nft) => {
        if (nft?.status === "auctioned") {
            setOfferText("Place Bid")
            return offerRef.current.classList.add("show-modal")
        }

        setLoadingVisible("visible")

        const buyParams = {
            abi: nftMarketplace,
            contractAddress: nft?.marketplace_address,
            functionName: "buyItem",
            params: {
                nftAddress: nft?.nft_address,
                tokenId: nft?.token_id,
            },
            msgValue: nft?.price_decimal,
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
                    token_decimal: nft?.token_id,
                    token_id: nft?.token_id,
                    log_index: txRcp.logs[0].logIndex ? txRcp.logs[0].logIndex : 0,
                    function_name: "buy",
                    function_desc: "token transfered",
                    nft_address: nft?.nft_address,
                    marketplace_address: nft?.marketplace_address,
                    from_address: txRcp.from,
                    to_address: txRcp.to,
                    collection_id: nft?.collection_id,
                    owner: account,
                    status: nft.status,
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

    const handleRejectOffer = async (offer) => {
        const rejectParams = {
            abi: nftMarketplace,
            contractAddress: offer?.marketplace_address,
            functionName: "rejectOffer",
            params: {
                nftAddress: offer?.nft_address,
                tokenId: offer?.token_id,
                offerer: offer?.offerer,
            },
        }

        setLoadingVisible("visible")

        await runContractFunction({
            params: rejectParams,
            onSuccess: async (tx) => {
                const today = new Date()
                const timeStamp = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`

                const txRcp = await tx.wait(1)

                const reqData = {
                    block_hash: txRcp.blockHash,
                    block_timestamp: timeStamp,
                    transaction_hash: txRcp.transactionHash,
                    transaction_index: txRcp.transactionIndex,
                    block_number: txRcp.blockNumber,
                    token_decimal: offer.token_decimal,
                    token_id: offer.token_id,
                    log_index: txRcp?.logs[0]?.logIndex ? txRcp?.logs[0]?.logIndex : 0,
                    function_name: "rejectOffer",
                    function_desc: "Rejected offer",
                    nft_address: offer.nft_address,
                    marketplace_address: offer.marketplace_address,
                    from_address: txRcp.from,
                    to_address: txRcp.to,
                    collection_id: offer.collection_id,
                    offerer: offer.offerer,
                    owner: offer.owner,
                }

                const res = await handlePostRequest("/offers/reject-offer", reqData, {})

                if (res.status !== 200) {
                    setLoadingVisible("invisible")
                    return dispatchError({ message: "Unexpected server error" })
                }

                await getTokenData()
                setLoadingVisible("invisible")
                dispatchSuccess("Offer rejected")
            },

            onError: (err) => {
                setLoadingVisible("invisible")
                dispatchError(err)
                console.log(err)
            },
        })
    }

    const handleAcceptOffer = async (offer) => {
        const acceptParams = {
            abi: nftMarketplace,
            contractAddress: offer?.marketplace_address,
            functionName: "acceptOffer",
            params: {
                nftAddress: offer?.nft_address,
                tokenId: offer?.token_id,
                offerer: offer?.offerer,
            },
        }

        setLoadingVisible("visible")

        await runContractFunction({
            params: acceptParams,
            onSuccess: async (tx) => {
                const today = new Date()
                const timeStamp = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`

                const txRcp = await tx.wait(1)

                const reqData = {
                    block_hash: txRcp.blockHash,
                    block_timestamp: timeStamp,
                    transaction_hash: txRcp.transactionHash,
                    transaction_index: txRcp.transactionIndex,
                    block_number: txRcp.blockNumber,
                    token_decimal: offer.token_decimal,
                    token_id: offer.token_id,
                    log_index: txRcp?.logs[0]?.logIndex ? txRcp?.logs[0]?.logIndex : 0,
                    function_name: "acceptOffer",
                    function_desc: "Accepted offer",
                    nft_address: offer.nft_address,
                    marketplace_address: offer.marketplace_address,
                    from_address: txRcp.from,
                    to_address: txRcp.to,
                    collection_id: offer.collection_id,
                    offerer: offer.offerer,
                    owner: offer.owner,
                }

                const res = await handlePostRequest("/offers/accept-offer", reqData, {})

                if (res.status !== 200) {
                    setLoadingVisible("invisible")
                    return dispatchError({ message: "Unexpected server error" })
                }

                await getTokenData()
                setLoadingVisible("invisible")
                dispatchSuccess("Offer accepted")
            },

            onError: (err) => {
                setLoadingVisible("invisible")
                dispatchError(err)
            },
        })
    }
    const handleCancelOffer = async (offer) => {
        const cancelParams = {
            abi: nftMarketplace,
            contractAddress: offer?.marketplace_address,
            functionName: "cancelOffer",
            params: {
                nftAddress: offer?.nft_address,
                tokenId: offer?.token_id,
                offerer: offer?.offerer,
            },
        }

        setLoadingVisible("visible")

        await runContractFunction({
            params: cancelParams,
            onSuccess: async (tx) => {
                const today = new Date()
                const timeStamp = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`

                const txRcp = await tx.wait(1)

                const reqData = {
                    block_hash: txRcp.blockHash,
                    block_timestamp: timeStamp,
                    transaction_hash: txRcp.transactionHash,
                    transaction_index: txRcp.transactionIndex,
                    block_number: txRcp.blockNumber,
                    token_decimal: offer.token_decimal,
                    token_id: offer.token_id,
                    log_index: txRcp?.logs[0]?.logIndex ? txRcp?.logs[0]?.logIndex : 0,
                    function_name: "acceptOffer",
                    function_desc: "Accepted offer",
                    nft_address: offer.nft_address,
                    marketplace_address: offer.marketplace_address,
                    from_address: txRcp.from,
                    to_address: txRcp.to,
                    collection_id: offer.collection_id,
                    offerer: offer.offerer,
                    owner: offer.owner,
                }

                const res = await handlePostRequest("/offers/cancel-offer", reqData, {})

                if (res.status !== 200) {
                    setLoadingVisible("invisible")
                    return dispatchError({ message: "Unexpected server error" })
                }

                await getTokenData()
                setLoadingVisible("invisible")
                dispatchSuccess("Offer Cancelled")
            },

            onError: (err) => {
                setLoadingVisible("invisible")
                dispatchError(err)
            },
        })
    }

    const handleUpdateOffer = async (offer) => {
        setUpdateOfferText(
            offer?.function_name === "bid" || offer?.function_name === "updateBid"
                ? "Update Bid"
                : "Update Offer"
        )

        setOfferToUpdate(offer)

        return updateOfferRef.current.classList.add("show-modal")
    }

    return (
        <div className={`${darkMode && "bg-dark text-white"} min-h-screen py-6`}>
            <div className="flex gap-4 justify-center flex-wrap w-4/5 mx-auto">
                <div className="left-section w-128">
                    <div className="flex justify-between items-center px-2 py-4 border rounded-t-lg">
                        <span className="my-auto">{tokenSymbol}</span>
                        <div className="my-auto flex gap-2 items-center cursor-pointer">
                            <FontAwesomeIcon icon={faHeart} className="my-auto" />
                            <span className="my-auto">0 Favorites</span>
                        </div>
                    </div>
                    <div className="image-cont h-64 md:h-128 border rounded-b-lg overflow-hidden">
                        <img
                            src={tokenData?.image?.replace("ipfs://", "https://ipfs.io/ipfs/")}
                            className="w-full h-full"
                        />
                    </div>

                    <div className="mt-2 border rounded-lg overflow-hidden">
                        <div>
                            <div className="px-2 py-4 flex gap-4 items-center border-b border-slate-100">
                                <FontAwesomeIcon icon={faBarsStaggered} className="my-auto" />
                                <span className="font-bold text-lg my-auto">Description</span>
                            </div>
                            <div className="px-2 py-4 max-h-52 overflow-y-auto border-b border-slate-100">
                                {tokenData?.description}
                            </div>
                        </div>

                        <div>
                            <div className="px-2 py-4 flex gap-4 items-center border-b border-slate-100">
                                <FontAwesomeIcon icon={faBolt} className="my-auto rotate-90" />
                                <span className="font-bold text-lg my-auto">Properties</span>
                            </div>
                            <div className="px-2 py-4 max-h-52 overflow-y-auto border-b border-slate-100 flex gap-2 flex-wrap">
                                {tokenData?.attributes?.map((attribute, i) => (
                                    <div
                                        className="flex gap-2 items-center p-2 border rounded-lg flex-col w-max text-center m-auto"
                                        key={`${attribute?.key}-${i}`}
                                    >
                                        <span className="font-bold text-md">{attribute?.key}</span>
                                        <span>{attribute?.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="px-2 py-4 flex gap-4 items-center border-b border-slate-100">
                                <FontAwesomeIcon icon={faMagnet} className="my-auto rotate-90" />
                                <span className="font-bold text-lg my-auto">About Collection</span>
                            </div>
                            <div className="px-2 py-4 max-h-52 overflow-y-auto border-b border-slate-100">
                                <div>
                                    {collection?.collection?.description
                                        ? collection?.collection.description
                                        : "No information about collection"}
                                </div>

                                <div className="flex justify-center items-center my-1">
                                    {collection?.collection?.website && (
                                        <div
                                            className="px-2 py-1 rounded-md border w-max cursor-pointer"
                                            onClick={() => openUrl(collection?.collection.website)}
                                        >
                                            <FontAwesomeIcon icon={faGlobe} />
                                        </div>
                                    )}
                                    {/* {collection?.collection?.discord && (
                                    <div className="px-2 py-1 rounded-md border w-max cursor-pointer"
                                        onClick={() => openUrl(collection?.collection.discord)}>
                                        <FontAwesomeIcon icon={faDiscord} />
                                    </div>
                                )}
                                {collection?.collection?.facebook && (
                                    <div className="px-2 py-1 rounded-md border w-max cursor-pointer"
                                        onClick={() => openUrl(collection?.collection.facebook)}>
                                        <FontAwesomeIcon icon={faFacebook} />
                                    </div>
                                )}
                                {collection?.collection?.telegram && (
                                    <div className="px-2 py-1 rounded-md border w-max cursor-pointer"
                                        onClick={() => openUrl(collection?.collection.telegram)}>
                                        <FontAwesomeIcon icon={faTelegram} />
                                    </div>
                                )}
                                {collection?.collection?.youtube && (
                                    <div className="px-2 py-1 rounded-md border w-max cursor-pointer"
                                        onClick={() => openUrl(collection?.collection.youtube)}>
                                        <FontAwesomeIcon icon={faYoutube} />
                                    </div>
                                )} */}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="px-2 py-4 flex gap-4 items-center border-b border-slate-100">
                                <FontAwesomeIcon
                                    icon={faBarsStaggered}
                                    className="my-auto rotate-90"
                                />
                                <span className="font-bold text-lg my-auto">Token Details</span>
                            </div>
                            <div className="py-4 max-h-52 overflow-y-auto border-b border-slate-100 flex gap-2 flex-wrap">
                                <div className="flex gap-2 justify-between items-center p-1 w-full">
                                    <span className="w-max">Contract Address</span>
                                    <span>{`${tokenAddress?.slice(0, 6)}...${tokenAddress?.slice(
                                        -4
                                    )}`}</span>
                                </div>

                                <div className="flex gap-2 justify-between items-center p-1 w-full">
                                    <span className="w-max">Token ID</span>
                                    <span>{`${tokenId}`}</span>
                                </div>

                                <div className="flex gap-2 justify-between items-center p-1 w-full">
                                    <span className="w-max">Token Standard</span>
                                    <span>ERC721</span>
                                </div>

                                <div className="flex gap-2 justify-between items-center p-1 w-full">
                                    <span className="w-max">Blockchain</span>
                                    <span>{chainName}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="right-section flex-1">
                    <div className="flex justify-between items-center gap-2 p-2">
                        <div className="text-lg">{collection?.collection?.name}</div>

                        <div className="flex gap-2 items-center ">
                            {collection?.collection?.website && (
                                <div
                                    className="cursor-pointer mx-2 my-auto relative group"
                                    onClick={() => openUrl(collection?.collection?.website)}
                                >
                                    <FontAwesomeIcon
                                        icon={faGlobe}
                                        className="p-2 rounded-full hover:bg-light-dark hover:text-white m-auto"
                                    />
                                    <span
                                        className={`absolute top-full right-0 p-4 w-max rounded-lg bg-black font-bold invisible transition-all duration-150 ease-linear group-hover:visible ${
                                            !darkMode && "text-white"
                                        }`}
                                    >
                                        Website
                                    </span>
                                </div>
                            )}

                            <div
                                className="cursor-pointer mx-2 my-auto relative group"
                                onClick={showShareOptions}
                                ref={shareOptionsRef}
                            >
                                <FontAwesomeIcon
                                    icon={faShareNodes}
                                    className="p-2 rounded-full hover:bg-light-dark hover:text-white m-auto"
                                />
                                <span
                                    className={`absolute top-full right-0 p-4 w-max rounded-lg bg-black font-bold invisible transition-all duration-150 ease-linear group-hover:visible ${
                                        !darkMode && "text-white"
                                    }`}
                                >
                                    Share
                                </span>
                                <div
                                    className={`absolute right-0 -top-full w-max border rounded-md bg-white flex flex-col gap-2 align-middle cursor-default transition-all duration-300 ease-linear share-options-cont overflow-hidden invisible ${
                                        darkMode && "text-black"
                                    }`}
                                >
                                    <span className="p-2 border-b cursor-pointer hover:bg-light-dark hover:text-white font-bold">
                                        Copy link
                                    </span>

                                    <span className="p-2 border-b cursor-pointer hover:bg-light-dark hover:text-white font-bold">
                                        Share on facebook
                                    </span>

                                    <span className="p-2 border-b cursor-pointer hover:bg-light-dark hover:text-white font-bold">
                                        Share on instagram
                                    </span>

                                    <span className="p-2 border-b cursor-pointer hover:bg-light-dark hover:text-white font-bold">
                                        Share on twitter
                                    </span>
                                </div>
                            </div>

                            <div
                                className="cursor-pointer mx-2 my-auto relative group"
                                ref={reportRef}
                                onClick={showReportOptions}
                            >
                                <FontAwesomeIcon
                                    icon={faEllipsisVertical}
                                    className="p-2 rounded-full hover:bg-light-dark hover:text-white m-auto"
                                />
                                <span
                                    className={`absolute top-full right-0 p-4 w-max rounded-lg bg-black font-bold invisible transition-all duration-150 ease-linear group-hover:visible ${
                                        !darkMode && "text-white"
                                    }`}
                                >
                                    More options
                                </span>
                                <div
                                    className={`report-options-cont absolute right-0 -top-full w-max border rounded-md bg-white flex flex-col gap-2 align-middle cursor-default transition-all duration-300 ease-linear overflow-hidden invisible ${
                                        darkMode && "text-black"
                                    }`}
                                >
                                    <span className="p-2 border-b cursor-pointer hover:bg-light-dark hover:text-white font-bold">
                                        Report
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="font-bold text-lg md:text-2xl">{`${collection?.collection?.name} #${tokenId}`}</div>

                    <div className="flex gap-2 items-center py-2">
                        <div className="border-r last:border-r-0 pr-2 flex gap-2 items-center">
                            <span>Owned by : </span>
                            <span>{`${token?.nft?.owner?.slice(0, 4)}...${token?.nft?.owner?.slice(
                                -4
                            )}`}</span>
                        </div>

                        <div className="border-r last:border-r-0 pr-2 flex gap-2 items-center">
                            <span>
                                <FontAwesomeIcon icon={faHeart} />
                            </span>
                            <span>0 Favorites</span>
                        </div>
                    </div>

                    <div>
                        {token?.nft?.end_time > token?.nft?.start_time ? (
                            <div className="flex gap-4 items-center text-lg py-8 px-4 border rounded-t-lg">
                                <p>
                                    {token?.nft?.status === "auctioned" ? "Auction" : "Sale"} ends
                                    on:{" "}
                                </p>
                                <p>{endDate?.toLocaleString()}</p>
                            </div>
                        ) : (
                            <div className="p-8 border rounded-t-lg"></div>
                        )}
                        {/* add countdown timer */}
                    </div>

                    <div className="px-4 py-6 border-b border-l border-r rounded-b-lg">
                        <div className="py-2">Current Price</div>
                        <div className="font-bold text-lg md:text-3xl pb-2">
                            {token?.nft?.price_decimal} {tokenSymbol}
                        </div>

                        <div className="flex gap-4 items-center">
                            {token?.nft?.status !== "unlisted" && (
                                <div>
                                    {token?.nft?.owner === account ? (
                                        <button
                                            disabled
                                            className="px-6 py-3 md:px-12 md:py-4 font-bold text-lg text-grey bg-lightblue border rounded-lg relative group"
                                        >
                                            {token?.nft?.status === "listed"
                                                ? "Buy Now"
                                                : "Place Bid"}

                                            <span className="absolute bottom-full mb-2 p-2 font-normal text-white bg-black transition-all duration-300 invisible group-hover:visible w-max rounded-lg">
                                                You own this item
                                            </span>
                                        </button>
                                    ) : (
                                        <button
                                            className="px-6 py-3 md:px-12 md:py-4 font-bold text-lg text-white bg-blue border rounded-lg"
                                            onClick={handleBuyitem}
                                        >
                                            {token?.nft?.status === "listed"
                                                ? "Buy Now"
                                                : "Place Bid"}
                                        </button>
                                    )}
                                </div>
                            )}
                            <div>
                                {token?.nft?.owner === account ? (
                                    <div>
                                        {token?.nft?.status === "listed" ? (
                                            <button
                                                className={`px-6 py-3 md:px-12 md:py-4 font-bold text-lg border rounded-lg ${
                                                    darkMode ? "text-white" : "text-blue"
                                                }`}
                                                onClick={handleUpdatePrice}
                                            >
                                                Change Price
                                            </button>
                                        ) : token?.nft?.status === "auctioned" ? (
                                            <button
                                                className={`px-6 py-3 md:px-12 md:py-4 font-bold text-lg border rounded-lg bg-lightblue text-white`}
                                                disabled
                                            >
                                                On Auction
                                            </button>
                                        ) : (
                                            <button
                                                className={`px-6 py-3 md:px-12 md:py-4 font-bold text-lg border rounded-lg bg-blue text-white`}
                                                onClick={handleListOnSale}
                                            >
                                                Sell NFT
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    token?.nft?.status !== "auctioned" && (
                                        <button
                                            className={`px-6 py-3 md:px-12 md:py-4 font-bold text-lg border rounded-lg ${
                                                darkMode ? "text-white" : "text-blue"
                                            }`}
                                            onClick={handleMakeOffer}
                                        >
                                            Make offer
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border mt-4">
                        <div className="px-2 py-4 flex gap-4 items-center border-b border-slate-100">
                            <FontAwesomeIcon icon={faBarsStaggered} className="my-auto" />
                            <span className="font-bold text-lg my-auto">Listings</span>
                        </div>

                        <div className="h-80 overflow-y-auto border-b border-slate-100">
                            <div className="flex gap-2 items-center px-2 py-4 border-b font-bold">
                                <div className="flex-1">Price</div>
                                <div className="flex-1">From</div>
                                <div className="mx-4 px-4 py-2 rounded-xl "></div>
                            </div>
                            {listedNfts?.length ? (
                                listedNfts?.map((nft, i) => (
                                    <div
                                        className="flex gap-2 items-center px-2 py-4 border-b font-bold"
                                        key={`${nft?.id}-${i}`}
                                    >
                                        <div className="flex-1">{nft?.price_decimal}</div>
                                        <div className="flex-1">
                                            {nft?.from_address?.slice(0, 4)}...
                                        </div>
                                        <div>
                                            {nft?.owner === account ? (
                                                <button className="mx-4 px-4 py-2 rounded-xl bg-blue text-white">
                                                    You Listed
                                                </button>
                                            ) : (
                                                <button
                                                    className="mx-4 px-4 py-2 rounded-xl bg-blue text-white"
                                                    onClick={() => handleBuyNft(nft)}
                                                >
                                                    {nft?.status === "auctioned" ? "Bid" : "Buy"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="my-auto text-center mt-6 text-lg">No listings</div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-lg border mt-4">
                        <div className="px-2 py-4 flex gap-4 items-center border-b border-slate-100">
                            <FontAwesomeIcon icon={faBarsStaggered} className="my-auto" />
                            <span className="font-bold text-lg my-auto">Offers</span>
                        </div>

                        <div className="h-80 overflow-y-auto border-b border-slate-100">
                            <div className="flex gap-2 items-center px-2 py-4 border-b font-bold">
                                <div className="flex-1">Price</div>
                                <div className="flex-1">From</div>
                                <div className="mx-4 px-4 py-2 rounded-xl "></div>
                            </div>
                            {token?.offers?.length ? (
                                token?.offers?.map((offer, i) => (
                                    <div
                                        className="flex gap-2 items-center px-2 py-4 border-b font-bold"
                                        key={`${offer?.id}-${i}`}
                                    >
                                        <div className="flex-1">{offer?.price_decimal}</div>
                                        <div className="flex-1">
                                            {offer?.from_address?.slice(0, 4)}...
                                        </div>

                                        {offer?.owner === account ? (
                                            <div className="flex gap-2 items-center">
                                                <button
                                                    className="mx-4 px-4 py-2 rounded-xl bg-white text-blue"
                                                    onClick={() => handleRejectOffer(offer)}
                                                >
                                                    Reject Offer
                                                </button>
                                                <button
                                                    className="mx-4 px-4 py-2 rounded-xl bg-blue text-white"
                                                    onClick={() => handleAcceptOffer(offer)}
                                                >
                                                    Accept Offer
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                {offer?.offerer === account ? (
                                                    <div>
                                                        <button
                                                            className="mx-4 px-4 py-2 rounded-xl bg-white text-blue"
                                                            onClick={() => handleCancelOffer(offer)}
                                                        >
                                                            Cancel Offer
                                                        </button>
                                                        <button
                                                            className="mx-4 px-4 py-2 rounded-xl bg-blue text-white"
                                                            onClick={() => handleUpdateOffer(offer)}
                                                        >
                                                            Update Offer
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button className="mx-4 px-4 py-2 rounded-xl bg-blue text-white">
                                                        {offer?.offerer?.slice(0, 6)}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="my-auto text-center mt-6 text-lg">No offers</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-4/5 m-auto mt-4 border rounded-lg overflow-y-hidden overflow-x-auto">
                <div className="px-2 py-4 flex gap-4 items-center border-b-2">
                    <FontAwesomeIcon icon={faBarsStaggered} className="my-auto" />
                    <span className="font-bold text-lg my-auto">Activities</span>
                </div>
                <div className="w-full max-h-96 overflow-y-auto">
                    {token?.activities?.length ? (
                        <table className="w-full relative">
                            <thead>
                                <tr className="border-b">
                                    <td className="p-4 text-lg font-bold">Event</td>
                                    <td className="p-4 text-lg font-bold">price</td>
                                    <td className="p-4 text-lg font-bold">From</td>
                                    <td className="p-4 text-lg font-bold">To</td>
                                    <td className="p-4 text-lg font-bold">Date</td>
                                </tr>
                            </thead>

                            <tbody>
                                {token?.activities?.map((activity, i) => (
                                    <tr
                                        className="border-b last:border-0"
                                        key={`${activity?.id}-${i}`}
                                    >
                                        <td className="p-4 text-lg">
                                            {activity?.function_name?.includes("buy")
                                                ? "Transfer"
                                                : activity?.function_name}
                                        </td>
                                        <td className="p-4 text-lg">{activity?.value}</td>
                                        <td className="p-4 text-lg">
                                            {activity?.from_address?.slice(0, 6)}...
                                        </td>
                                        <td className="p-4 text-lg">
                                            {activity?.to_address?.slice(0, 6)}...
                                        </td>
                                        <td className="p-4 text-lg">
                                            {Math.floor(
                                                (new Date().getTime() -
                                                    new Date(activity?.created_at).getTime()) /
                                                    (1000 * 60 * 60 * 24)
                                            )}{" "}
                                            days ago
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="w-full text-center p-8 text-lg">No data to display</div>
                    )}
                </div>
            </div>

            {otherNfts?.length ? (
                <div className="w-4/5 m-auto mt-4 border rounded-lg overflow-hidden">
                    <div className="px-2 py-4 flex gap-4 items-center border-b-2">
                        <FontAwesomeIcon icon={faBarsStaggered} className="my-auto" />
                        <span className="font-bold text-lg my-auto">More from this collection</span>
                    </div>

                    <div className="flex gap-4 align-middle">
                        {otherNfts?.map((nft, i) => {
                            const {
                                nft_address,
                                token_id,
                                price_decimal,
                                start_time,
                                end_time,
                                status,
                                owner,
                                collection_id,
                            } = nft

                            return (
                                <NftBox
                                    key={`${nft}-${i}`}
                                    price={price_decimal}
                                    nftAddress={nft_address}
                                    tokenId={token_id}
                                    startTime={start_time}
                                    endTime={end_time}
                                    status={status}
                                    owner={owner}
                                    collectionId={collection_id}
                                />
                            )
                        })}
                    </div>
                </div>
            ) : (
                <div></div>
            )}

            <MakeOffer
                tokenAddress={tokenAddress}
                tokenId={tokenId}
                text={offerText}
                ref={offerRef}
                marketplaceAddress={marketplaceAddress}
                owner={token?.nft?.owner}
                tokenSymbol={tokenSymbol}
                collectionId={collectionId}
                value={token?.nft?.price_decimal}
                getTokenData={getTokenData}
                setLoadingVisible={setLoadingVisible}
            />
            <UpdateOffer
                tokenAddress={offerToUpdate?.nft_address}
                tokenId={offerToUpdate?.token_id}
                text={updateOfferText}
                ref={updateOfferRef}
                marketplaceAddress={offerToUpdate?.marketplace_address}
                owner={offerToUpdate?.owner}
                tokenSymbol={tokenSymbol}
                collectionId={offerToUpdate?.collection_id}
                value={token?.nft?.price_decimal}
                getTokenData={getTokenData}
                setLoadingVisible={setLoadingVisible}
            />

            <UpdatePrice
                ref={updatePriceRef}
                tokenAddress={tokenAddress}
                tokenId={tokenId}
                marketplaceAddress={marketplaceAddress}
                tokenSymbol={tokenSymbol}
                owner={token?.nft?.owner}
                collectionId={collectionId}
                getTokenData={getTokenData}
                setLoadingVisible={setLoadingVisible}
            />

            <SellItem
                ref={sellContRef}
                marketplaceAddress={marketplaceAddress}
                tokenAddress={tokenAddress}
                tokenId={tokenId}
                approved={token?.nft?.approved}
                tokenSymbol={tokenSymbol}
                creator={token?.nft?.creator}
                collectionId={collectionId}
                getTokenData={getTokenData}
                setLoadingVisible={setLoadingVisible2}
                setApproveStatus={setApproveStatus}
            />

            <div
                className={`fixed top-0 left-0 w-screen h-screen bg-light-dark opacity-95 z-50 flex align-middle ease-linear duration-100 transition-all ${loadingVisible} custom-loader`}
            >
                <div
                    className={`w-1/2 m-auto rounded-md border p-2 ${
                        darkMode ? "bg-dark" : "bg-white"
                    }`}
                >
                    <CustomLoader
                        status={"loading"}
                        message={"You wil be ask to sign transaction"}
                    />
                </div>
            </div>
            <div
                className={`fixed top-0 left-0 w-screen h-screen bg-light-dark opacity-95 z-50 flex align-middle ease-linear duration-100 transition-all ${loadingVisible2}`}
            >
                <div
                    className={`w-1/2 m-auto rounded-md border p-2 ${
                        darkMode ? "bg-dark" : "bg-white"
                    }`}
                >
                    <CustomLoader
                        status={approveStatus ? "complete" : "loading"}
                        message="You will be asked to approve marketplace"
                    />
                    <CustomLoader
                        status={approveStatus ? "loading" : "waiting"}
                        message="You will be asked to sign transaction"
                    />
                </div>
            </div>
        </div>
    )
}

export const getStaticPaths = async () => {
    const { data } = await axios.get("/nfts")

    const paths = data?.map((item) => ({
        params: {
            tokenAddress: item.nft_address,
            collectionId: item.collection_id,
            tokenId: item.token_id.toString(),
        },
    }))

    return {
        paths: paths,
        fallback: false,
    }
}

export const getStaticProps = ({ params }) => {
    return {
        props: { params },
    }
}
