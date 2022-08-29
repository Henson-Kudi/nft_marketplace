import React from "react"

export default function InputFile(props) {
    return (
        <div className="border-dashed border-2 rounded-lg max-w-max md:max-w-xs flex justify-center align-middle relative mx-auto my-2">
            <label
                htmlFor={props.htmlFor}
                className="w-95/100 md:h-full px-4 md:px-0 py-4 md:py-20 text-center  cursor-pointer m-auto flex flex-col gap-1 overflow-hidden"
            >
                <span className="text-lg font-bold text-blue underline">{props.label}</span>
                <span>{props.filename}</span>
            </label>
            <input type="file" className="border invisible rounded-md absolute" {...props} />
        </div>
    )
}
