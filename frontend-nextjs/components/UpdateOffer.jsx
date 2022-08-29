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
        text,
        tokenAddress,
        tokenId,
        marketplaceAddress,
        tokenSymbol,
        owner,
        collectionId,
        value,
        getTokenData,
        setLoadingVisible,
    },
    offerRef
) {
    const selectDeadlineRef = useRef(null)
    const dispatchNotification = useNotification()
    const { account, chainId, isWeb3Enabled } = useMoralis()
    const { runContractFunction } = useWeb3Contract()

    const contentRef = useRef(null)

    const { darkMode } = useContext(DarkModeContext)

    const [date, setDate] = useState({
        duration: "3",
        type: "days",
        endDate: function () {
            return new Date().setDate(new Date().getDate() + Number(this.duration))
        },
    })

    const [amount, setAmount] = useState("")

    const dispatchError = (err) => {
        dispatchNotification({
            position: "topR",
            type: "error",
            message: err.message,
            title: "Error",
        })
        setAmount(0)
        setLoadingVisible("invisible")
        offerRef.current.classList.remove("show-modal")
    }

    const dispatchSuccess = (message) => {
        setAmount(0)
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
        document.addEventListener("mousedown", closeSelectDeadline)
        document.addEventListener("mousedown", hideModal)

        return () => {
            document.removeEventListener("mousedown", closeSelectDeadline)
            document.removeEventListener("mousedown", hideModal)
        }
    }, [])

    const hideModal = (e) => {
        const { current } = contentRef
        if (current && !current.contains(e.target)) {
            offerRef.current.classList.remove("show-modal")
        }
    }

    const selectDeadline = (e) => {
        selectDeadlineRef.current.classList.toggle("show-deadline")
    }

    const closeSelectDeadline = (e) => {
        const { current } = selectDeadlineRef
        if (current && !current.contains(e.target)) {
            current.classList.remove("show-deadline")
        }
    }

    const handleUpdateOffer = async (e) => {
        e.stopPropagation()

        const offerParams = {
            abi: nftMarketplace,
            contractAddress: marketplaceAddress,
            functionName: "updateOffer",
            params: {
                nftAddress: tokenAddress,
                deadline: new Date(date.endDate()).getTime(),
                tokenId: tokenId,
            },
            msgValue: amount,
        }

        if (Number(amount) <= 0) {
            return alert("Amount must be gretater than zero (0)")
        }

        if (text === "Update Bid" && Number(amount) < Number(value)) {
            return alert("Bid cannot be less than auction price")
        }

        setLoadingVisible("visible")

        await runContractFunction({
            params: offerParams,
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
                    function_name: text === "Update Bid" ? "updateBid" : "updateOffer",
                    function_desc: text,
                    marketplace_address: marketplaceAddress,
                    nft_address: tokenAddress,
                    price: ethers.utils.parseEther(amount ? amount : "0").toString(),
                    price_decimal: amount,
                    measurement_unit: tokenSymbol,
                    owner: owner,
                    offerer: account,
                    deadline: new Date(date.endDate()),
                    collection_id: collectionId,
                    from_address: txRcp.from,
                    to_address: txRcp.to,
                }

                const res = await handlePutRequest("/offers", reqParams, {})

                if (res.status !== 200) {
                    dispatchError({ message: "Unexpected server error" })
                }

                await getTokenData()
                dispatchSuccess(
                    text === "Update Bid"
                        ? "Bid updated successfully"
                        : "Offer updated successfully"
                )
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
                    <p className="font-bold p-2">Amount</p>
                    <InputPrimary
                        type="text"
                        value={amount}
                        onChange={(e) => {
                            if (isNaN(e.target.value)) {
                                return alert("Please input valid number")
                            }
                            setAmount(e.target.value)
                        }}
                        placeholder="Enter amount"
                    />
                </div>

                <div className=" py-2 md:py-4">
                    <p className="font-bold p-2">Deadline</p>
                    <div className="flex items-center gap-4">
                        <div className="relative" onClick={selectDeadline}>
                            <InputPrimary
                                type="text"
                                readOnly
                                value={`${date.duration} ${date.type}`}
                            />
                            <div
                                className={`select-deadline absolute -top-full left-0 mt-1 border rounded-lg overflow-hidden invisible duration-300 transition-all max-h-60 overflow-y-auto ${
                                    darkMode ? "bg-dark" : "bg-white"
                                }`}
                                ref={selectDeadlineRef}
                            >
                                <p
                                    className="p-2 border-b last:border-b-0 cursor-pointer"
                                    onClick={() =>
                                        setDate((prev) => ({
                                            ...prev,
                                            duration: "1",
                                            type: "day",
                                        }))
                                    }
                                >
                                    1 Day
                                </p>
                                <p
                                    className="p-2 border-b last:border-b-0 cursor-pointer"
                                    onClick={() => setDate((prev) => ({ ...prev, duration: "5" }))}
                                >
                                    5 Days
                                </p>
                                <p
                                    className="p-2 border-b last:border-b-0 cursor-pointer"
                                    onClick={() => setDate((prev) => ({ ...prev, duration: "7" }))}
                                >
                                    7 Days
                                </p>
                                <p
                                    className="p-2 border-b last:border-b-0 cursor-pointer"
                                    onClick={() => setDate((prev) => ({ ...prev, duration: "10" }))}
                                >
                                    10 Days
                                </p>
                                <p
                                    className="p-2 border-b last:border-b-0 cursor-pointer"
                                    onClick={() => setDate((prev) => ({ ...prev, duration: "15" }))}
                                >
                                    15 Days
                                </p>
                                <p
                                    className="p-2 border-b last:border-b-0 cursor-pointer"
                                    onClick={() => setDate((prev) => ({ ...prev, duration: "20" }))}
                                >
                                    20 Days
                                </p>
                                <p
                                    className="p-2 border-b last:border-b-0 cursor-pointer"
                                    onClick={() => setDate((prev) => ({ ...prev, duration: "30" }))}
                                >
                                    1 Month
                                </p>
                                <p
                                    className="p-2 border-b last:border-b-0 cursor-pointer"
                                    onClick={() => setDate((prev) => ({ ...prev, duration: "60" }))}
                                >
                                    2 Months
                                </p>
                                <p
                                    className="p-2 border-b last:border-b-0 cursor-pointer"
                                    onClick={() => setDate((prev) => ({ ...prev, duration: "90" }))}
                                >
                                    3 Months
                                </p>
                            </div>
                        </div>
                        <div>
                            <InputPrimary
                                readOnly
                                value={new Date(date.endDate()).toLocaleString()}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-center py-2  md:py-4">
                    <button
                        className="p-4 w-4/5 mx-auto rounded-full bg-blue font-bold md:text-lg text-white"
                        onClick={handleUpdateOffer}
                    >
                        {text}
                    </button>
                </div>
            </div>
        </div>
    )
})
