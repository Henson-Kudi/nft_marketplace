import { useRouter } from "next/router"
import React, { useContext } from "react"
import CollectionBox from "../../components/CollectionBox"
import { CollectionsContext } from "../../contexts/collectionsProvider"
import { DarkModeContext } from "../../contexts/darkModeprovider"
import { baseUrl as axios } from "../../utils/axios"
import { handleGetRequest } from "../../utils/requests"

export default function Category({ category }) {
    const router = useRouter()

    const { darkMode } = useContext(DarkModeContext)

    const { collections } = useContext(CollectionsContext)

    const filteredCollections = collections?.filter(
        (collection) => collection.category_id === category.id
    )

    return (
        <div className={`p-6 ${darkMode && "bg-dark text-white"} min-h-screen`}>
            <div className="font-bold text-lg md:text-xl capitalize text-center">
                {category[0]?.name} Collections
            </div>
            <div className="flex flex-wrap gap-2 justify-center align-middle">
                {filteredCollections?.map((collection, i) => (
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

export const getStaticProps = async ({ params }) => {
    const { categoryId } = params

    // const { collections, categories } = useContext(CollectionsContext)

    const category = await handleGetRequest(`/categories/${categoryId}`)

    // const filteredCollections = collections?.filter(
    //     (collection) => collection.category_id === categoryId
    // )
    return {
        props: { category },
    }
}

export const getStaticPaths = async () => {
    const { data } = await axios.get("/categories")

    const paths = data?.map((item) => ({
        params: { categoryId: item.id },
    }))

    return {
        paths: paths,
        fallback: false,
    }
}
