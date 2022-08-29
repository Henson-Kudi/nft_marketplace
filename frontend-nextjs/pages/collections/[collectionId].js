import { faEllipsis, faGlobe, faShareNodes, faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useContext, useEffect, useRef, useState } from "react"
import InputPrimary from "../../components/Inputs/InputPrimary"
import { DarkModeContext } from "../../contexts/darkModeprovider"
import { baseUrl as axios } from "../../utils/axios"
import { handleGetRequest } from "../../utils/requests"

import Image from "next/image"
import etherscanImg from "../../assets/images/etherscan.jpg"
import CustomLoader from "../../components/CustomLoader"
import NftBox from "../../components/NftBox"

export default function Collection({ params }) {
    const shareOptionsRef = useRef(null)
    const reportRef = useRef(null)
    const filterOptionsRef = useRef(null)

    const { collectionId } = params
    const { darkMode } = useContext(DarkModeContext)

    const [collection, setCollection] = useState({})
    const [loadingVisible, setLoadingVisible] = useState("invisible")

    const getCollection = async () => {
        const collection = await handleGetRequest(`/collections/${collectionId}`)

        setCollection(collection)
    }

    useEffect(() => {
        getCollection()

        return () => {}
    }, [])

    useEffect(() => {
        document.addEventListener("mousedown", clickOutsideShare)
        document.addEventListener("mousedown", clickOutsideReport)
        document.addEventListener("mousedown", clickOutsideFilterOptions)

        return () => {
            document.removeEventListener("mousedown", clickOutsideShare)
            document.removeEventListener("mousedown", clickOutsideReport)
            document.removeEventListener("mousedown", clickOutsideFilterOptions)
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
    const clickOutsideFilterOptions = (e) => {
        const { current } = filterOptionsRef
        if (current && !current.contains(e.target)) {
            current.classList.remove("filter-options")
        }
    }

    const showShareOptions = (e) => {
        shareOptionsRef.current.classList.add("share-cont")
    }

    const showReportOptions = (e) => {
        reportRef.current.classList.add("report-cont")
    }

    const showFilterOptions = (e) => {
        filterOptionsRef.current.classList.add("filter-options")
    }

    return (
        <div className={`${darkMode && "bg-dark text-white"} min-h-screen`}>
            <div className={`logo-banner-cont relative ${darkMode && "dark-banner"}`}>
                <div className="h-20 md:h-40 overflow-hidden">
                    <img
                        src={collection?.collection?.banner?.replace(
                            "ipfs://",
                            "https://ipfs.io/ipfs/"
                        )}
                        className="w-full h-full"
                    />
                </div>
                <div className="collection-logo absolute top-full left-9 rounded-md overflow-hidden w-20 md:w-40 h-20 md:h-40">
                    <img
                        src={collection?.collection?.logo?.replace(
                            "ipfs://",
                            "https://ipfs.io/ipfs/"
                        )}
                        className="w-full h-full rounded-md"
                    />
                </div>
            </div>

            <div className="p-6 pt-6 md:pt-10">
                <div className="flex justify-between align-middle">
                    <div className="font-bold text-lg md:text-2xl">
                        <div>{collection?.collection?.name}</div>
                        <div
                            className="font-normal text-xs md:text-base cursor-pointer border rounded-xl text-center w-max px-1 mt-1"
                            onClick={() => alert("finish this routing")}
                        >
                            Created By :{" "}
                            {`${collection?.collection?.creator?.slice(
                                0,
                                4
                            )}...${collection?.collection?.creator?.slice(-4)}`}
                        </div>
                    </div>
                    <div className="flex gap-2 align-middle my-auto">
                        <div className="cursor-pointer mx-2 my-auto relative group">
                            <Image
                                src={etherscanImg}
                                width={25}
                                height={25}
                                className="p-2 rounded-full hover:bg-light-dark hover:text-white m-auto"
                            />
                            <span
                                className={`absolute bottom-full mb-2 right-0 p-4 w-max rounded-lg bg-black font-bold invisible transition-all duration-150 ease-linear group-hover:visible ${
                                    !darkMode && "text-white"
                                }`}
                            >
                                View on etherscan
                            </span>
                        </div>

                        {collection?.collection?.website && (
                            <div
                                className="cursor-pointer mx-2 my-auto relative group"
                                onClick={() =>
                                    window.open(collection?.collection?.website, "_blank")
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faGlobe}
                                    className="p-2 rounded-full hover:bg-light-dark hover:text-white m-auto"
                                />
                                <span
                                    className={`absolute bottom-full mb-2 right-0 p-4 w-max rounded-lg bg-black font-bold invisible transition-all duration-150 ease-linear group-hover:visible ${
                                        !darkMode && "text-white"
                                    }`}
                                >
                                    Website
                                </span>
                            </div>
                        )}

                        <div className="cursor-pointer mx-2 my-auto relative group">
                            <FontAwesomeIcon
                                icon={faStar}
                                className="p-2 rounded-full hover:bg-light-dark hover:text-white m-auto"
                            />
                            <span
                                className={`absolute bottom-full mb-2 right-0 p-4 w-max rounded-lg bg-black font-bold invisible transition-all duration-150 ease-linear group-hover:visible ${
                                    !darkMode && "text-white"
                                }`}
                            >
                                Watch Collection
                            </span>
                        </div>

                        <div
                            className="cursor-pointer mx-2 my-auto relative group"
                            onClick={showShareOptions}
                            ref={shareOptionsRef}
                        >
                            <FontAwesomeIcon
                                icon={faShareNodes}
                                className="p-2 rounded-full hover:bg-light-dark
                        hover:text-white m-auto"
                            />
                            <span
                                className={`absolute bottom-full mb-2 right-0 p-4 w-max rounded-lg bg-black font-bold invisible transition-all duration-150 ease-linear group-hover:visible ${
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
                                icon={faEllipsis}
                                className="p-2 rounded-full hover:bg-light-dark
                        hover:text-white m-auto"
                            />
                            <span
                                className={`absolute bottom-full mb-2 right-0 p-4 w-max rounded-lg bg-black font-bold invisible transition-all duration-150 ease-linear group-hover:visible ${
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

                <div className="max-w-md max-h-64 overflow-y-auto py-4">
                    {collection?.collection?.description}
                </div>

                <div className="flex gap-2 flex-wrap align-middle py-2">
                    <div className="flex flex-col gap p-2">
                        <span className="font-bold text-lg md:text-xl">
                            {collection?.collection?.total_items}
                        </span>
                        <span className="text-grey text-sm md:text-lg w-max">Items</span>
                    </div>

                    <div className="flex flex-col gap p-2">
                        <span className="font-bold text-lg md:text-xl">
                            {collection?.collection?.total_owners}
                        </span>
                        <span className="text-grey text-sm md:text-lg w-max">Owners</span>
                    </div>

                    <div className="flex flex-col gap p-2">
                        <span className="font-bold text-lg md:text-xl">
                            {collection?.collection?.lowest_price}
                        </span>
                        <span className="text-grey text-sm md:text-lg w-max">Floor Price</span>
                    </div>

                    <div className="flex flex-col gap p-2">
                        <span className="font-bold text-lg md:text-xl">
                            {collection?.collection?.highest_price}
                        </span>
                        <span className="text-grey text-sm md:text-lg w-max">Highest Price</span>
                    </div>

                    <div className="flex flex-col gap p-2">
                        <span className="font-bold text-lg md:text-xl">
                            {Number(collection?.collection?.average_price).toFixed(2)}
                        </span>
                        <span className="text-grey text-sm md:text-lg w-max">Average Price</span>
                    </div>
                </div>

                <div className="flex gap-2 align-middle flex-wrap w-full">
                    <div className="md:flex-1">
                        <InputPrimary
                            type="text"
                            name="search_nft"
                            placeholder="search nft by name"
                            id="search_nft"
                        />
                    </div>

                    <div className="relative m-auto border rounded-md px-2 md:px-4 py-2 md:text-lg min-w cursor-pointer">
                        <div onClick={showFilterOptions}>
                            <span className="">Price high to low</span>
                        </div>
                        <div
                            className="show-filter flex flex-col align-middle gap-2 absolute left-0 -top-full invisible -z-10 mt-3 border rounded-md overflow-hidden bg-white text-black w-max duration-300 transition-all"
                            ref={filterOptionsRef}
                        >
                            <span className="p-2 border-b hover:bg-dark hover:text-white duration-300 transition-all">
                                Price low to high
                            </span>
                            <span className="p-2 border-b hover:bg-dark hover:text-white duration-300 transition-all">
                                By NFT name
                            </span>
                            <span className="p-2 border-b hover:bg-dark hover:text-white duration-300 transition-all">
                                Most favorited
                            </span>
                        </div>
                    </div>
                    <div
                        className="px-2 md:px-4 py-2 md:text-lg border rounded-md cursor-pointer"
                        onClick={() => alert("Coming in next major release")}
                    >
                        <span>Make Collection Offer</span>
                    </div>
                </div>

                <div>
                    <div className="font-bold text-lg md:text-xl py-4">Items</div>

                    <div className="flex gap-4 items-center flex-wrap">
                        {collection?.nfts?.length > 0 ? (
                            collection?.nfts?.map((nft, i) => {
                                const {
                                    nft_address,
                                    token_id,
                                    price_decimal,
                                    start_time,
                                    end_time,
                                    status,
                                    owner,
                                    collection_id,
                                    marketplace_address,
                                    measurement_unit,
                                } = nft

                                return (
                                    <NftBox
                                        key={`${nft?.id}-${i}`}
                                        image={nft?.image}
                                        nftAddress={nft_address}
                                        tokenId={token_id}
                                        price={price_decimal}
                                        startTime={Number(start_time)}
                                        endTime={Number(end_time)}
                                        status={status}
                                        owner={owner}
                                        marketplaceAddress={marketplace_address}
                                        measurementUnit={measurement_unit}
                                        collectionId={collection_id}
                                        makleOfferRef={() =>
                                            makeOfferRef.current.classList.add("sow-modal")
                                        }
                                        getTokenData={getCollection}
                                        serLoadingVisible={setLoadingVisible}
                                    />
                                )
                            })
                        ) : (
                            <div className="w-full p-4 text-center">
                                <p>This collection does not have any nfts yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
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
        </div>
    )
}

export const getStaticProps = ({ params }) => {
    return {
        props: { params },
    }
}

export const getStaticPaths = async () => {
    const { data } = await axios.get("/collections")

    const paths = data?.map((item) => ({
        params: { collectionId: item.id },
    }))

    return {
        paths: paths,
        fallback: false,
    }
}
