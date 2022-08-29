import { useRouter } from "next/router"
import React, { useContext } from "react"
import CollectionBox from "../../components/CollectionBox"
import { CollectionsContext } from "../../contexts/collectionsProvider"
import { DarkModeContext } from "../../contexts/darkModeprovider"

export default function Collections() {
    const { collections } = useContext(CollectionsContext)
    const { darkMode } = useContext(DarkModeContext)

    const router = useRouter()

    return (
        <div className={`p-6 ${darkMode && "bg-dark text-white"} min-h-screen`}>
            <div className="font-bold text-lg md:text-xl capitalize text-center">Collections</div>
            <div className="flex flex-wrap gap-2 justify-center align-middle">
                {collections?.map((collection, i) => (
                    <CollectionBox
                        key={`${collection.id}-${i}`}
                        onClick={() => router.push(`/collections/${collection.id}`)}
                        image={collection.logo?.replace("ipfs://", "https://ipfs.io/ipfs/")}
                        name={collection.name}
                    />
                ))}
            </div>
        </div>
    )
}
