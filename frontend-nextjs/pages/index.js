import Image from "next/image"
import { useRouter } from "next/router"
import { useContext } from "react"
import ButtonPrimary from "../components/Buttons/ButtonPrimary"
import TopCollectionBox from "../components/TopCollectionBox"
import { DarkModeContext } from "../contexts/darkModeprovider"

import hwIwk3 from "../assets/images/addnft.svg"
import hwIwk2 from "../assets/images/collection.svg"
import hero from "../assets/images/hero.png"
import hwIwk4 from "../assets/images/sale.svg"
import hwIwk1 from "../assets/images/wallet.svg"
import CollectionBox from "../components/CollectionBox"
import { CollectionsContext } from "../contexts/collectionsProvider"

export default function Home() {
    const { darkMode } = useContext(DarkModeContext)

    const { topCollections, categories } = useContext(CollectionsContext)
    console.log(topCollections, categories)

    const router = useRouter()

    return (
        <div className={`${darkMode && "bg-dark text-white"} p-8 h-full overflow-auto`}>
            <div
                className={`flex flex-col smmd:flex-row gap-2 sm:gap-8 align-middle justify-center smmd:py-20`}
            >
                <div className="left-section h-72 md:h-500 flex flex-col justify-evenly">
                    <div className="font-bold text-2xl md:text-3xl lg:text-4xl text-center">
                        Discover, Collect, and Sell <br />
                        extraordinary NFTS
                    </div>

                    <div className="text-center text-lg md:text-xl lg:text-2xl">
                        @HK market is the largest NFT marketplace where <br /> you will find any nft
                        you want
                    </div>

                    <div className="flex  gap-4 ">
                        <ButtonPrimary
                            title="Explore"
                            className="bg-blue"
                            onClick={() => router.push("/collections")}
                        />
                        <ButtonPrimary
                            title="Create"
                            className="bg-white text-dark"
                            onClick={() => router.push("/create-nft")}
                        />
                    </div>
                </div>

                <div className="right-section h-72 flex align-middle justify-center md:h-500">
                    <div className="w-full h-full flex align-middle justify-center max-w-500 max-h-500">
                        <Image src={hero} className="w-full h-full " />
                    </div>
                </div>
            </div>

            <div>
                <h1 className="font-bold text-center text-xl md:text-2xl py-4 md:py-8">
                    Top Collections
                </h1>

                <div className="top-collections-cont flex gap-2 flex-wrap justify-center">
                    {topCollections?.data?.map((collection, i) => (
                        <TopCollectionBox key={i} index={i + 1} collection={collection} />
                    ))}
                </div>
            </div>

            <div className="py-16">
                <h1 className="font-bold text-center text-xl md:text-2xl py-4 md:py-8">
                    How To Create and Sell Your NFTs
                </h1>

                <div className="flex gap-8 flex-wrap justify-center align-top text-center w-95/100 mx-auto">
                    <div className="max-w-xs">
                        <Image src={hwIwk1} />

                        <h3 className="font-bold text-lg p-2">Set up your wallet</h3>
                        <p>
                            Once you've set up your wallet of choice, connect it to OpenSea by
                            clicking the wallet icon in the top right corner. Learn about the
                        </p>
                    </div>
                    <div className="max-w-xs">
                        <Image src={hwIwk2} />

                        <h3 className="font-bold text-lg p-2">Create your collection</h3>
                        <p>
                            Click My Collections and set up your collection. Add social links, a
                            description, profile & banner images, and set a secondary sales fee.
                        </p>
                    </div>
                    <div className="max-w-xs">
                        <Image src={hwIwk3} />

                        <h3 className="font-bold text-lg p-2">Add your NFTs</h3>
                        <p>
                            Upload your work (image, video, audio, or 3D art), add a title and
                            description, and customize your NFTs with properties, stats, and
                            unlockable content.
                        </p>
                    </div>
                    <div className="max-w-xs">
                        <Image src={hwIwk4} />

                        <h3 className="font-bold text-lg p-2">List them for sale</h3>
                        <p>
                            Choose between auctions, fixed-price listings, and declining-price
                            listings. You choose how you want to sell your NFTs, and we help you
                            sell them!
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <h1 className="font-bold text-center text-xl md:text-2xl py-4 md:py-8">
                    Browse Collections By Category
                </h1>

                <div className="flex flex-wrap gap-2 justify-center align-middle">
                    {categories?.map((category, i) => (
                        <CollectionBox
                            key={`${category.id}-${i}`}
                            onClick={() => router.push(`/categories/${category.id}`)}
                            image={category.image}
                            name={category.name}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
