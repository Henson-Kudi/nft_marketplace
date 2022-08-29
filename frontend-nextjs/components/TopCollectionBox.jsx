import Image from "next/image"
import { useRouter } from "next/router"
import React from "react"

export default function TopCollectionBox({ collection, index }) {
    const router = useRouter()
    return (
        <div
            className="flex gap-4 align-middle w-max p-2 cursor-pointer transition-all duration-300 hover:bg-light-dark hover:text-white rounded-xl border-slate-100 border my-2"
            onClick={() => router.push(`/collections/${collection.id}`)}
        >
            <div className="m-auto">{index < 10 ? `0${index}` : index}</div>
            <div className="m-auto">
                {collection?.logo ? (
                    <Image
                        src={collection?.logo?.replace("ipfs://", "https://ipfs.io/ipfs/")}
                        width={50}
                        height={50}
                        className="border rounded-full"
                        loader={() => collection?.logo?.replace("ipfs://", "https://ipfs.io/ipfs/")}
                    />
                ) : (
                    <div>load</div>
                )}
            </div>
            <div className="flex gap-6 align-middle flex-1 m-auto">
                <div className="my-auto">
                    <div className="font-bold">{collection?.name?.slice(0, 12)}</div>
                    <div className="text-sm text-grey">Min Price {collection?.min_price}</div>
                </div>
                <div className="my-auto">
                    <div className="text-sm">{collection?.max_price}</div>
                    <div className="text-sm">{collection?.price_decimal}</div>
                </div>
            </div>
        </div>
    )
}
