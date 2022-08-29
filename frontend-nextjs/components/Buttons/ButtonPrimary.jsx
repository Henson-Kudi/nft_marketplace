import React, { useContext } from "react"
import { DarkModeContext } from "../../contexts/darkModeprovider"

export default function ButtonPrimary({ className, onClick, title, disabled, btnClass }) {
    const { darkMode } = useContext(DarkModeContext)
    return (
        <div
            className={`py-2 px-2 sm:px-6 border rounded-2xl my-2 w-max text-lg sm:text-xl ${
                darkMode ? "border-dark" : "border-lightgrey"
            } ${className}`}
        >
            <button onClick={onClick} disabled={disabled}>
                {title}
            </button>
        </div>
    )
}
