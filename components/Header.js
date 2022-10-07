//We grab our connect button with web3uikit, go down to export function anad return connectButton
//Back in our -app.js we import header from components>>>>>> import Header from "../components/Header"
//and return the header above the component >>>>SEE FILE
import { ConnectButton } from "web3uikit"
//To basically connect our link and urls to different applications, we import"
import Link from "next/link"
//To enable a connectButton, we add the dependency with "yarn add web3uikit moralis react moralis"
//In other to use our web3uikit component, we go to our _app.js and import it now>>
// import { MoralisProvider } from "react-moralis"

export default function Header() {
    return (
        //We make a nav bar, just like div and if we wanted to go to the home page, we make <Link href and all
        <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-3xl">NFT Marketplace</h1>
            <div className="flex flex-row items-center">
                <Link href="/">
                    <a className="mr-4 p-6">Home</a>
                </Link>
                <Link href="/sell-nft">
                    <a className="mr-4 p-6">Sell NFT</a>
                </Link>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
//To format the codes and make it look more nicer, we add "yarn add --dev tailwindcss postcss autoprefixer"
// After its installed, we run "yarn tailwindcss init -p", so now we have our postcss.config.js and
//tailwind.config.js, we grab those files and paste it in there, now that we have tailwind, we can do
//tailwind stuff in our header, we make a div tag and make a tag to enlarge our market place
// <h1 className="py-4 px-4 font-bold text-3xl">NFT Marketplace</h1>
// give our nav bar a class name =  <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
// className="mr-4 p-6" << We do this to both home, and Sell NFT so they can both move away from each other
// <ConnectButton moralisAuth={false} /> <<< we need this to be false so we dont always automatically connect
// to Moralis database, we wanna just connect with our metamask
// SO WE NOW MOVE ON TO SHOWING THESE NFTS IN OUR MARKET PLACE
