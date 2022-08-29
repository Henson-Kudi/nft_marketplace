import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css" // import Font Awesome CSS
config.autoAddCss = false

import { NotificationProvider } from "@web3uikit/core"
import { useContext } from "react"
import { MoralisProvider } from "react-moralis"

import Header from "../components/Header"
import "../styles/custom.css"
import "../styles/globals.css"

import { DarkModeProvider } from "../contexts/darkModeprovider"

import { CollectionsProvider } from "../contexts/collectionsProvider"
import { DarkModeContext } from "../contexts/darkModeprovider"

function MyApp({ Component, pageProps }) {
    const { darkMode } = useContext(DarkModeContext)

    return (
        <MoralisProvider initializeOnMount={false}>
            <NotificationProvider initializeOnMount>
                <CollectionsProvider>
                    <DarkModeProvider>
                        <div
                            className={`${
                                darkMode && "bg-dark text-white"
                            } pt-12 md:pt-16 h-screen overflow-y-auto`}
                        >
                            <Header />
                            <Component {...pageProps} />
                        </div>
                    </DarkModeProvider>
                </CollectionsProvider>
            </NotificationProvider>
        </MoralisProvider>
    )
}

export default MyApp
