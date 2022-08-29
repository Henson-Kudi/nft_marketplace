import { createContext, useEffect, useState } from "react"
import { useMoralis } from "react-moralis"
import { handleGetRequest } from "../utils/requests"

export const CollectionsContext = createContext({})

export const CollectionsProvider = ({ children }) => {
    const [topCollections, setTopCollections] = useState({})

    const { enableWeb3 } = useMoralis()

    const [categories, setCategories] = useState([{}])

    const [collections, setCollections] = useState([{}])

    const getCollections = async () => {
        const categories = await handleGetRequest("/categories")

        const topCollections = await handleGetRequest("/collections/top-collections")

        const collections = await handleGetRequest("/collections")

        setCollections(collections)

        setTopCollections(topCollections)
        setCategories(categories)
    }

    useEffect(() => {
        getCollections()
        enableWeb3()
        return () => {}
    }, [])

    return (
        <CollectionsContext.Provider value={{ topCollections, categories, collections }}>
            {children}
        </CollectionsContext.Provider>
    )
}
