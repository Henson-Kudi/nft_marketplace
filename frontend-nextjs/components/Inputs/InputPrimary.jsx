import React from "react"

export default function InputPrimary(props) {
    return (
        <div className="p-1 m-auto">
            <input
                {...props}
                className="input-primary border-2 rounded-xl bg-transparent p-2 w-full outline-0"
            />
        </div>
    )
}
