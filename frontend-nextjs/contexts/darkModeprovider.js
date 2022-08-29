import { createContext, useEffect, useState } from "react"

export const DarkModeContext = createContext(false)

export const DarkModeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false)

    const getDarkMode = async () => {
        const darkMode = localStorage.getItem("darkMode")

        if (darkMode === "true") {
            setDarkMode(true)
            return
        }

        setDarkMode(false)
    }

    useEffect(() => {
        getDarkMode()

        return () => {}
    }, [darkMode])

    const displayDarkMode = () => {
        setDarkMode(true)

        localStorage.setItem("darkMode", "true")
    }
    const removeDarkMode = () => {
        setDarkMode(false)

        localStorage.removeItem("darkMode")
    }

    return (
        <DarkModeContext.Provider value={{ darkMode, displayDarkMode, removeDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    )
}

// export const darkModeContext = useContext(DarkModeContext)
