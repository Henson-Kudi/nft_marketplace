import { useRouter } from "next/router"
import React, { useContext } from "react"
import CollectionBox from "../../components/CollectionBox"
import { CollectionsContext } from "../../contexts/collectionsProvider"
import { DarkModeContext } from "../../contexts/darkModeprovider"
import { baseUrl as axios } from "../../utils/axios"

export default function Category({ params }) {
    const { categoryId } = params

    const router = useRouter()

    const { darkMode } = useContext(DarkModeContext)

    const { collections, categories } = useContext(CollectionsContext)

    const category = categories?.filter((category) => category.id === categoryId)

    const filteredCollections = collections?.filter(
        (collection) => collection.category_id === categoryId
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

export const getStaticProps = ({ params }) => {
    return {
        props: { params },
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
