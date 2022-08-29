import Image from "next/image"
import Link from "next/link"
import React, { useContext, useRef, useState } from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { WalletModal } from "@web3uikit/web3"

// import the icons you need
import {
    faBars,
    faCirclePlus,
    faClockRotateLeft,
    faEye,
    faMoon,
    faSearch,
    faSun,
    faTimes,
    faUser,
    faWallet,
} from "@fortawesome/free-solid-svg-icons"

import { DarkModeContext } from "../contexts/darkModeprovider"

import logo3 from "../assets/images/logo1.png"

export default function Header() {
    const { darkMode, displayDarkMode, removeDarkMode } = useContext(DarkModeContext)

    const headerContRef = useRef()

    const searchBarRef = useRef()

    const [openWalletModal, setOpenWalletModal] = useState(false)

    const toggleNav = (e) => {
        e.stopPropagation()

        headerContRef.current.classList.toggle("header-container")
    }

    const toggleSearchBar = (e) => {
        e.stopPropagation()

        searchBarRef.current.classList.toggle("search-bar-cont")
    }

    const handleSearch = (e) => {
        console.log(e.key)
        if (e.key === "Enter") {
            alert("searched")
            // toggleNav(e)
        }
    }

    const toggleDarkMode = (e) => {
        e.stopPropagation()
        darkMode ? removeDarkMode() : displayDarkMode()
    }

    return (
        <div
            className={`header fixed w-full top-0 left-0 flex justify-between align-middle gap-2 md:flex-row py-2 px-5 md:px-10 border-b rounded z-10 ${
                darkMode ? "bg-dark-sec" : "bg-white"
            }`}
            ref={headerContRef}
        >
            <div className="logo-container w-32 h-8 md:w-56 md:h-14 overflow-hidden">
                <Image src={logo3} className="w-full h-full" />
            </div>

            <div className="search-box flex-1 text-right " ref={searchBarRef}>
                <input
                    type="text"
                    className="search-box border absolute left-1/2 -translate-x-1/2 w-9/10 m-auto sm:static  sm:left-left-unset sm:translate-x-0 border-lightgrey rounded-2xl p-2 hidden md:block outline-0 sm:bg-transparent"
                    onKeyDown={handleSearch}
                    placeholder="Search collections by name or id"
                />
                <FontAwesomeIcon
                    icon={faSearch}
                    className={`p-2 md:hidden search-btn ${darkMode ? "text-white" : "text-grey"}`}
                    onClick={toggleSearchBar}
                />
            </div>

            <div
                className={
                    "nav-bar w-screen h-screen fixed md:flex md:align-middle md:gap-2 md:w-max md:h-max p-2 top-0   overflow-hidden md:relative left-full md:left-0 transition-all duration-300 ease-linear " +
                    `${darkMode ? "bg-dark-sec text-white" : "text-grey"}`
                }
            >
                <div className="navs-cont flex gap-2 flex-col md:flex-row">
                    <Link
                        href={"/collections"}
                        className="nav flex gap-2 align-middle  cursor-pointer md:rounded-md md:px-2"
                    >
                        <a
                            title="Explore Collections"
                            className="nav flex gap-2 align-middle cursor-pointer md:rounded-md md:px-2"
                        >
                            <FontAwesomeIcon icon={faEye} className="mt-auto mb-auto md:hidden" />
                            <span className="text-lg">Explore</span>
                        </a>
                    </Link>

                    <p className="nav flex gap-2 align-middle  cursor-pointer md:rounded-md md:px-2">
                        <FontAwesomeIcon
                            icon={faClockRotateLeft}
                            className="mt-auto mb-auto md:hidden"
                        />
                        <span className="text-lg">Resources</span>
                    </p>

                    <p className="nav md:flex gap-2 align-middle  cursor-pointer hidden md:px-2">
                        <FontAwesomeIcon
                            icon={darkMode ? faSun : faMoon}
                            onClick={toggleDarkMode}
                            className="mt-auto mb-auto"
                        />
                    </p>

                    <Link href={"/create-nft"}>
                        <a
                            title="Create"
                            className="nav flex gap-2 align-middle  cursor-pointer md:rounded-md md:px-2"
                        >
                            <FontAwesomeIcon
                                icon={faCirclePlus}
                                className="mt-auto mb-auto md:hidden"
                            />
                            <span className="text-lg">Create</span>
                        </a>
                    </Link>
                </div>

                <div
                    className={`account flex gap-2 flex-col md:flex-row ${
                        darkMode ? "text-white" : "text-grey"
                    }`}
                >
                    <div className="nav flex gap-2 align-middle  cursor-pointer md:p-2">
                        <FontAwesomeIcon icon={faUser} className="mt-auto mb-auto" />
                        <span className="text-lg md:hidden">Account</span>
                    </div>
                    <div
                        className="nav flex gap-2 align-middle  cursor-pointer md:p-2"
                        onClick={() => setOpenWalletModal(true)}
                    >
                        <FontAwesomeIcon icon={faWallet} className="mt-auto mb-auto" />
                        <span className="text-lg md:hidden">wallet</span>
                    </div>
                </div>

                <div
                    className={`nav flex gap-2 justify-center align-middle w-9/12 mx-auto my-5 p-3 rounded-3xl bg-blue-400 text-center font-medium cursor-pointer md:hidden text-white bg-blue`}
                    onClick={toggleDarkMode}
                >
                    <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="mt-auto mb-auto" />
                    <span className="text-lg">{darkMode ? "Light Mode" : "Night Mode"}</span>
                </div>

                <div
                    className={`nav flex gap-2 justify-center align-middle w-9/12 mx-auto my-5 p-3 rounded-3xl bg-blue-400 text-center font-medium cursor-pointer md:hidden text-white bg-blue`}
                >
                    <span className="text-lg">Connect Wallet</span>
                </div>

                <div className="hamburger absolute top-2 left-9/10 text-lg md:hidden z-2000 cursor-pointer">
                    <FontAwesomeIcon
                        icon={faTimes}
                        onClick={toggleNav}
                        className="close-nav hidden"
                    />
                </div>
            </div>
            <div
                className={`hamburger  text-lg md:hidden z-2000 cursor-pointer ${
                    darkMode ? "text-white" : "text-grey"
                }`}
            >
                <FontAwesomeIcon icon={faBars} onClick={toggleNav} className="open-nav" />
            </div>
            <WalletModal isOpened={openWalletModal} setIsOpened={setOpenWalletModal} />
        </div>
    )
}
