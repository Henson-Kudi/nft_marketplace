import { useNotification } from "@web3uikit/core"
import { ethers } from "ethers"
import React, { forwardRef, useContext, useEffect, useRef, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import nftMarketplace from "../constants/NftMarketplace.json"
import { DarkModeContext } from "../contexts/darkModeprovider"
import { handlePutRequest } from "../utils/requests"
import InputPrimary from "./Inputs/InputPrimary"

export default forwardRef(function UpdateOffer(
    {
        tokenAddress,
        tokenId,
        marketplaceAddress,
        tokenSymbol,
        owner,
        collectionId,
        getTokenData,
        setLoadingVisible,
    },
    offerRef
) {
    const dispatchNotification = useNotification()
    const { account, chainId, isWeb3Enabled } = useMoralis()
    const { runContractFunction } = useWeb3Contract()

    const contentRef = useRef(null)

    const { darkMode } = useContext(DarkModeContext)

    const [amount, setAmount] = useState("")

    const dispatchError = (err) => {
        dispatchNotification({
            position: "topR",
            type: "error",
            message: err.message,
            title: "Error",
        })
        setAmount("")
        setLoadingVisible("invisible")
        offerRef.current.classList.remove("show-modal")
    }

    const dispatchSuccess = (message) => {
        setAmount("")
        setLoadingVisible("invisible")
        offerRef.current.classList.remove("show-modal")

        dispatchNotification({
            position: "topR",
            type: "success",
            message: message,
            title: "Success",
        })
    }

    useEffect(() => {
        document.addEventListener("mousedown", hideModal)

        return () => {
            document.removeEventListener("mousedown", hideModal)
        }
    }, [])

    const hideModal = (e) => {
        const { current } = contentRef
        if (current && !current.contains(e.target)) {
            offerRef.current.classList.remove("show-modal")
        }
    }

    const handleUpdateOffer = async (e) => {
        e.stopPropagation()

        const updateParams = {
            abi: nftMarketplace,
            contractAddress: marketplaceAddress,
            functionName: "updateListing",
            params: {
                nftAddress: tokenAddress,
                tokenId: tokenId,
                newPrice: amount,
            },
        }

        if (Number(amount) <= 0) {
            return alert("Amount must be gretater than zero (0)")
        }

        setLoadingVisible("visible")

        await runContractFunction({
            params: updateParams,
            onSuccess: async (tx) => {
                const today = new Date()

                const timeStamp = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`

                const txRcp = await tx.wait(1)

                const reqParams = {
                    block_hash: txRcp.blockHash,
                    block_timestamp: timeStamp,
                    transaction_hash: txRcp.transactionHash,
                    transaction_index: txRcp.transactionIndex,
                    token_decimal: tokenId,
                    token_id: tokenId,
                    log_index: txRcp.logs[0].logIndex,
                    block_number: txRcp.blockNumber,
                    function_name: "updateListing",
                    function_desc: "Updated Listing",
                    marketplace_address: marketplaceAddress,
                    nft_address: tokenAddress,
                    price: ethers.utils.parseEther(amount ? amount : "0").toString(),
                    price_decimal: amount,
                    measurement_unit: tokenSymbol,
                    owner: owner,
                    collection_id: collectionId,
                    from_address: txRcp.from,
                    to_address: txRcp.to,
                }

                const res = await handlePutRequest("/listings/list-item", reqParams, {})

                if (res.status !== 200) {
                    dispatchError({ message: "Unexpected server error" })
                }

                await getTokenData()
                dispatchSuccess("Price updated successfully")
            },
            onError: (err) => dispatchError(err),
        })
    }

    return (
        <div
            className="make-offer fixed top-0 left-0 w-full h-screen bg-lightest-black flex items-center justify-center invisible duration-300 transition-all ease-linear"
            ref={offerRef}
        >
            <div
                className={`content w-4/5 m-auto md:w-1/2 p-4 rounded-2xl ${
                    darkMode ? "bg-dark" : "bg-white"
                }`}
                ref={contentRef}
            >
                <div className=" py-2 md:py-4">
                    <p className="font-bold p-2">New Price</p>
                    <InputPrimary
                        type="text"
                        value={amount}
                        onChange={(e) => {
                            if (isNaN(e.target.value)) {
                                return alert("Please input valid number")
                            }
                            setAmount(e.target.value)
                        }}
                        placeholder="Enter new price"
                    />
                </div>

                <div className="flex justify-center py-2  md:py-4">
                    <button
                        className="p-4 w-4/5 mx-auto rounded-full bg-blue font-bold md:text-lg text-white"
                        onClick={handleUpdateOffer}
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    )
})
