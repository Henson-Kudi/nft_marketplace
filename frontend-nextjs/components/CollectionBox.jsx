import Image from "next/image"
import React from "react"

export default function CollectionBox(props) {
    return (
        <div
            className="w-300 h-300 relative rounded-lg overflow-hidden cursor-pointer my-2 border"
            {...props}
        >
            {props?.image ? (
                <Image
                    src={props.image}
                    loader={() => props.image}
                    width={300}
                    height={300}
                    className="w-full h-full hover:scale-110 transition-all duration-100"
                />
            ) : (
                <div>loading</div>
            )}
            <p className="absolute capitalize left-0 w-full bottom-0 p-4 text-white font-bold text-center bg-light-dark">
                {props?.name}
            </p>
        </div>
    )
}
