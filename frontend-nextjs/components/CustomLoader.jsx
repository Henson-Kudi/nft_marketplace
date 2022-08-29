import Image from "next/image"
import React from "react"

import completeImage from "../assets/images/blue-check-mark-icon.webp"
import loadingImage from "../assets/images/blue-wheel-loading.gif"
import waitingImage from "../assets/images/load-icon.png"

export default function CustomLoader({
    status = "loading" || "complete" || "waiting",
    message = "You will be ask to sign this transaction",
}) {
    return (
        <div
            className={`flex gap-8 align-middle p-6 rounded-md mb-1 ${
                status === "loading" && "border"
            }`}
        >
            <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image
                    src={
                        status === "loading"
                            ? loadingImage
                            : status === "complete"
                            ? completeImage
                            : waitingImage
                    }
                    width={"100%"}
                    height={"100%"}
                />
            </div>
            <div className="my-auto text-lg">{message}</div>
        </div>
    )
}
