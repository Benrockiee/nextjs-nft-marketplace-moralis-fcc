//Everything runs through this page>> We have our home page which is the index.js
// So we make a sell page folder >> sell-nft.js but we first start building our
//home page which is the index.js
import "../styles/globals.css"
import { MoralisProvider } from "react-moralis" //After importing this, we wrap up our component thing in our
import Header from "../components/Header" // moralis provider and go back to our header and say
//  export default function Header() BACK TO HEADER NOW >>>>
import Head from "next/head"
import { NotificationProvider } from "web3uikit"
//we pull in our dotenv files in here >>>.
const APP_ID = process.env.NEXT_PUBLIC_APP_ID
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>NFT Marketplace</title>
                <meta name="description" content="NFT Marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
                <NotificationProvider>
                    <Header />
                    <Component {...pageProps} />
                </NotificationProvider>
            </MoralisProvider>
        </div>
    )
}

export default MyApp

//<MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}> Here we put our App ID and the url server from Moralis
