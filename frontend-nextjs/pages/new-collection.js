import { faChevronCircleDown, faChevronCircleUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNotification } from "@web3uikit/core"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useRef, useState } from "react"
import { useMoralis } from "react-moralis"

import ButtonPrimary from "../components/Buttons/ButtonPrimary"
import CustomLoader from "../components/CustomLoader"
import InputFile from "../components/Inputs/InputFile"
import InputPrimary from "../components/Inputs/InputPrimary"
import TextArea from "../components/Inputs/TextArea"
import { DarkModeContext } from "../contexts/darkModeprovider"
import { baseUrl as axios } from "../utils/axios"

export default function Newcollection() {
    const { darkMode } = useContext(DarkModeContext)

    const { account, isWeb3Enabled, enableWeb3 } = useMoralis()

    const categoriesRef = useRef(null)

    const router = useRouter()

    const dispatchNotification = useNotification()

    const [logo, setLogo] = useState(null)

    const [buttonTitle, setButtenTitle] = useState("Create Collection")

    const [loadingVisible, setLoadingVisible] = useState("invisible")

    const [status, setStatus] = useState({
        status: "loading",
        message: "Creating collection. Please wait",
    })

    const [featuredImage, setFeaturedImage] = useState(null)

    const [bannerImage, setBannerImage] = useState(null)

    const [selectCategory, setSelectCategory] = useState(false)

    const [collectionDetails, setCollectionDetails] = useState({
        category_id: "",
        category_name: "",
        name: "",
        description: "",
        website: "",
        discord: "",
        instagram: "",
        facebook: "",
        telegram: "",
        youtube: "",
    })

    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetchCategories()
        !isWeb3Enabled && enableWeb3()

        return () => {}
    }, [])

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get("/categories")

            setCategories(data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleLogoChange = (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }

        if (!file.type.includes("image")) {
            alert("Please Select valid image.")
            return
        }

        setLogo(file)
    }

    const handleFeaturedImageChange = (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }

        if (!file.type.includes("image")) {
            alert("Please Select valid image.")
            return
        }

        setFeaturedImage(file)
    }

    const handleBannerImageChange = (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }

        if (!file.type.includes("image")) {
            alert("Please Select valid image.")
            return
        }

        setBannerImage(file)
    }

    const handleShowSelectCategory = () => {
        setSelectCategory(!selectCategory)

        categoriesRef.current.classList.toggle("show-collection")
    }

    const handleCollectionDataChange = (e) => {
        const { name, value } = e.target

        setCollectionDetails((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectCategory = (category) => {
        setCollectionDetails((prev) => ({
            ...prev,
            category_id: category.id,
            category_name: category.name,
        }))

        setSelectCategory(!selectCategory)

        categoriesRef.current.classList.toggle("show-collection")
    }

    const handleCreateCollection = async (e) => {
        const formData = new FormData()

        formData.append("logo", logo, `logo.${logo.name.split(".")[1]}`)

        featuredImage &&
            formData.append(
                "featured",
                featuredImage,
                `featured.${featuredImage.name.split(".")[1]}`
            )

        bannerImage &&
            formData.append("banner", bannerImage, `banner.${bannerImage.name.split(".")[1]}`)

        formData.append(
            "data",
            JSON.stringify({
                ...collectionDetails,
                creator: account,
                owner: account,
            })
        )
        try {
            e.target.disabled = true

            setButtenTitle("Submitting")

            setLoadingVisible("visible")
            setStatus((prev) => ({ status: "loading", ...prev }))

            const { data } = await axios.post("/collections", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            setLogo(null)
            setFeaturedImage(null)
            setBannerImage(null)
            setCollectionDetails({
                category_id: "",
                category_name: "",
                name: "",
                description: "",
                website: "",
                discord: "",
                instagram: "",
                facebook: "",
                telegram: "",
                youtube: "",
            })

            dispatchNotification({
                position: "topR",
                type: "success",
                message: "Collection created successfully. Click to view collection",
                title: "Success",
                onClick: () => router.push(`/collections/${data.data.id}`),
            })
        } catch (err) {
            console.log(err)
            dispatchNotification({
                position: "topR",
                type: "error",
                message: err.message,
                title: "Error",
                onClick: () => router.push(`/collections/${data.data.id}`),
            })
        } finally {
            setButtenTitle("Create Collection")
            e.target.disabled = false
            setLoadingVisible("invisible")
            setStatus((prev) => ({ status: "complete", ...prev }))
        }
    }

    return (
        <div className={`${darkMode && "bg-dark text-white"}`}>
            <div className={`w-4/5 m-auto md:w-4/6 lg:w-1/2 py-6`}>
                <div className="border-dashed border-2 w-28 h-28 flex justify-center align-middle relative my-2 rounded-full">
                    <label
                        htmlFor="file"
                        className="text-center cursor-pointer m-auto flex flex-col gap-1 overflow-hidden"
                    >
                        <span className="text-sm font-bold text-blue underline">Chose Logo</span>
                        <span>{logo?.name}</span>
                    </label>
                    <input
                        type="file"
                        onChange={handleLogoChange}
                        id="file"
                        accept="image/*"
                        name="file"
                        className="border invisible rounded-md absolute bg-transparent"
                    />
                </div>
                <div className="flex gap-2">
                    <div className="w-full">
                        <InputFile
                            onChange={handleFeaturedImageChange}
                            label="Featured image"
                            htmlFor="featured"
                            id="featured"
                            name="featured"
                            accept="image/*"
                            filename={featuredImage?.name}
                        />
                    </div>
                    <div className="w-full">
                        <InputFile
                            onChange={handleBannerImageChange}
                            label="Banner image"
                            htmlFor="banner"
                            id="banner"
                            name="banner"
                            accept="image/*"
                            filename={bannerImage?.name}
                        />
                    </div>
                </div>

                <div className="">
                    <div className="">
                        <InputPrimary
                            type="text"
                            name="name"
                            id="name"
                            value={collectionDetails?.name}
                            placeholder="Enter collection name"
                            onChange={handleCollectionDataChange}
                        />
                    </div>
                </div>

                <div>
                    <div className="relative">
                        <InputPrimary
                            readOnly
                            onClick={handleShowSelectCategory}
                            placeholder="Select Category"
                            value={collectionDetails?.category_name}
                        />
                        <FontAwesomeIcon
                            icon={selectCategory ? faChevronCircleUp : faChevronCircleDown}
                            className="absolute top-1/2 right-4 -translate-y-1/2"
                            onClick={handleShowSelectCategory}
                        />

                        <div
                            className={`select-collection absolute -top-full left-0  w-full max-h-52 overflow-y-auto rounded-xl border-2 duration-300 transition-all ease-linear invisible ${
                                darkMode ? "bg-dark" : "bg-white"
                            }`}
                            ref={categoriesRef}
                        >
                            {categories?.map((category, i) => (
                                <div
                                    key={`${category?.id}-${i}`}
                                    className="input-primary border-b-2 last:border-b-0  cursor-pointer p-2 w-full outline-0 hover:bg-light-dark hover:text-white capitalize"
                                    onClick={() => handleSelectCategory(category)}
                                >
                                    {category?.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <TextArea
                        name="description"
                        id="description"
                        value={collectionDetails.description}
                        placeholder="Describe your collection"
                        onChange={handleCollectionDataChange}
                    />
                </div>

                <div>
                    <InputPrimary
                        type="text"
                        name="website"
                        id="website"
                        value={collectionDetails.website}
                        placeholder="Enter your website"
                        onChange={handleCollectionDataChange}
                        className="border-2 rounded-md"
                    />
                    <InputPrimary
                        type="text"
                        name="discord"
                        id="discord"
                        value={collectionDetails.discord}
                        placeholder="Enter your discord url"
                        onChange={handleCollectionDataChange}
                        className="border-2 rounded-md"
                    />
                    <InputPrimary
                        type="text"
                        name="instagram"
                        id="instagram"
                        value={collectionDetails.instagram}
                        placeholder="Enter your instagram link"
                        onChange={handleCollectionDataChange}
                        className="border-2 rounded-md"
                    />
                    <InputPrimary
                        type="text"
                        name="facebook"
                        id="facebook"
                        value={collectionDetails.facebook}
                        placeholder="Enter your facebook link"
                        onChange={handleCollectionDataChange}
                        className="border-2 rounded-md"
                    />
                    <InputPrimary
                        type="text"
                        name="telegram"
                        id="telegram"
                        value={collectionDetails.telegram}
                        placeholder="Enter your telegram invite link"
                        onChange={handleCollectionDataChange}
                        className="border-2 rounded-md"
                    />
                    <InputPrimary
                        type="text"
                        name="youtube"
                        id="youtube"
                        value={collectionDetails.youtube}
                        placeholder="Enter your youtube url"
                        onChange={handleCollectionDataChange}
                        className="border-2 rounded-md"
                    />
                </div>

                <div>
                    <ButtonPrimary
                        title={buttonTitle}
                        className={`${
                            !collectionDetails.name ||
                            !collectionDetails.category_id ||
                            buttonTitle === "Submitting" ||
                            !logo?.type?.includes("image")
                                ? "bg-slate-300 text-grey"
                                : "bg-blue text-white cursor-pointer"
                        } `}
                        onClick={handleCreateCollection}
                        disabled={
                            !collectionDetails.name ||
                            !collectionDetails?.category_id ||
                            !logo ||
                            buttonTitle === "Submitting"
                        }
                    />
                </div>
            </div>
            <div
                className={`fixed top-0 left-0 w-screen h-screen bg-light-dark opacity-95 z-50 flex align-middle ease-linear duration-100 transition-all ${loadingVisible}`}
            >
                <div
                    className={`w-1/2 m-auto rounded-md border p-2 ${
                        darkMode ? "bg-dark" : "bg-white"
                    }`}
                >
                    <CustomLoader status={status.status} message={status.message} />
                </div>
            </div>
        </div>
    )
}
