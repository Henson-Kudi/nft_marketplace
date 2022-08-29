import React from "react"

export default function TextArea(props) {
    return (
        <div>
            <textarea
                name=""
                id=""
                // cols="30"
                rows="5"
                {...props}
                className="input-primary border-2 rounded-xl bg-transparent p-2 w-full outline-0"
            />
        </div>
    )
}
