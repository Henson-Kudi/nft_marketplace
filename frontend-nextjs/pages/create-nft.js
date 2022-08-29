import { faChevronCircleDown, faChevronCircleUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useRef, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"

import ButtonPrimary from "../components/Buttons/ButtonPrimary"
import InputFile from "../components/Inputs/InputFile"
import InputPrimary from "../components/Inputs/InputPrimary"
import TextArea from "../components/Inputs/TextArea"
import { DarkModeContext } from "../contexts/darkModeprovider"
import { baseUrl as axios } from "../utils/axios"
import { handlePostRequest } from "../utils/requests"

import { useNotification } from "@web3uikit/core"
import CustomLoader from "../components/CustomLoader"
import networkMapping from "../constants/networkMapping.json"
import nftToken from "../constants/NftToken.json"

export default function CreateNft() {
    const date = new Date()

    const router = useRouter()
    const { darkMode } = useContext(DarkModeContext)

    const { account, chainId, isWeb3Enabled, enableWeb3 } = useMoralis()

    const chainString = parseInt(chainId).toString()

    const nftAddress = networkMapping[chainString]?.NftToken[0]
    const marketplace_address = networkMapping[chainString]?.NftMarketplace[0]

    const collectionRef = useRef(null)

    const [file, setFile] = useState(null)

    const [cover, setCover] = useState(null)

    const [addCover, setAddCover] = useState(false)

    const [selectCollection, setSelectCollection] = useState(false)

    const [submitText, setSubmitText] = useState("Create")

    const [nftDetails, setNftDetails] = useState({
        name: "",
        description: "",
        link: "",
        royalties: "",
        collection_id: "",
        collection_name: "",
    })

    const [attributes, setAttributes] = useState([{ key: "", value: "" }])

    const [collections, setCollections] = useState([{}])
    const [tokenSymbol, setTokenSymbol] = useState("")
    const [loadingVisible, setLoadingVisible] = useState("invisible")
    const [mintStatus, setMintStatus] = useState({
        status: "loading",
        message: "You will be ask to sign transaction",
    })

    const [approveStatus, setApproveStatus] = useState({
        status: "waiting",
        message: "You will be ask to approve marketplace",
    })

    const { runContractFunction } = useWeb3Contract()
    const dispatchNotification = useNotification()

    const fetchCollections = async () => {
        try {
            const { data } = await axios.get("/collections")

            setCollections(data)
        } catch (err) {
            console.log(err)
        }
    }

    const getTokenSymbol = async () => {
        const symbol = await runContractFunction({
            params: {
                contractAddress: nftAddress,
                abi: nftToken,
                functionName: "symbol",
            },
            onSuccess: (tx) => tx,
        })

        setTokenSymbol(symbol)
    }

    useEffect(() => {
        fetchCollections()
        if (!isWeb3Enabled) {
            enableWeb3()
        }
        getTokenSymbol()
    }, [account])

    const handleFileChange = (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }

        if (file.type.includes("audio") || file.type.includes("video")) {
            setCover(null)
            setAddCover(true)
        }
        if (file.type.includes("image")) {
            setCover(null)
            setAddCover(false)
        }

        setFile(file)
    }

    const handleFileCoverChange = (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }

        if (!file.type.includes("image")) {
            alert("Please select valid file type (only images allowed)")

            return
        }
        setCover(file)
    }

    const handleNftDataChange = (e) => {
        const { name, value } = e.target

        setNftDetails((prev) => ({ ...prev, [name]: value }))
    }

    const handleAttributesChange = (name, index) => (e) => {
        let newArr = attributes.map((item, i) => {
            if (index === i) {
                return { ...item, [name]: e.target.value }
            } else {
                return item
            }
        })

        setAttributes(newArr)
    }

    const addAttribute = () => {
        if (attributes.length >= 10) {
            return alert("Cannot set more than 10 attributes")
        }
        setAttributes((prev) => [...prev, { key: "", value: "" }])
    }

    const handleShowSelectCollection = () => {
        setSelectCollection(!selectCollection)
        collectionRef.current.classList.toggle("show-collection")
    }

    const handleSelectCollection = (collection) => {
        setSelectCollection(!selectCollection)
        collectionRef.current.classList.toggle("show-collection")

        setNftDetails((prev) => ({
            ...prev,
            collection_id: collection.id,
            collection_name: collection.name,
        }))
    }

    const dispatchError = (e) =>
        dispatchNotification({
            position: "topR",
            title: "Error",
            type: "error",
            message: e.message,
        })

    const dispatchSuccess = (data) =>
        dispatchNotification({
            position: "topR",
            title: "Success",
            type: "success",
            message: data.message,
            onClick: () =>
                router.push(`/nfts/${nftAddress}/${nftDetails.collection_id}/${data.tokenId}`),
        })

    const mintNft = async (res) => {
        const mintParams = {
            abi: nftToken,
            contractAddress: nftAddress,
            functionName: "mintNft",
            params: {
                tokenUri: `ipfs://${res.data.IpfsHash}`,
            },
        }

        await runContractFunction({
            params: mintParams,
            onSuccess: async (tx) => {
                const txRcp = await tx.wait(1)

                setMintStatus((prev) => ({ ...prev, status: "complete" }))
                setApproveStatus((prev) => ({ ...prev, status: "loading" }))

                const requestData = {
                    block_hash: txRcp.blockHash,
                    block_timestamp: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
                    transaction_hash: txRcp.transactionHash,
                    transaction_index: txRcp.transactionIndex,
                    token_decimal: txRcp.events[0].args.tokenId.toString(),
                    token_id: txRcp.events[0].args.tokenId.toString(),
                    log_index: txRcp.logs[0].logIndex,
                    block_number: txRcp.blockNumber,
                    function_name: "mintNft",
                    function_desc: "minted nft token",
                    marketplace_address: marketplace_address,
                    nft_address: nftAddress,
                    price: 0,
                    price_decimal: 0,
                    measurement_unit: tokenSymbol,
                    owner: account,
                    creator: account,
                    start_time: null,
                    end_time: null,
                    collection_id: nftDetails.collection_id,
                    from_address: txRcp.from,
                    to_address: txRcp.to,
                }

                const postRes = await handlePostRequest("/nfts/mint-nft", requestData)

                if (postRes.status !== 200) {
                    throw { message: " Unexpected error while saving nft to database" }
                }

                await approveMarketplace(txRcp)
            },
            onError: (err) => {
                setFile(null)
                setCover(null)
                setLoadingVisible("invisible")
                setNftDetails({
                    collection_id: "",
                    collection_name: "",
                    description: "",
                    link: "",
                    name: "",
                    royalties: "",
                })
                setAttributes([{ key: "", value: "" }])
                setSubmitText("Create")
                dispatchError(err)
            },
        })
    }

    const approveMarketplace = async (txRcp) => {
        const approveParams = {
            abi: nftToken,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplace_address,
                tokenId: txRcp.events[0].args.tokenId,
            },
        }

        try {
            await runContractFunction({
                params: approveParams,
                onSuccess: async (tx) => {
                    const txRcp = await tx.wait(1)

                    setApproveStatus((prev) => ({ ...prev, status: "complete" }))

                    const requestData = {
                        block_hash: txRcp.blockHash.toString(),
                        block_timestamp: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
                        transaction_hash: txRcp.transactionHash.toString(),
                        transaction_index: txRcp.transactionIndex.toString(),
                        token_decimal: txRcp.events[0].args.tokenId.toString(),
                        token_id: txRcp.events[0].args.tokenId.toString(),
                        log_index: txRcp.logs[0].logIndex.toString(),
                        block_number: txRcp.blockNumber.toString(),
                        function_name: "approve",
                        function_desc: "approved marketplace",
                        marketplace_address: marketplace_address,
                        nft_address: nftAddress,
                        price: 0,
                        price_decimal: 0,
                        measurement_unit: tokenSymbol,
                        owner: account,
                        creator: account,
                        start_time: null,
                        end_time: null,
                        collection_id: nftDetails.collection_id,
                        from_address: txRcp.from,
                        to_address: txRcp.to,
                    }

                    const res = await handlePostRequest("/approve-nft", requestData, {})

                    dispatchSuccess({
                        message: "NFT Minted successfully. Click to view nft",
                        tokenId: txRcp.events[0].args.tokenId.toString(),
                        nftAddress: nftAddress,
                    })

                    setFile(null)
                    setCover(null)
                    setNftDetails({
                        collection_id: "",
                        collection_name: "",
                        description: "",
                        link: "",
                        name: "",
                        royalties: "",
                    })
                    setAttributes([{ key: "", value: "" }])
                    setSubmitText("Create")
                },
                onError: (e) => {
                    setFile(null)
                    setCover(null)
                    setLoadingVisible("invisible")
                    setNftDetails({
                        collection_id: "",
                        collection_name: "",
                        description: "",
                        link: "",
                        name: "",
                        royalties: "",
                    })
                    setAttributes([{ key: "", value: "" }])
                    setSubmitText("Create")
                    dispatchError(e)
                },
            })
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingVisible("invisible")
            setSubmitText("Create")
            setMintStatus((prev) => ({ ...prev, status: "loading" }))
            setApproveStatus((prev) => ({ ...prev, status: "waiting" }))
        }
    }

    const handleCreateNft = async () => {
        const formData = new FormData()
        const data = {
            ...nftDetails,
            attributes: attributes?.filter(
                (attribute) => attribute.key != "" && attribute.value != ""
            ),
        }
        if (file.type.includes("image")) {
            formData.append("image", file)
        }
        if (file.type.includes("video")) {
            formData.append("video", file)
        }
        if (file.type.includes("audio")) {
            formData.append("audio", file)
        }
        if (cover) {
            formData.append("image", file)
        }
        formData.append("data", JSON.stringify(data))
        try {
            setSubmitText("Creating...")
            setLoadingVisible("visible")
            const res = await handlePostRequest("/uploads/nft-data", formData, {
                headers: { "COntent-Type": "multipart/form-data" },
            })
            if (!res.data.IpfsHash) {
                throw { message: "unexpected error occuured. Please try later" }
            }
            await mintNft(res)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className={`${darkMode && "bg-dark text-white"}`}>
            <div className={`w-4/5 m-auto md:w-4/6 lg:w-1/2 py-6`}>
                <div className="grid md:grid-cols-2 gap-2 justify-center align-middle">
                    <div className="sm:w-full">
                        <InputFile
                            onChange={handleFileChange}
                            label="Chose file"
                            htmlFor="file"
                            id="file"
                            name="file"
                            filename={file?.name}
                        />
                    </div>
                    {addCover && (
                        <div className="w-full">
                            <InputFile
                                onChange={handleFileCoverChange}
                                label="Chose Cover"
                                htmlFor="cover"
                                id="cover"
                                name="cover"
                                accept="image/*"
                                filename={cover?.name}
                            />
                        </div>
                    )}
                </div>

                <div className="">
                    {/* <label htmlFor="name">Name</label> */}
                    <div>
                        <InputPrimary
                            type="text"
                            name="name"
                            id="name"
                            value={nftDetails.name}
                            placeholder="Enter NFT name"
                            onChange={handleNftDataChange}
                        />
                    </div>
                </div>

                <div>
                    <div className="relative">
                        <InputPrimary
                            readOnly
                            onClick={handleShowSelectCollection}
                            placeholder="Select Collection"
                            value={nftDetails?.collection_name}
                        />
                        <FontAwesomeIcon
                            icon={selectCollection ? faChevronCircleUp : faChevronCircleDown}
                            className="absolute top-1/2 right-4 -translate-y-1/2"
                            onClick={handleShowSelectCollection}
                        />

                        <div
                            className={`capitalize select-collection absolute -top-full left-0  w-full max-h-52 overflow-y-auto rounded-xl border-2 duration-300 transition-all ease-linear invisible ${
                                darkMode ? "bg-dark" : "bg-white"
                            }`}
                            ref={collectionRef}
                        >
                            <div className="flex justify-center border-b-2 last:border-b-0">
                                <ButtonPrimary
                                    title={"New Collection"}
                                    onClick={() => router.push("/new-collection")}
                                />
                            </div>
                            {collections?.map((collection, i) => (
                                <div
                                    key={`${collection?.id}-${i}`}
                                    className="input-primary border-b-2 last:border-b-0  cursor-pointer p-2 w-full outline-0 hover:bg-light-dark hover:text-white"
                                    onClick={() => handleSelectCollection(collection)}
                                >
                                    {collection?.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    {/* <label htmlFor="description">Description</label> */}
                    <TextArea
                        name="description"
                        id="description"
                        value={nftDetails.description}
                        placeholder="Describe your nft"
                        onChange={handleNftDataChange}
                    />
                </div>

                <div>
                    {/* <label htmlFor="link">External Link</label> */}
                    <InputPrimary
                        type="text"
                        name="link"
                        id="link"
                        value={nftDetails.link}
                        placeholder="Enter NFT external link"
                        onChange={handleNftDataChange}
                        className="border-2 rounded-md"
                    />
                </div>

                <div>
                    {/* <label htmlFor="royalties">Royalties</label> */}
                    <InputPrimary
                        type="text"
                        name="royalties"
                        id="royalties"
                        value={nftDetails.royalties}
                        placeholder="Enter NFT royalties (e.g 2%)"
                        onChange={handleNftDataChange}
                        className="border-2 rounded-md"
                    />
                </div>

                <div>Add Attrinutes</div>
                {attributes?.map((attribute, i) => (
                    <div key={i} className="flex gap-2">
                        <div className="flex-1">
                            <InputPrimary
                                type="text"
                                name="key"
                                placeholder="Attribute Key"
                                onChange={handleAttributesChange("key", i)}
                                className="border-2 rounded-md"
                                value={attribute.key}
                            />
                        </div>
                        <div className="flex-1">
                            <InputPrimary
                                type="text"
                                name="value"
                                placeholder="Attribute value"
                                onChange={handleAttributesChange("value", i)}
                                className="border-2 rounded-md"
                                value={attribute.value}
                            />
                        </div>
                    </div>
                ))}
                <div className="text-right">
                    <button
                        disabled={attributes.length === 10}
                        className="rounded-md border p-1 hover:bg-slate-200"
                        onClick={addAttribute}
                    >
                        Add Attribute
                    </button>
                </div>

                <div>
                    <ButtonPrimary
                        title={submitText}
                        className={`${
                            !nftDetails.name ||
                            !nftDetails.collection_id ||
                            (!file?.type?.includes("image") && !cover?.type?.includes("image")) ||
                            submitText !== "Create"
                                ? "bg-slate-300 text-grey"
                                : "bg-blue text-white"
                        } `}
                        onClick={handleCreateNft}
                        disabled={
                            !nftDetails.name ||
                            !nftDetails.collection_id ||
                            (!file && !cover) ||
                            submitText !== "Create"
                        }
                    />
                </div>
            </div>
            <div
                className={`fixed top-0 left-0 w-screen h-screen bg-light-dark opacity-95 z-50 flex align-middle ease-linear duration-100 transition-all ${loadingVisible}`}
            >
                <div
                    className={`w-1/2 m-auto rounded-md border p-2 ${
                        darkMode ? "bg-dark" : "bg-white"
                    }`}
                >
                    <CustomLoader status={mintStatus.status} message={mintStatus.message} />
                    <CustomLoader status={approveStatus.status} message={approveStatus.message} />
                </div>
            </div>
        </div>
    )
}
