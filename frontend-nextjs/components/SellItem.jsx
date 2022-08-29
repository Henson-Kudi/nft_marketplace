import { useNotification } from "@web3uikit/core"
import { ethers } from "ethers"
import React, { forwardRef, useContext, useEffect, useRef, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import nftMarketplace from "../constants/NftMarketplace.json"
import nftToken from "../constants/NftToken.json"
import { DarkModeContext } from "../contexts/darkModeprovider"
import { handlePostRequest } from "../utils/requests"
import InputPrimary from "./Inputs/InputPrimary"

export default forwardRef(function SellItem(
    {
        marketplaceAddress,
        tokenAddress,
        tokenId,
        approved,
        tokenSymbol,
        creator,
        collectionId,
        getTokenData,
        setLoadingVisible,
        setApproveStatus,
    },
    sellContRef
) {
    const hourref = useRef()
    const minref = useRef()
    const endhourref = useRef()
    const endminref = useRef()
    const selectDeadlineRef = useRef()
    const selectDaysRef = useRef()
    const sellRef = useRef()

    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`

    const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`

    const hr = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`

    const min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`

    const maxDate = new Date().setDate(new Date().getDate() + 15)
    const maxyear = new Date(maxDate).getFullYear()
    const maxmonth =
        new Date(maxDate).getMonth() < 10
            ? `0${new Date(maxDate).getMonth() + 1}`
            : new Date(maxDate).getMonth() + 1
    const maxday =
        new Date(maxDate).getDate() < 10
            ? `0${new Date(maxDate).getDate()}`
            : new Date(maxDate).getDate()

    const hrs = Array.from(Array(24).keys())
    const mins = Array.from(Array(60).keys())

    const { darkMode } = useContext(DarkModeContext)

    const [saleType, setSaleType] = useState("list")
    const [saleAmount, setSaleAmount] = useState("")
    const [startTime, setStartTime] = useState({
        date: `${year}-${month}-${day}`,
        hr: hr,
        min: min,
        maxDate: function () {
            const date = new Date(this.date)

            date.setMonth(date.getMonth() + 6)

            const year = date.getFullYear()

            const month =
                date.getMonth() < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`

            const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`

            return `${year}-${month}-${day}`
        },
    })
    const [endTime, setEndTime] = useState({
        date: `${maxyear}-${maxmonth}-${maxday}`,
        hr: startTime.hr,
        min: startTime.min,
        days: function () {
            const startDate = new Date(startTime.date)
            startDate.setHours(startTime.hr, startTime.min)

            const endDate = new Date(this.date)

            endDate.setHours(this.hr, this.min)

            const returnDate = endDate.toLocaleString()

            // const returnDays = Math.floor((endDate - startDate) / (86400 * 1000))

            return `Until : ${endDate >= startDate && returnDate}`
        },
    })

    const dispatchNotification = useNotification()

    const dispatchError = (err) => {
        dispatchNotification({
            position: "topR",
            type: "error",
            title: "Error",
            message: err.message,
        })

        setSaleAmount(0)
        setLoadingVisible("invisible")
        sellRef.current.classList.remove("show-modal")
    }

    const dispatchSuccess = (message) => {
        setSaleAmount(0)
        setLoadingVisible("invisible")
        // sellRef.current.classList.remove("show-modal")
        sellContRef.current.classList.remove("sell-modal")

        dispatchNotification({
            position: "topR",
            type: "success",
            title: "Success",
            message: message,
        })
    }

    const { runContractFunction } = useWeb3Contract()
    const { account, chainId, isWeb3Enabled } = useMoralis()

    useEffect(() => {
        document.addEventListener("mousedown", closeSelectHour)
        document.addEventListener("mousedown", closeSelectMin)
        document.addEventListener("mousedown", closeSelectHourend)
        document.addEventListener("mousedown", closeSelectMinend)
        document.addEventListener("mousedown", closeSelectDays)
        document.addEventListener("mousedown", closeSellModal)

        return () => {
            document.removeEventListener("mousedown", closeSelectHour)
            document.removeEventListener("mousedown", closeSelectMin)
            document.removeEventListener("mousedown", closeSelectHourend)
            document.removeEventListener("mousedown", closeSelectMinend)
            document.removeEventListener("mousedown", closeSelectDays)
            document.removeEventListener("mousedown", closeSellModal)
        }
    }, [])

    const closeSelectHour = (e) => {
        const { current } = hourref
        if (current && !current.contains(e.target)) {
            current.classList.remove("select-hour")
        }
    }

    const closeSelectMin = (e) => {
        const { current } = minref
        if (current && !current.contains(e.target)) {
            current.classList.remove("select-min")
        }
    }

    const closeSelectHourend = (e) => {
        const { current } = endhourref
        if (current && !current.contains(e.target)) {
            current.classList.remove("select-hour")
        }
    }

    const closeSelectMinend = (e) => {
        const { current } = endminref
        if (current && !current.contains(e.target)) {
            current.classList.remove("select-min")
        }
    }

    const closeSelectDays = (e) => {
        const { current } = selectDeadlineRef
        if (current && !current.contains(e.target)) {
            current.classList.remove("show-deadline")
        }
    }

    const closeSellModal = (e) => {
        const { current } = sellRef
        if (current && !current.contains(e.target)) {
            sellContRef.current.classList.remove("sell-modal")
        }
    }

    const selectHour = (e) => {
        e.stopPropagation()
        hourref.current.classList.toggle("select-hour")
    }

    const selectMin = (e) => {
        e.stopPropagation()
        minref.current.classList.toggle("select-min")
    }

    const selectHourend = (e) => {
        e.stopPropagation()
        endhourref.current.classList.toggle("select-hour")
    }

    const selectMinend = (e) => {
        e.stopPropagation()
        endminref.current.classList.toggle("select-min")
    }

    const showSelectDays = () => {
        selectDeadlineRef.current.classList.toggle("show-deadline")
    }

    const changeEndDays = (days) => {
        const date = new Date(startTime.date)

        date.setHours(startTime.hr, startTime.min)

        date.setDate(date.getDate() + days)

        const year = date.getFullYear()
        const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth()}`
        const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`
        const hour = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
        const min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`

        setEndTime((prev) => ({
            ...prev,
            date: `${year}-${month}-${day}`,
            hr: hour,
            min: min,
            // days: function () {
            //     const startDate = new Date(startTime.date)
            //     startDate.setHours(startTime.hr, startTime.min)

            //     const returnDate = date.toLocaleString()

            //     const returnDays = Math.floor((date - startDate) / (86400 * 1000))

            //     return `${
            //         returnDays > 1
            //             ? `${returnDays} days`
            //             : returnDays < 0
            //             ? "invalid"
            //             : `${returnDays} day`
            //     } (Until : ${date >= startDate && returnDate})`
            // },
        }))
        showSelectDays()
    }

    const handleListNft = async () => {
        if (Number(saleAmount) <= 0) {
            return alert("Amount must be greater than zero(0)")
        }

        if (!isWeb3Enabled) {
            return alert("Please connect to metamask")
        }

        setLoadingVisible("visible")

        if (!approved) {
            await approveMarketPlace()
            return
        }

        await listItem()
    }

    const approveMarketPlace = async () => {
        const today = new Date()

        const timeStamp = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`

        const approveParams = {
            abi: nftToken,
            contractAddress: tokenAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: approveParams,
            onSuccess: async (tx) => {
                const txRcp = await tx.wait(1)
                const requestData = {
                    block_hash: txRcp.blockHash,
                    block_timestamp: timeStamp,
                    transaction_hash: txRcp.transactionHash,
                    transaction_index: txRcp.transactionIndex,
                    token_decimal: txRcp.events[0].args.tokenId.toString(),
                    token_id: txRcp.events[0].args.tokenId.toString(),
                    log_index: txRcp.logs[0].logIndex,
                    block_number: txRcp.blockNumber,
                    function_name: "approve",
                    function_descL: "Approving marketplace",
                    marketplace_address: marketplaceAddress,
                    nft_address: tokenAddress,
                    price: ethers.utils.parseEther(saleAmount ? saleAmount : "0").toString(),
                    price_decimal: saleAmount,
                    measurement_unit: tokenSymbol,
                    owner: account,
                    creator: creator,
                    collection_id: collectionId,
                    status: saleType === "list" ? "listed" : "auctioned",
                    from_address: txRcp.from,
                    to_address: txRcp.to,
                }

                const res = await handlePostRequest("/nfts/approve-nft", requestData, {})

                if (res.status !== 200) {
                    return dispatchError({ message: "Unexpected error occured. Try later" })
                }
                setApproveStatus(true)

                await listItem()
            },
            onError: (err) => {
                console.log(err)
                dispatchError(err)
            },
        })
    }

    const listItem = async () => {
        const start_time = new Date(startTime.date)
        start_time.setHours(Number(startTime.hr), Number(startTime.min))

        const end_time = new Date(endTime.date)

        end_time.setHours(endTime.hr, endTime.min)

        const today = new Date()

        const timeStamp = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`

        const listParams = {
            abi: nftMarketplace,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: tokenAddress,
                tokenId: tokenId,
                price: saleAmount,
                startTime: Math.floor(start_time.getTime() / 1000),
                endTime: Math.floor(end_time.getTime() / 1000),
            },
        }

        await runContractFunction({
            params: listParams,
            onSuccess: async (tx) => {
                const txRcp = await tx.wait(1)

                const requestData = {
                    block_hash: txRcp.blockHash,
                    block_timestamp: timeStamp,
                    transaction_hash: txRcp.transactionHash,
                    transaction_index: txRcp.transactionIndex,
                    token_decimal: txRcp.events[0].args.tokenId.toString(),
                    token_id: txRcp.events[0].args.tokenId.toString(),
                    log_index: txRcp.logs[0].logIndex,
                    block_number: txRcp.blockNumber,
                    function_name: "listItem",
                    function_desc: "Listing to marketplace",
                    marketplace_address: marketplaceAddress,
                    nft_address: tokenAddress,
                    price: ethers.utils.parseEther(saleAmount ? saleAmount : "0").toString(),
                    price_decimal: saleAmount,
                    measurement_unit: tokenSymbol,
                    owner: account,
                    creator: creator,
                    start_time: start_time,
                    end_time: end_time,
                    collection_id: collectionId,
                    status: saleType === "list" ? "listed" : "auctioned",
                    from_address: txRcp.from,
                    to_address: txRcp.to,
                }

                const res = await handlePostRequest("/listings/list-item", requestData, {})

                if (res?.status === 200) {
                    await getTokenData()
                    return dispatchSuccess(res.message)
                }

                dispatchError({ message: "Unexpected error occured" })
            },
            onError: (err) => {
                console.log(err)
                dispatchError(err)
            },
        })
    }

    return (
        <div
            className="fixed top-0 left-0 w-full h-screen  flex justify-center items-center bg-lightest-black invisible ease-linear transition-all duration-300 show-sell-modal"
            ref={sellContRef}
        >
            <div
                className={`w-4/5 m-auto md:w-1/2 ${
                    darkMode ? "bg-dark" : "bg-white"
                } p-4 rounded-xl border`}
                ref={sellRef}
            >
                <div className="flex gap-4 justify-evenly items-center p-2 md:p-4 border-b">
                    <div
                        className={`${
                            saleType === "list" && "border-blue"
                        } sell-item px-4 md:px-8 py-2 md:py-4 rounded-xl border font-bold cursor-pointer`}
                        onClick={() => setSaleType("list")}
                    >
                        List on Sale
                    </div>
                    <div
                        className={`${
                            saleType === "auction" && "border-blue"
                        } sell-item px-4 md:px-8 py-2 md:py-4 rounded-xl border font-bold cursor-pointer`}
                        onClick={() => setSaleType("auction")}
                    >
                        List on Auction
                    </div>
                </div>

                <div className="amount">
                    <div className="font-bold p-2">Enter Amount</div>
                    <InputPrimary
                        placeholder="Enter amount"
                        type="text"
                        value={saleAmount}
                        onChange={(e) => {
                            if (isNaN(e.target.value)) {
                                alert("Invalid value")
                                return
                            }
                            setSaleAmount(e.target.value)
                        }}
                    />
                </div>

                <div>
                    <div className="font-bold p-2">Time Frame</div>
                    <div className="p-2 relative">
                        <div
                            className="px-2 md:px-8 py-2 md:py-4 border rounded-xl text-lg font-medium w-max"
                            onClick={showSelectDays}
                        >
                            {endTime.days()}
                        </div>

                        <div
                            className={`select-deadline absolute -top-full left-0 mt-1 border rounded-lg overflow-hidden invisible duration-300 transition-all max-h-60 overflow-y-auto ${
                                darkMode ? "bg-dark" : "bg-white"
                            }`}
                            ref={selectDeadlineRef}
                        >
                            <p
                                className="p-2 border-b last:border-b-0 cursor-pointer"
                                onClick={() => changeEndDays(5)}
                            >
                                5 Days
                            </p>
                            <p
                                className="p-2 border-b last:border-b-0 cursor-pointer"
                                onClick={() => changeEndDays(10)}
                            >
                                10 Days
                            </p>
                            <p
                                className="p-2 border-b last:border-b-0 cursor-pointer"
                                onClick={() => changeEndDays(15)}
                            >
                                15 Days
                            </p>
                            <p
                                className="p-2 border-b last:border-b-0 cursor-pointer"
                                onClick={() => changeEndDays(30)}
                            >
                                1 Month
                            </p>
                            <p
                                className="p-2 border-b last:border-b-0 cursor-pointer"
                                onClick={() => changeEndDays(90)}
                            >
                                3 Months
                            </p>
                            <p
                                className="p-2 border-b last:border-b-0 cursor-pointer"
                                onClick={() => {
                                    selectDaysRef.current.classList.add("show-custom-date")
                                    showSelectDays()
                                }}
                            >
                                Custom
                            </p>
                        </div>
                    </div>

                    <div
                        className="flex gap-4 items-center justify-between h-0 overflow-hidden duration-300 transition-all ease-linear hide-custom"
                        ref={selectDaysRef}
                    >
                        <div>
                            <div className="p-2">Start Date</div>
                            <div className="flex items-center">
                                <div>
                                    <InputPrimary
                                        type="date"
                                        min={`${year}-${month}-${day}`}
                                        max={`${maxyear}-${maxmonth}-${maxday}`}
                                        value={startTime.date}
                                        name="date"
                                        onChange={(e) =>
                                            setStartTime((prev) => ({
                                                ...prev,
                                                date: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="w-14 relative" ref={hourref} onClick={selectHour}>
                                    <InputPrimary
                                        type="text"
                                        value={startTime.hr}
                                        readOnly
                                        name="hr"
                                    />
                                    <div className="p-2 border rounded-lg absolute left-0 -top-full max-h-64 overflow-y-auto invisible -z-50 transition-all duration-300 show-select-hr">
                                        {hrs.map((hr, i) => (
                                            <div
                                                key={`${hr}-${i}`}
                                                className="border-b last:border-b-0 p-2 text-center cursor-pointer"
                                                onClick={() => {
                                                    const hour = hr < 10 ? `0${hr}` : hr
                                                    setStartTime((prev) => ({
                                                        ...prev,
                                                        hr: hour,
                                                    }))
                                                }}
                                            >
                                                {hr < 10 ? `0${hr}` : `${hr}`}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-14 relative" ref={minref} onClick={selectMin}>
                                    <InputPrimary
                                        type="text"
                                        value={startTime.min}
                                        readOnly
                                        name="min"
                                    />
                                    <div className="p-2 border rounded-lg absolute left-0 -top-full max-h-64 overflow-y-auto invisible transition-all duration-300 show-select-min">
                                        {mins.map((min, i) => (
                                            <div
                                                key={`${min}-${i}`}
                                                className="border-b last:border-b-0 p-2 text-center cursor-pointer"
                                                onClick={() => {
                                                    const minute = min < 10 ? `0${min}` : `${min}`
                                                    setStartTime((prev) => ({
                                                        ...prev,
                                                        min: minute,
                                                    }))
                                                }}
                                            >
                                                {min < 10 ? `0${min}` : min}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="p-2">End Date</div>
                            <div className="flex items-center">
                                <div>
                                    <InputPrimary
                                        type="date"
                                        min={startTime.date}
                                        max={startTime.maxDate()}
                                        value={endTime.date}
                                        name="endTime"
                                        onChange={(e) =>
                                            setEndTime((prev) => ({
                                                ...prev,
                                                date: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div
                                    className="w-14 relative"
                                    ref={endhourref}
                                    onClick={selectHourend}
                                >
                                    <InputPrimary
                                        type="text"
                                        value={endTime.hr}
                                        readOnly
                                        name="startHour"
                                    />
                                    <div className="p-2 border rounded-lg absolute left-0 -top-full max-h-64 overflow-y-auto invisible -z-50 transition-all duration-300 show-select-hr-end">
                                        {hrs.map((hr, i) => (
                                            <div
                                                key={`${hr}-${i}`}
                                                className="border-b last:border-b-0 p-2 text-center cursor-pointer"
                                                onClick={() =>
                                                    setEndTime((prev) => ({
                                                        ...prev,
                                                        hr: hr < 10 ? `0${hr}` : hr,
                                                    }))
                                                }
                                            >
                                                {hr < 10 ? `0${hr}` : `${hr}`}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div
                                    className="w-14 relative"
                                    ref={endminref}
                                    onClick={selectMinend}
                                >
                                    <InputPrimary
                                        type="text"
                                        value={endTime.min}
                                        readOnly
                                        name="startMin"
                                    />
                                    <div className="p-2 border rounded-lg absolute left-0 -top-full max-h-64 overflow-y-auto invisible transition-all duration-300 show-select-min-end">
                                        {mins.map((min, i) => (
                                            <div
                                                key={`${min}-${i}`}
                                                className="border-b last:border-b-0 p-2 text-center cursor-pointer"
                                                onClick={() =>
                                                    setEndTime((prev) => ({
                                                        ...prev,
                                                        min: min < 10 ? `0${min}` : `${min}`,
                                                    }))
                                                }
                                            >
                                                {min < 10 ? `0${min}` : min}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="p-3 w-4/5 mx-auto my-4 cursor-pointer rounded-full bg-blue text-medium md:text-lg font-bold text-white text-center"
                    onClick={handleListNft}
                >
                    <button className="">Sell</button>
                </div>
            </div>
        </div>
    )
})
