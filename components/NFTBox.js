//We need useState to keep track of that image URI so we import it from react like this:
import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
//we import these abis after updating our front end from the backend
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constants/BasicNft.json"
import Image from "next/image"
//we import this card from web3uikit so we can make these little clickable
import { Card, useNotification } from "web3uikit"
//we imported this ethers here because of that NFT Price thing to make it human readable
import { ethers } from "ethers"
import UpdateListingModal from "./UpdateListingModal"

const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."
    const seperatorLength = separator.length
    const charsToShow = strLen - seperatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars)
    )
}

export default function NFTBox({ price, nftAddress, tokenId, marketplaceAddress, seller }) {
    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    //lets grab the description anad the title of the tokenUI as a state variable
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const hideModal = () => setShowModal(false)
    const dispatch = useNotification()

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    })

    async function updateUI() {
        //we need to first get the tokenURI
        // using the image tag from the tokenURI, get the image
        const tokenURI = await getTokenURI()
        console.log(`The TokenURI is ${tokenURI}`)
        // We are going to cheat a little here... We are grabbing this URI to get that image from it
        if (tokenURI) {
            //Not every browser is IPFS compatible so we change the tokenURI from its eddition to a "https" edition
            //and this is known as using an IPFS gateway
            // IPFS Gateway: A server that will return IPFS files from a "normal" URL.
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            //we await to get the response and we await to convert it to json, thats how we get the response
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            //set image uri to image url
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURIURL)
            //we come down here when we are done setting the description and the title of the tokenUI as a state variable above
            //so we use go down and use this name and descriptions in our card.
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
            // We could render the Image on our sever, and just call our sever.
            // For testnets & mainnet -> use moralis server hooks
            // Have the world adopt IPFS
            // Build our own IPFS gateway
        }
        // get the tokenURI
        // using the image tag from the tokenURI, get the image
    }
    //To make sure our updateUI is called, we make this useEffect
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        } //We only want this to run anytime web3 is enabled
    }, [isWeb3Enabled])

    const isOwnedByUser = seller === account || seller === undefined
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 15)
    //This means if its owned by the user, have the modal pop up
    //if not, we make the buy functionality and we do this by making another runContract function above.. (buy item)
    const handleCardClick = () => {
        isOwnedByUser
            ? setShowModal(true)
            : buyItem({
                  onError: (error) => console.log(error),
                  onSuccess: handleBuyItemSuccess,
              })
    }

    const handleBuyItemSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Item bought!",
            title: "Item Bought",
            position: "topR",
        })
    }

    return (
        <div>
            <div>
                {imageURI ? (
                    <div>
                        <UpdateListingModal
                            isVisible={showModal}
                            tokenId={tokenId}
                            marketplaceAddress={marketplaceAddress}
                            nftAddress={nftAddress}
                            onClose={hideModal}
                        />
                        <Card
                            title={tokenName}
                            description={tokenDescription}
                            onClick={handleCardClick}
                        >
                            <div className="p-2">
                                <div className="flex flex-col items-end gap-2">
                                    <div>#{tokenId}</div>
                                    <div className="italic text-sm">
                                        Owned by {formattedSellerAddress}
                                    </div>
                                    <Image
                                        loader={() => imageURI}
                                        src={imageURI}
                                        height="200"
                                        width="200"
                                    />
                                    <div className="font-bold">
                                        {ethers.utils.formatUnits(price, "ether")} ETH
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    )
}
//Because we used one image tag we saw on the  next/js docs and because of the optimizations it does for
// us at the back end  we are not gonna be able to deploy this site to a static website like IPFS
// because now our website requires a server technically because we have moralis.

/* <Image
  loader={() => imageURI}
  src={imageURI}
  height="200"
  width="200"

  If we do this right, it will dsiplay our image perfectly on our front end..
  */

/*and yes, instead of just showing that image thing, we wrap it in a card */

